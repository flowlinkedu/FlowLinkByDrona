# FlowLink Firestore Security Rules

Copy and paste the following rules into your Firebase Console under **Firestore Database > Rules**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    //-------------------------------------------------------------------------
    // Helper Functions
    //-------------------------------------------------------------------------
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isOwnerByEmail(email) {
      return isSignedIn() && request.auth.token.email == email;
    }
    
    function isNewOwner() {
      return isOwner(request.resource.data.userId);
    }
    
    function isExistingOwner() {
      return isOwner(resource.data.userId);
    }
    
    function isAdminByEmail(adminList) {
      return isSignedIn() && request.auth.token.email in adminList;
    }
    
    function isUserIdImmutable() {
      return request.resource.data.userId == resource.data.userId;
    }
    
    function isSuperAdmin() {
      return isSignedIn() && request.auth.token.email == 'flowlink.2o@gmail.com';
    }
    
    function isMember() {
      return isSignedIn() && request.auth.token.email in resource.data.members;
    }
    
    function isNewMember() {
      return isSignedIn() && request.auth.token.email in request.resource.data.members;
    }
    
    //-------------------------------------------------------------------------
    // User Collection Rules
    //-------------------------------------------------------------------------
    match /users/{email} {
      allow get, update, delete: if isOwnerByEmail(email);
      allow create: if isOwnerByEmail(email) && request.resource.data.email == email;
      allow list: if false;
      
      // User's personal hierarchies
      match /hierarchies/{document=**} {
        allow read, write: if isOwnerByEmail(email);
      }
    }
    
    //-------------------------------------------------------------------------
    // Global Hierarchies Collection Rules
    //-------------------------------------------------------------------------
    match /hierarchies/{document=**} {
      allow get: if true;
      allow list: if isSuperAdmin();
      allow create: if isSignedIn() && isNewMember();
      allow update: if isSignedIn() && (
        isMember() || 
        isAdminByEmail(resource.data.adminEmails) ||
        isSuperAdmin()
      );
      allow delete: if isSignedIn() && (
        isAdminByEmail(resource.data.adminEmails) ||
        isSuperAdmin()
      );
    }
    
    //-------------------------------------------------------------------------
    // Pending Approvals Collection Rules
    //-------------------------------------------------------------------------
    match /pendingApprovals/{approvalId} {
      allow get, list: if isSuperAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isSuperAdmin();
    }
    
    //-------------------------------------------------------------------------
    // Super Admin Collection Rules
    //-------------------------------------------------------------------------
    match /superAdmin/{document=**} {
      allow read, write: if isSuperAdmin();
    }
    
    //-------------------------------------------------------------------------
    // Other Collections
    //-------------------------------------------------------------------------
    match /problems/{problemId} {
      allow get, list: if true;
      allow create: if isSignedIn() && isNewOwner();
      allow update: if isSignedIn() && isExistingOwner() && isUserIdImmutable();
      allow delete: if isSignedIn() && isExistingOwner();
    }
    
    match /solutions/{solutionId} {
      allow get, list: if true;
      allow create: if isSignedIn() && isNewOwner();
      allow update: if isSignedIn() && isExistingOwner() && isUserIdImmutable();
      allow delete: if isSignedIn() && isExistingOwner();
    }
    
    match /announcements/{announcementId} {
      allow get, list: if true;
      allow create: if isSignedIn() && isNewOwner();
      allow update: if isSignedIn() && isExistingOwner() && isUserIdImmutable();
      allow delete: if isSignedIn() && isExistingOwner();
    }
  }
}
```

---

## Data Structure

### Path Structure

Both user hierarchies and global hierarchies use the same clean structure with `sub-nodes`:

**User's hierarchy:**
```
/users/{email}/hierarchies/iiit-bhopal
/users/{email}/hierarchies/iiit-bhopal/sub-nodes/cse
/users/{email}/hierarchies/iiit-bhopal/sub-nodes/cse/sub-nodes/ai
/users/{email}/hierarchies/iiit-bhopal/sub-nodes/cse/sub-nodes/ml
```

**Global hierarchy:**
```
/hierarchies/iiit-bhopal
/hierarchies/iiit-bhopal/sub-nodes/cse
/hierarchies/iiit-bhopal/sub-nodes/cse/sub-nodes/ai
/hierarchies/iiit-bhopal/sub-nodes/cse/sub-nodes/ml
```

### Document Schema

**User hierarchy node:**
```javascript
{
  name: "IIIT Bhopal",
  type: "organization",
  status: "pending", // pending | active | suspended
  createdAt: Timestamp,
  createdBy: "user@example.com"
}
```

**Global hierarchy node:**
```javascript
{
  name: "IIIT Bhopal",
  nameAliases: ["IIIT Bhopal", "IIITB", "Indian Institute of Information Technology Bhopal"],
  type: "organization",
  adminEmails: [], // Empty until Super Admin assigns
  members: ["user1@example.com", "user2@example.com"],
  status: "pending", // pending | active | suspended
  createdAt: Timestamp,
  createdBy: "user@example.com",
  updatedAt: Timestamp
}
```

---

## Name Aliases System

When a user creates a hierarchy node:
1. System searches existing global hierarchies for matching name aliases
2. If found: User is added to existing hierarchy's `members` array, and their name variant is added to `nameAliases`
3. If not found: New global hierarchy is created with `status: "pending"` and `nameAliases: [name]`

This ensures users typing "IIIT Bhopal", "IIITB", or "Indian Institute of Information Technology Bhopal" all join the same organization.

---

## Approval Workflow

1. **User creates organization** → Status is `pending`
2. **Super Admin reviews** → Can approve (status → `active`) or reject (status → `suspended`)
3. **Super Admin assigns admin** → Adds email to `adminEmails` array
4. **Only approved orgs** can have full functionality

---

## Access Control

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| `/users/{email}` | Owner | Owner | Owner | Owner |
| `/users/{email}/hierarchies/**` | Owner | Owner | Owner | Owner |
| `/hierarchies/**` | Public | Auth + Member | Member/Admin | Admin |
| `/pendingApprovals/{id}` | Super Admin | Auth | Super Admin | Super Admin |
| `/superAdmin/approvals` | Super Admin | Super Admin | Super Admin | Super Admin |
| `/problems/{id}` | Public | Auth | Owner | Owner |
| `/solutions/{id}` | Public | Auth | Owner | Owner |
| `/announcements/{id}` | Public | Auth | Owner | Owner |

---

## New Collections

### `/pendingApprovals` Collection

Stores all pending approval requests for super admin review.

**Document Schema:**
```javascript
{
  approvalId: "iiit-bhopal-1703847293847",  // Unique approval ID
  name: "IIIT Bhopal",                       // Organization name
  type: "organization",                       // Node type
  hierarchyPath: "hierarchies/iiit-bhopal",  // Path to the hierarchy document
  createdBy: "user@example.com",             // User who created the org
  createdAt: Timestamp,                       // When created
  status: "pending"                           // pending | approved | rejected
}
```

### `/superAdmin/approvals` Document

Stores approval IDs that super admin has processed.

**Document Schema:**
```javascript
{
  approvedIds: ["approval-id-1", "approval-id-2"],   // Array of approved IDs
  rejectedIds: ["approval-id-3"],                    // Array of rejected IDs
  updatedAt: Timestamp                               // Last update time
}
```

---

## How It Works

1. **User creates a node** → Saved to both `/users/{email}/hierarchies/...` and `/hierarchies/...`
2. **Global node tracks members** → User's email added to `members` array
3. **User deletes a node** → Removed from user's hierarchy, removed from global `members` array
4. **Last member leaves** → Global node is deleted
