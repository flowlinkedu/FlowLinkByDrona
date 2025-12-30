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
        // Super Admin can update user hierarchies (for approval status)
        allow read, write: if isSuperAdmin();
        // Any signed-in user can read/create/update (for org admins approving join/branch requests)
        allow read, create, update: if isSignedIn();
      }
      
      // User's notifications (for admin request tracking)
      match /notifications/{notifId} {
        allow read, write: if isOwnerByEmail(email);
        // Super Admin can manage notifications
        allow read, write: if isSuperAdmin();
        // Any signed-in user can create/update/delete notifications (for approving/rejecting requests)
        allow create, update, delete: if isSignedIn();
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
        resource.data.requestType in ['join', 'branch'];
    }
    
    //-------------------------------------------------------------------------
    // Pending Problem Approvals Collection Rules
    // Problem governance system:
    // - Users submit problems for approval
    // - Assigned node admins review and approve/reject/escalate
    // - Super Admin has full access
    //-------------------------------------------------------------------------
    match /pendingProblemApprovals/{problemId} {
      // Super admin can read/write all pending problem approvals
      allow read, write: if isSuperAdmin();
      
      // Any signed-in user can read (admins need to see problems assigned to them)
      allow read: if isSignedIn();
      
      // Any signed-in user can create a pending problem approval
      allow create: if isSignedIn();
      
      // Assigned admins can update (approve/reject/escalate)
      allow update: if isSignedIn() && (
        request.auth.token.email in resource.data.assignedAdminEmails ||
        resource.data.createdBy == request.auth.token.email
      );
      
      // Assigned admins or creator can delete
      allow delete: if isSignedIn() && (
        request.auth.token.email in resource.data.assignedAdminEmails ||
        resource.data.createdBy == request.auth.token.email
      );
      
      // Allow listing for admins
      allow list: if isSignedIn();
    }
    
    //-------------------------------------------------------------------------
    // Pending Announcement Approvals Collection Rules
    //-------------------------------------------------------------------------
    match /pendingAnnouncementApprovals/{announcementId} {
      allow read, write: if isSuperAdmin();
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && (
        request.auth.token.email in resource.data.assignedAdminEmails ||
        resource.data.createdBy == request.auth.token.email
      );
      allow list: if isSignedIn();
    }
    
    //-------------------------------------------------------------------------
    // Archived Problems Collection Rules
    //-------------------------------------------------------------------------
    match /archivedProblems/{problemId} {
      allow read, write: if isSuperAdmin();
      allow read: if isSignedIn();
      allow create, update: if isSignedIn();
      allow delete: if isSuperAdmin();
    }
    
    //-------------------------------------------------------------------------
    // Escalated Problems Collection Rules
    //-------------------------------------------------------------------------
    match /escalatedProblems/{problemId} {
      allow read, write: if isSuperAdmin();
      allow read: if isSignedIn();
      allow create, update: if isSignedIn();
      allow list: if isSignedIn();
    }
    
    //-------------------------------------------------------------------------
    // Super Admin Collection Rules (Optional - for tracking)
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
        // Allow org admins to update problems (check if user email is in any hierarchy's adminEmails)
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
      
      // Owner, organization admin, or super admin can update
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
| `/users/{email}/hierarchies/**` | Owner / Super Admin | Owner / Super Admin / Any Signed-in | Owner / Super Admin / Any Signed-in | Owner / Super Admin |
| `/users/{email}/notifications/{notifId}` | Owner / Super Admin | Any Signed-in | Any Signed-in | Any Signed-in |
| `/hierarchies/{orgId}` | Signed-in | Signed-in | Member/Org Admin/Super Admin | Org Admin/Super Admin |
| `/hierarchies/{orgId}/sub-nodes/**` | Signed-in | Signed-in | Org Admin/Super Admin | Org Admin/Super Admin |
| `/pendingApprovals/{id}` | Super Admin / Assigned Admin / Requester | Signed-in | Super Admin (org) / Assigned Admin (join/branch) | Super Admin (org) / Assigned Admin (join/branch) |
| `/pendingProblemApprovals/{id}` | Signed-in | Signed-in | Assigned Admins / Creator | Assigned Admins / Creator |
| `/pendingAnnouncementApprovals/{id}` | Signed-in | Signed-in | Assigned Admins / Creator | Assigned Admins / Creator |
| `/archivedProblems/{id}` | Signed-in | Signed-in | Signed-in | Super Admin |
| `/escalatedProblems/{id}` | Signed-in | Signed-in | Signed-in | Super Admin |
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
  - **Merge** organization requests into existing organizations (for typos/alternate names)
  - Assign admins to root-level organizations
  - View all organizations and their status
  - Does NOT handle join requests or branch requests (delegated to Org Admins)

#### Merge Feature
When a user creates an organization with a name that's similar to an existing one (e.g., "IIIT Bhapal" instead of "IIIT Bhopal"), Super Admin can:
1. Click **Merge** button on the pending request
2. Select the target organization to merge into
3. Choose to **Retain** or **Vanish** the alternate name:
   - **Retain as Alias**: Keeps the name in `nameAliases` array. Future users typing this name will be recognized and redirected.
   - **Vanish Name**: Doesn't keep the alternate name.
