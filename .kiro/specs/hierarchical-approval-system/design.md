# Design Document: Hierarchical Approval System

## Overview

This document outlines the technical design for implementing the hierarchical approval system in FlowLink. The system establishes a clear chain of authority where Super Admin only handles top-level organization approvals, while all sub-node management is delegated to organization and node admins.

## Architecture

### Current State
- Super Admin manages all organizations and can see all pending approvals
- Organization admins exist but have limited functionality
- Users can create organizations and sub-nodes directly
- No distinction between join requests and branch creation requests

### Target State
- Super Admin ONLY manages root-level organizations and assigns organization admins
- Organization Admins manage all sub-nodes, member approvals, and node admin assignments
- Node Admins manage their specific nodes and direct children
- All requests go through an approval chain that escalates up the hierarchy

## Data Models

### 1. Enhanced pendingApprovals Collection

```javascript
// Collection: /pendingApprovals/{approvalId}
{
  // Common fields
  requestType: "organization" | "join" | "branch",
  status: "pending" | "approved" | "rejected",
  requesterEmail: "user@example.com",
  createdAt: Timestamp,
  
  // For organization requests (Super Admin handles)
  // requestType: "organization"
  organizationName: "IIIT BHOPAL",
  organizationType: "organization",
  
  // For join requests (Node/Org Admin handles)
  // requestType: "join"
  targetOrgId: "iiit-bhopal",
  targetNodePath: "hierarchies/iiit-bhopal/sub-nodes/cse-dept", // Full path to target node
  targetNodeName: "CSE Department",
  assignedAdminEmail: "admin@org.com", // Admin who should handle this request
  
  // For branch requests (Node/Org Admin handles)
  // requestType: "branch"
  parentOrgId: "iiit-bhopal",
  parentNodePath: "hierarchies/iiit-bhopal/sub-nodes/cse-dept",
  parentNodeName: "CSE Department",
  proposedName: "AI Lab",
  proposedType: "team",
  assignedAdminEmail: "admin@org.com",
  
  // Processing fields (filled when approved/rejected)
  processedBy: "admin@example.com",
  processedAt: Timestamp,
  rejectionReason: "Optional reason for rejection"
}
```

### 2. Enhanced hierarchies Collection

