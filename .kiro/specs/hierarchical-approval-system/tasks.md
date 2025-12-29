# Implementation Tasks: Hierarchical Approval System

## Task 1: Update Firestore Rules for Hierarchical Approvals
- [x] Add new rules for pendingApprovals with requestType-based access control
- [x] Allow assigned admins to read/update/delete join and branch requests
- [x] Allow users to read their own pending requests
- [x] Restrict Super Admin to only organization-type requests
- [x] Update FIREBASE_RULES.md documentation

**Files:** `firestore.rules`, `FIREBASE_RULES.md`

---

## Task 2: Simplify Super Admin Dashboard
- [x] Filter pendingApprovals to only show `requestType: "organization"` or legacy approvals without requestType
- [x] Update Organizations page to only show root-level hierarchies (no sub-nodes)
- [x] Update Admin Control to only allow assigning admins to root organizations
- [x] Remove any sub-node management UI elements
- [x] Update metrics to only count organization-level data

**Files:** `super-admin.html`

---

## Task 3: Enhance Admin Dashboard with Join/Branch Request Sections
- [x] Add "Join Requests" tab in sidebar navigation
- [x] Add "Branch Requests" tab in sidebar navigation
- [x] Create Join Requests section with table showing pending join requests
- [x] Create Branch Requests section with table showing pending branch requests
- [x] Implement approve/reject functionality for join requests
- [x] Implement approve/reject functionality for branch requests
- [x] Add rejection reason modal
- [x] Update metrics to include join/branch request counts

**Files:** `admin-dashboard.html`

---

## Task 4: Add Sub-Node Management to Admin Dashboard
- [x] Add "Sub-Nodes" tab in sidebar navigation
- [x] Create sub-node tree view showing organization structure
- [x] Implement create sub-node functionality
- [x] Implement edit sub-node functionality
- [x] Implement delete sub-node functionality
- [x] Add node admin assignment modal
- [x] Allow assigning/removing admins from sub-nodes

**Files:** `admin-dashboard.html`

---

## Task 5: Update Welcome Page for Request-Based Flow
- [x] Modify "Add Node" (root level) to create organization request instead of direct creation
- [x] Modify "Add Child" to create branch request instead of direct creation
- [x] Add "Join" button to existing nodes
- [x] Implement join request creation flow
- [x] Show pending request status on nodes (pending join, pending branch)
- [x] Add visual indicator for nodes user has requested to join
- [x] Update node card to show request status

**Files:** `welcome.html`

---

## Task 6: Implement Approval Chain Logic
- [x] Create `findApproverForNode()` function to traverse hierarchy and find appropriate admin
- [x] Create `createJoinRequest()` function
- [x] Create `createBranchRequest()` function
- [x] Handle edge case: no admin at any level (escalate to org admin)
- [x] Add this logic as shared functions (can be in welcome.html and admin-dashboard.html)

**Files:** `welcome.html`, `admin-dashboard.html`

---

## Task 7: Implement Request Processing in Admin Dashboard
- [x] Implement `approveJoinRequest()` - add user to node's members array
- [x] Implement `rejectJoinRequest()` - update status and add rejection reason
- [x] Implement `approveBranchRequest()` - create new sub-node, add requester as member
- [x] Implement `rejectBranchRequest()` - update status and add rejection reason
- [x] Add success/error toast notifications
- [x] Refresh data after processing requests

**Files:** `admin-dashboard.html`

---

## Task 8: Add User Request Status Tracking
- [x] Show user's pending requests in welcome.html
- [x] Add "My Requests" section or indicator
- [x] Show request status (pending/approved/rejected)
- [ ] Show rejection reason if rejected
- [ ] Allow user to cancel pending requests
- [x] Prevent duplicate organization requests (check if org exists before creating)

**Files:** `welcome.html`

---

## Task 9: Update Super Admin Organization Approval Flow
- [x] When approving organization, prompt to assign admin immediately
- [x] Add "Assign Admin" step to approval modal
- [x] Make admin assignment optional but recommended
- [x] Update organization status to "active" only after approval

**Files:** `super-admin.html`

---

## Task 10: Testing and Documentation
- [x] Update FIREBASE_RULES.md with new data structures
- [ ] Test complete flow: User creates org → Super Admin approves → Org Admin manages
- [ ] Test join request flow with different admin configurations
- [ ] Test branch request flow with escalation
- [ ] Test edge cases (no admin, multiple admins, deep nesting)
- [ ] Update README.md if needed

**Files:** `FIREBASE_RULES.md`, `README.md`