4. The user's wrong hierarchy is deleted and replaced with the correct one (pending status)
5. A join request is created for the organization admin to approve

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
  nameAliases: ["Alternate Name 1", "Alternate Name 2"], // For merged names
  type: "organization",
  status: "active" | "pending" | "suspended",
  members: ["user1@example.com", "user2@example.com"],
  adminEmails: ["admin@example.com"],
  createdBy: "creator@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Admin Notifications Document Structure
Path: `/users/{adminEmail}/notifications/pending`
```javascript
{
  joinRequests: ["join-123456", "join-merge-789012"],  // Array of pending join request IDs
  branchRequests: ["branch-123456"],                   // Array of pending branch request IDs
  updatedAt: Timestamp
}
```

This notification system allows admins to quickly fetch only their pending requests without scanning all pendingApprovals. When a request is created, its ID is added to the assigned admin's notification arrays. When approved/rejected, the ID is removed from both the notification array and the pendingApprovals collection.

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

---

## Problem Governance System

FlowLink includes a Problem Governance & Approval Center where:

1. **Users** submit problems through the Compose Problem feature
2. **Node Admins** review, approve, reject, escalate, or archive problems
3. **Super Admin** has full oversight of all problems

### Problem Approval Flow

```
User submits problem → pendingProblemApprovals collection
                              ↓
              Node Admin reviews (from notifications)
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                    ↓
      Approve              Reject              Escalate
         ↓                    ↓                    ↓
   Move to /problems    Delete from pending   Move to higher admin
   Notify user          Notify user           Update escalation chain
```

### Pending Problem Approval Document Structure
Path: `/pendingProblemApprovals/{problemId}`
```javascript
{
  title: "Problem Title",
  description: "Detailed problem description",
  category: "academic" | "hostel" | "infrastructure" | "sports" | "technical" | "general" | "other",
  priority: "low" | "medium" | "high",
  targetNodes: [
    { path: "hierarchies/org-id/sub-nodes/node-id", name: "Node Name" }
  ],
  hierarchyPaths: ["hierarchies/org-id/sub-nodes/node-id"],
  assignedAdminEmails: ["admin1@example.com", "admin2@example.com"],
  status: "pending" | "approved" | "rejected" | "escalated" | "archived",
  createdBy: "user@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // Filled when processed
  processedBy: "admin@example.com",
  processedAt: Timestamp,
  rejectionReason: "Optional reason for rejection",
  escalationReason: "Optional reason for escalation",
  escalationPath: ["node-admin@example.com", "org-admin@example.com"]
}
```

### Admin Notifications for Problem Approvals
Path: `/users/{adminEmail}/notifications/pending`
```javascript
{
  joinRequests: ["join-123456"],
  branchRequests: ["branch-123456"],
  problemApprovals: ["problem-123456", "problem-789012"],  // NEW: Problem approval IDs
  updatedAt: Timestamp
}
```

### Archived Problem Document Structure
Path: `/archivedProblems/{problemId}`
```javascript
{
  // All fields from original problem
  ...problemData,
  archivedBy: "admin@example.com",
  archivedAt: Timestamp,
  archiveReason: "Duplicate" | "Resolved" | "Invalid" | "Other",
  originalCollection: "pendingProblemApprovals" | "problems"
}
```

### Escalated Problem Document Structure
Path: `/escalatedProblems/{problemId}`
```javascript
{
  // All fields from original problem
  ...problemData,
  escalatedBy: "node-admin@example.com",
  escalatedAt: Timestamp,
  escalationReason: "Requires higher authority",
  previousAdminEmail: "node-admin@example.com",
  currentAdminEmail: "org-admin@example.com",
  escalationLevel: 1 | 2 | 3,  // How many times escalated
  escalationHistory: [
    {
      from: "node-admin@example.com",
      to: "org-admin@example.com",
      reason: "Beyond node scope",
      timestamp: Timestamp
    }
  ]
}
```

---

## Admin Dashboard Access

Node admins and organization admins can access the Admin Dashboard from the user dashboard. The "Admin Panel" link appears in the sidebar only if the user is an admin of at least one node or organization.

### Admin Check Logic
The system checks if a user is an admin by:
1. Checking if user email is in any organization's `adminEmails` array
2. Recursively checking all sub-nodes for the user's email in `adminEmails`

### Admin Dashboard Capabilities

| Feature | Org Admin | Node Admin |
|---------|-----------|------------|
| View all pending approvals | ✓ | Only their node |
| Approve/Reject join requests | ✓ | Only their node |
| Approve/Reject branch requests | ✓ | Only their node |
| Approve/Reject problem submissions | ✓ | Only their node |
| Escalate problems | ✓ | ✓ |
| Archive problems | ✓ | ✓ |
| Moderate announcements | ✓ | Only their node |
| Create sub-nodes | ✓ | Under their node |
| Assign node admins | ✓ | Under their node |

---

## Announcement Moderation

Similar to problems, announcements can go through a moderation flow:

### Pending Announcement Approval Document Structure
Path: `/pendingAnnouncementApprovals/{announcementId}`
```javascript
{
  title: "Announcement Title",
  content: "Announcement content",
  targetNodes: [{ path: "...", name: "..." }],
  assignedAdminEmails: ["admin@example.com"],
  visibility: "node" | "organization" | "global",
  isUrgent: true | false,
  expiryDate: Timestamp,
  status: "pending" | "approved" | "rejected",
  createdBy: "user@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```
