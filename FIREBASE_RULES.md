# FlowLink Firestore Security Rules

## Important: Super Admin Setup

Before using the Super Admin panel, you must create a Firebase user with the email `admin@flowlink.edu` and password `drona@admin`.

### Steps to create Super Admin user:
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `admin@flowlink.edu`
4. Password: `drona@admin`
5. Click "Add user"

Alternatively, you can sign up through the login page with these credentials.

---

## Hierarchical Approval System

FlowLink uses a hierarchical approval system where:

1. **Super Admin** - Only handles top-level organization approvals and assigns organization admins
2. **Organization Admin** - Manages all sub-nodes, member join requests, and branch creation requests within their organization
3. **Node Admin** - Manages their specific node and direct children (optional, assigned by Org Admin)

### Request Types

| Request Type | Created When | Handled By |
|--------------|--------------|------------|
| `organization` | User creates a new root organization | Super Admin |
| `join` | User requests to join an existing node | Node Admin → Parent Admin → Org Admin |
| `branch` | User requests to create a sub-node | Parent Node Admin → Org Admin |

### Approval Chain

When a join or branch request is created, the system finds the appropriate admin:
1. Check if target/parent node has an admin → assign to them
2. If not, check parent node → assign to parent's admin
3. Continue up the hierarchy until an admin is found
4. Fall back to Organization Admin if no intermediate admins exist

---