```javascript
// Collection: /hierarchies/{orgId}
{
  name: "IIIT BHOPAL",
  type: "organization",
  status: "active" | "pending" | "suspended",
  members: ["user1@example.com", "user2@example.com"],
  adminEmails: ["orgadmin@example.com"], // Organization-level admins
  createdBy: "creator@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// Sub-collection: /hierarchies/{orgId}/sub-nodes/{nodeId}
{
  name: "CSE Department",
  type: "department",
  status: "active",
  members: ["member1@example.com"],
  adminEmails: ["nodeadmin@example.com"], // Node-specific admins (optional)
  createdBy: "creator@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Key Functions

### 1. findApproverForNode(orgId, nodePath)
Finds the appropriate admin to handle a request by traversing up the hierarchy.

```javascript
async function findApproverForNode(orgId, nodePath) {
  // 1. Check if target node has an admin
  const nodeDoc = await getDoc(doc(db, nodePath));
  if (nodeDoc.exists() && nodeDoc.data().adminEmails?.length > 0) {
    return nodeDoc.data().adminEmails[0];
  }
  
  // 2. Traverse up to parent nodes
  const pathParts = nodePath.split('/sub-nodes/');
  for (let i = pathParts.length - 1; i > 0; i--) {
    const parentPath = pathParts.slice(0, i).join('/sub-nodes/');
    const parentDoc = await getDoc(doc(db, parentPath));
    if (parentDoc.exists() && parentDoc.data().adminEmails?.length > 0) {
      return parentDoc.data().adminEmails[0];
    }
  }
  
  // 3. Fall back to organization admin
  const orgDoc = await getDoc(doc(db, 'hierarchies', orgId));
  if (orgDoc.exists() && orgDoc.data().adminEmails?.length > 0) {
    return orgDoc.data().adminEmails[0];
  }
  
  return null; // No admin found - should not happen for approved orgs
}
```

### 2. createJoinRequest(userEmail, orgId, nodePath)
Creates a join request and assigns it to the appropriate admin.

```javascript
async function createJoinRequest(userEmail, orgId, nodePath) {
  const approverEmail = await findApproverForNode(orgId, nodePath);
  const nodeDoc = await getDoc(doc(db, nodePath));
  
  await addDoc(collection(db, 'pendingApprovals'), {
    requestType: 'join',
    status: 'pending',
    requesterEmail: userEmail,
    targetOrgId: orgId,
    targetNodePath: nodePath,
    targetNodeName: nodeDoc.data().name,
    assignedAdminEmail: approverEmail,
    createdAt: serverTimestamp()
  });
}
```

### 3. createBranchRequest(userEmail, orgId, parentPath, proposedName, proposedType)
Creates a branch creation request.

```javascript
async function createBranchRequest(userEmail, orgId, parentPath, proposedName, proposedType) {
  const approverEmail = await findApproverForNode(orgId, parentPath);
  const parentDoc = await getDoc(doc(db, parentPath));
  
  await addDoc(collection(db, 'pendingApprovals'), {
    requestType: 'branch',
    status: 'pending',
    requesterEmail: userEmail,
    parentOrgId: orgId,
    parentNodePath: parentPath,
    parentNodeName: parentDoc.data().name,
    proposedName: proposedName,
    proposedType: proposedType,
    assignedAdminEmail: approverEmail,
    createdAt: serverTimestamp()
  });
}
```

## UI Changes

### 1. Super Admin Dashboard (super-admin.html)

**Simplifications:**
- Pending Approvals: Only show `requestType: "organization"` requests
- Organizations: Only show root-level organizations (no sub-nodes)
- Admin Control: Only allow assigning admins to root organizations

**Remove:**
- Any sub-node management functionality
- Member join request handling
- Branch creation request handling

### 2. Admin Dashboard (admin-dashboard.html)

**New Sections:**
- **Join Requests Tab**: Show pending join requests where `assignedAdminEmail` matches current user
- **Branch Requests Tab**: Show pending branch requests where `assignedAdminEmail` matches current user
- **Sub-Node Management**: Create, edit, delete sub-nodes within their organization
- **Node Admin Assignment**: Assign admins to sub-nodes

**Enhanced Features:**
- Filter requests by organization (if admin of multiple orgs)
- Approve/Reject with optional reason
- View request details before action

### 3. Welcome Page (welcome.html)

**Changes:**
- "Add Node" for root level → Creates organization request (goes to Super Admin)
- "Add Child" for existing nodes → Creates branch request (goes to Node/Org Admin)
- New "Join" button on nodes → Creates join request (goes to Node/Org Admin)
- Show pending request status on nodes user has requested to join

## Firestore Rules Updates

```javascript
// New rules for hierarchical approval system
match /pendingApprovals/{approvalId} {
  // Super admin can read all
  allow get, list: if isSuperAdmin();
  
  // Organization/Node admins can read requests assigned to them
  allow get, list: if isSignedIn() && 
    resource.data.assignedAdminEmail == request.auth.token.email;
  
  // Users can read their own requests
  allow get, list: if isSignedIn() && 
    resource.data.requesterEmail == request.auth.token.email;
  
  // Any signed-in user can create requests
  allow create: if isSignedIn();
  
  // Super admin can update/delete organization requests
  allow update, delete: if isSuperAdmin() && 
    resource.data.requestType == 'organization';
  
  // Assigned admin can update/delete join/branch requests
  allow update, delete: if isSignedIn() && 
    resource.data.assignedAdminEmail == request.auth.token.email &&
    resource.data.requestType in ['join', 'branch'];
}
```

## Request Flow Diagrams

### Organization Creation Flow
```
User creates organization → pendingApprovals (requestType: "organization")
                                    ↓
                            Super Admin reviews
                                    ↓
                    Approved: Create in /hierarchies, prompt to assign admin
                    Rejected: Notify user with reason
```

### Join Request Flow
```
User clicks "Join" on node → findApproverForNode() → pendingApprovals (requestType: "join")
                                                              ↓
                                                    Assigned Admin reviews
                                                              ↓
                                    Approved: Add user to node's members array
                                    Rejected: Notify user with reason
```

### Branch Creation Flow
```
User clicks "Add Child" → findApproverForNode(parent) → pendingApprovals (requestType: "branch")
                                                                ↓
                                                      Assigned Admin reviews
                                                                ↓
                                    Approved: Create sub-node, add requester as first member
                                    Rejected: Notify user with reason
```

## Implementation Phases

### Phase 1: Data Model Updates
- Update pendingApprovals collection structure
- Add requestType field to existing approvals
- Update Firestore rules

### Phase 2: Super Admin Simplification
- Filter pending approvals to only show organization requests
- Remove sub-node management from super admin
- Update admin assignment to only work on root organizations

### Phase 3: Admin Dashboard Enhancement
- Add Join Requests section
- Add Branch Requests section
- Add sub-node management capabilities
- Add node admin assignment functionality

### Phase 4: Welcome Page Updates
- Change "Add Node" to create organization request
- Change "Add Child" to create branch request
- Add "Join" button to nodes
- Show pending request status

## Testing Considerations

1. **Approval Chain Testing**: Verify requests escalate correctly when no admin exists at a level
2. **Permission Testing**: Ensure admins can only see/act on requests assigned to them
3. **Status Tracking**: Verify users can see their pending requests
4. **Edge Cases**: 
   - Organization with no admin assigned
   - Deeply nested nodes with no intermediate admins
   - Multiple admins at same level