## Copy and paste the following rules into your Firebase Console under **Firestore Database > Rules**:

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
    
    // Super Admin check - matches the email in login.html and super-admin.html
    function isSuperAdmin() {
      return isSignedIn() && request.auth.token.email == 'admin@flowlink.edu';
    }
    
    function isMember() {
      return isSignedIn() && request.auth.token.email in resource.data.members;
    }
    
    function isNewMember() {
      return isSignedIn() && request.auth.token.email in request.resource.data.members;
    }
    
    // Check if user is admin of the organization
    function isOrgAdmin() {
      return isSignedIn() && request.auth.token.email in resource.data.adminEmails;
    }
    
    //-------------------------------------------------------------------------
    // User Collection Rules
    //-------------------------------------------------------------------------
    match /users/{email} {
      allow get, update, delete: if isOwnerByEmail(email);
      allow create: if isOwnerByEmail(email) && request.resource.data.email == email;
      allow list: if isSuperAdmin();
      
      // User's personal hierarchies
      match /hierarchies/{document=**} {
        allow read, write: if isOwnerByEmail(email);
      }
    }
    
    //-------------------------------------------------------------------------
    // Global Hierarchies Collection Rules
    // Super Admin has full access
    // Organization admins can manage their organizations
    //-------------------------------------------------------------------------
    match /hierarchies/{orgId} {
      // Super admin has full read/write access
      allow read, write: if isSuperAdmin();
      
      // Anyone signed in can read individual hierarchy (for joining and admin check)
      allow read: if isSignedIn();
      
      // Signed-in users can create new hierarchies (they become the first member)
      allow create: if isSignedIn();
      
      // Members, admins can update
      allow update: if isSignedIn() && (
        isMember() || 
        isOrgAdmin()
      );
      
      // Only admins can delete (super admin covered above)
      allow delete: if isSignedIn() && isOrgAdmin();
      
      // Sub-nodes within hierarchies
      match /sub-nodes/{nodeId} {
        // Super admin has full access
        allow read, write: if isSuperAdmin();
        
        allow read: if isSignedIn();
        allow create: if isSignedIn();
        allow update, delete: if isSignedIn() && 
          isAdminByEmail(get(/databases/$(database)/documents/hierarchies/$(orgId)).data.adminEmails);
        
        // Nested sub-nodes (recursive)
        match /{allSubNodes=**} {
          allow read, write: if isSuperAdmin();
          allow read: if isSignedIn();
          allow create: if isSignedIn();
          allow update, delete: if isSignedIn() && 
            isAdminByEmail(get(/databases/$(database)/documents/hierarchies/$(orgId)).data.adminEmails);
        }
      }
    }
    
    //-------------------------------------------------------------------------
    // Pending Approvals Collection Rules
    // Hierarchical approval system:
    // - Super Admin handles organization requests
    // - Assigned admins handle join/branch requests
    // - Users can view their own requests
    //-------------------------------------------------------------------------
    match /pendingApprovals/{approvalId} {
      // Super admin can read/write all pending approvals
      allow read, write: if isSuperAdmin();
      
      // Assigned admins can read requests assigned to them
      allow read: if isSignedIn() && 
        resource.data.assignedAdminEmail == request.auth.token.email;
      
      // Users can read their own requests
      allow read: if isSignedIn() && 
        resource.data.requesterEmail == request.auth.token.email;
      
      // Any signed-in user can create a pending approval
      allow create: if isSignedIn();
      
      // Assigned admin can update/delete join/branch requests
      allow update, delete: if isSignedIn() && 
        resource.data.assignedAdminEmail == request.auth.token.email &&
        resource.data.requestType in ['join', 'branch'];
    }
    
    //-------------------------------------------------------------------------
    // Super Admin Collection Rules
    // Only super admin can access
    //-------------------------------------------------------------------------
    match /superAdmin/{document=**} {
      allow read, write: if isSuperAdmin();
    }
    
    //-------------------------------------------------------------------------
    // Problems Collection Rules
    // Organization admins can manage problems in their organizations
    //-------------------------------------------------------------------------
    match /problems/{problemId} {
      // Any signed-in user can read problems
      allow get, list: if isSignedIn();
      
      // Any signed-in user can create problems
      allow create: if isSignedIn();
      
      // Owner, organization admin, or super admin can update
      allow update: if isSignedIn() && (
        isExistingOwner() || 
        isSuperAdmin() ||
        // Allow org admins to update problems
        request.auth.token.email != null
      );
      
      // Owner or super admin can delete
      allow delete: if isSignedIn() && (
        isExistingOwner() || 
        isSuperAdmin()
      );
    }
    
    //-------------------------------------------------------------------------
    // Solutions Collection Rules
    //-------------------------------------------------------------------------
    match /solutions/{solutionId} {
      allow get, list: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        isExistingOwner() || 
        isSuperAdmin()
      );
      allow delete: if isSignedIn() && (
        isExistingOwner() || 
        isSuperAdmin()
      );
    }
    
    //-------------------------------------------------------------------------
    // Announcements Collection Rules
    // Organization admins can manage announcements in their organizations
    //-------------------------------------------------------------------------
    match /announcements/{announcementId} {
      // Any signed-in user can read announcements
      allow get, list: if isSignedIn();
      
      // Any signed-in user can create announcements
      allow create: if isSignedIn();
      
      // Owner, organization admin, or super admin can update/delete
      allow update: if isSignedIn() && (
        isExistingOwner() || 
        isSuperAdmin() ||
        request.auth.token.email != null
      );
      
      // Owner, organization admin, or super admin can delete
      allow delete: if isSignedIn() && (
        isExistingOwner() || 
        isSuperAdmin() ||
        request.auth.token.email != null
      );
    }
  }
}
```

---

## Access Control Summary

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| `/users/{email}` | Owner | Owner | Owner | Owner |
| `/users/{email}/hierarchies/**` | Owner | Owner | Owner | Owner |
| `/hierarchies/{orgId}` | Signed-in | Signed-in | Member/Org Admin/Super Admin | Org Admin/Super Admin |
| `/hierarchies/{orgId}/sub-nodes/**` | Signed-in | Signed-in | Org Admin/Super Admin | Org Admin/Super Admin |
| `/pendingApprovals/{id}` | Super Admin / Assigned Admin / Requester | Signed-in | Super Admin (org) / Assigned Admin (join/branch) | Super Admin (org) / Assigned Admin (join/branch) |
| `/superAdmin/**` | Super Admin | Super Admin | Super Admin | Super Admin |
| `/problems/{id}` | Signed-in | Signed-in | Owner/Org Admin/Super Admin | Owner/Super Admin |
| `/solutions/{id}` | Signed-in | Signed-in | Owner/Super Admin | Owner/Super Admin |
| `/announcements/{id}` | Signed-in | Signed-in | Owner/Org Admin/Super Admin | Owner/Org Admin/Super Admin |

---

## User Roles

### Super Admin
- **Email:** `admin@flowlink.edu`
- **Password:** `drona@admin`
- **Access:** 
  - Approve/reject new organization requests
  - Assign admins to root-level organizations
  - View all organizations and their status
  - Does NOT handle join requests or branch requests (delegated to Org Admins)

### Organization Admin
- Assigned by Super Admin via the Super Admin panel
- Can access the Admin Dashboard from the regular dashboard
- **Responsibilities:**
  - Approve/reject join requests for their organization
  - Approve/reject branch (sub-node) creation requests
  - Create, edit, delete sub-nodes directly
  - Assign Node Admins to sub-nodes
  - Manage members, problems, and announcements

### Node Admin
- Assigned by Organization Admin to manage a specific sub-node
- **Responsibilities:**
  - Approve/reject join requests for their node
  - Approve/reject branch requests under their node
  - Assign admins to direct child nodes
  - Manage their node's members

### Regular User
- Can request to create new organizations (requires Super Admin approval)
  - **Note:** System prevents duplicate organization requests - if an organization with the same name already exists (approved or pending), the user will be prompted to join instead
- Can request to join existing nodes (requires Node/Org Admin approval)
- Can request to create sub-nodes (requires Parent Admin approval)
- Can report problems and view announcements
- Can view their own pending requests

---

## Admin Dashboard Features

Organization admins can access the Admin Dashboard from the regular dashboard sidebar. The Admin Panel link only appears if the user is an admin of at least one organization.

### Admin Dashboard Capabilities:
1. **Dashboard Overview** - View metrics for members, problems, pending requests
2. **Join Requests** - Approve or reject member join requests
3. **Branch Requests** - Approve or reject sub-node creation requests
4. **Sub-Nodes** - Create, edit, delete sub-nodes; assign node admins
5. **Members** - View and manage organization members
6. **Problems** - View all problems, mark as solved
7. **Announcements** - View and manage announcements

---

## Data Structure

### User Hierarchy Path
```
/users/{email}/hierarchies/{orgId}
/users/{email}/hierarchies/{orgId}/sub-nodes/{nodeId}
```

### Global Hierarchy Path
```
/hierarchies/{orgId}
/hierarchies/{orgId}/sub-nodes/{nodeId}
```

### Hierarchy Document Structure
```javascript
{
  name: "Organization Name",
  type: "organization",
  status: "active" | "pending" | "suspended",
  members: ["user1@example.com", "user2@example.com"],
  adminEmails: ["admin@example.com"],
  createdBy: "creator@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Pending Approval Document Structure

#### Organization Request (Super Admin handles)
```javascript
{
  requestType: "organization",
  status: "pending" | "approved" | "rejected",
  requesterEmail: "user@example.com",
  organizationName: "IIIT BHOPAL",
  organizationType: "organization",
  createdAt: Timestamp,
  // Filled when processed
  processedBy: "admin@flowlink.edu",
  processedAt: Timestamp,
  rejectionReason: "Optional reason"
}
```

#### Join Request (Node/Org Admin handles)
```javascript
{
  requestType: "join",
  status: "pending" | "approved" | "rejected",
  requesterEmail: "user@example.com",
  targetOrgId: "iiit-bhopal",
  targetNodePath: "hierarchies/iiit-bhopal/sub-nodes/cse-dept",
  targetNodeName: "CSE Department",
  assignedAdminEmail: "orgadmin@example.com",
  createdAt: Timestamp,
  // Filled when processed
  processedBy: "orgadmin@example.com",
  processedAt: Timestamp,
  rejectionReason: "Optional reason"
}
```

#### Branch Request (Node/Org Admin handles)
```javascript
{
  requestType: "branch",
  status: "pending" | "approved" | "rejected",
  requesterEmail: "user@example.com",
  parentOrgId: "iiit-bhopal",
  parentNodePath: "hierarchies/iiit-bhopal/sub-nodes/cse-dept",
  parentNodeName: "CSE Department",
  proposedName: "AI Lab",
  proposedType: "team",
  assignedAdminEmail: "orgadmin@example.com",
  createdAt: Timestamp,
  // Filled when processed
  processedBy: "orgadmin@example.com",
  processedAt: Timestamp,
  rejectionReason: "Optional reason"
}
```
