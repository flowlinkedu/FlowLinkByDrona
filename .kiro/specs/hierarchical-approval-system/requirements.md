# Requirements Document

## Introduction

This document defines the requirements for a hierarchical approval system in FlowLink. The system establishes a clear chain of authority where the Super Admin only handles top-level organization approvals and admin assignments, while all sub-node management and member approvals are delegated to organization admins and node-specific admins.

## Glossary

- **Super_Admin**: The platform owner with email `admin@flowlink.edu` who manages top-level organizations only
- **Organization**: A root-level hierarchy node (e.g., "IIIT BHOPAL")
- **Organization_Admin**: An admin assigned by Super Admin to manage an organization
- **Sub_Node**: A child node within an organization (e.g., departments, branches, teams)
- **Node_Admin**: An admin assigned by Organization Admin to manage a specific sub-node
- **Member**: A regular user who belongs to one or more nodes
- **Join_Request**: A request from a user to join an existing node
- **Branch_Request**: A request from a user to create a new sub-node under an existing node
- **Approval_Chain**: The hierarchy of admins who can approve requests (lowest node admin → parent node admin → organization admin)

## Requirements

### Requirement 1: Super Admin Role Limitation

**User Story:** As a Super Admin, I want to only manage top-level organizations and their primary admins, so that I can focus on platform governance without being overwhelmed by sub-node management.

#### Acceptance Criteria

1. THE Super_Admin SHALL only see and approve/reject top-level organization creation requests
2. THE Super_Admin SHALL only assign admins to root-level organizations (not sub-nodes)
3. WHEN a sub-node is created, THE Super_Admin SHALL NOT receive approval requests for it
4. THE Super_Admin SHALL NOT manage members or sub-node admins directly
5. WHEN viewing pending approvals, THE Super_Admin SHALL only see organization-level requests

### Requirement 2: Organization Admin Responsibilities

**User Story:** As an Organization Admin, I want to manage all aspects of my organization including sub-nodes, members, and sub-node admins, so that I have full control over my organization's structure.

#### Acceptance Criteria

1. WHEN assigned as Organization Admin, THE Organization_Admin SHALL have full control over all sub-nodes within their organization
2. THE Organization_Admin SHALL be able to create, edit, and delete sub-nodes
3. THE Organization_Admin SHALL be able to assign Node_Admins to any sub-node
4. THE Organization_Admin SHALL be able to approve or reject branch creation requests
5. THE Organization_Admin SHALL be able to approve or reject member join requests for any node without a specific Node_Admin
6. WHEN a sub-node has no Node_Admin, THE Organization_Admin SHALL handle all approvals for that node

### Requirement 3: Node Admin Responsibilities

**User Story:** As a Node Admin, I want to manage my specific node and its direct children, so that I can maintain order within my area of responsibility.

#### Acceptance Criteria

1. WHEN assigned as Node_Admin, THE Node_Admin SHALL manage only their assigned node and its direct children
2. THE Node_Admin SHALL be able to approve or reject member join requests for their node
3. THE Node_Admin SHALL be able to approve or reject branch creation requests under their node
4. THE Node_Admin SHALL be able to assign admins to direct child nodes
5. IF a Node_Admin is not assigned to a child node, THEN THE parent Node_Admin SHALL handle approvals for that child

### Requirement 4: Member Join Request Flow

**User Story:** As a user, I want to request to join an existing node, so that I can become a member of that organization/department/team.

#### Acceptance Criteria

1. WHEN a user requests to join a node, THE System SHALL create a Join_Request
2. THE Join_Request SHALL be sent to the lowest-level admin in the Approval_Chain
3. IF the node has a Node_Admin, THEN THE Node_Admin SHALL receive the request
4. IF the node has no Node_Admin, THEN THE parent node's admin SHALL receive the request
5. IF no parent admin exists, THEN THE Organization_Admin SHALL receive the request
6. WHEN a Join_Request is approved, THE System SHALL add the user to the node's members list
7. WHEN a Join_Request is rejected, THE System SHALL notify the user with the rejection reason

### Requirement 5: Branch Creation Request Flow

**User Story:** As a member, I want to request creation of a new sub-node under an existing node, so that I can organize my group/team/department.

#### Acceptance Criteria

1. WHEN a member requests to create a branch, THE System SHALL create a Branch_Request
2. THE Branch_Request SHALL include the proposed node name, type, and parent node
3. THE Branch_Request SHALL be sent to the admin of the parent node
4. IF the parent node has no admin, THEN THE request SHALL escalate to the next parent's admin
5. WHEN a Branch_Request is approved, THE System SHALL create the new sub-node
6. WHEN a Branch_Request is approved, THE requesting user SHALL become the first member of the new node
7. THE approving admin MAY optionally assign the requesting user as the new node's admin

### Requirement 6: Approval Chain Escalation

**User Story:** As a system, I want to automatically escalate approval requests up the hierarchy when no admin exists at a level, so that requests are never stuck without an approver.

#### Acceptance Criteria

1. WHEN a request is created, THE System SHALL identify the appropriate admin using the Approval_Chain
2. THE System SHALL start from the lowest level (target node) and move up until an admin is found
3. IF no Node_Admin exists at the target level, THEN THE System SHALL check the parent node
4. THE escalation SHALL continue until an Organization_Admin is reached
5. THE Organization_Admin SHALL be the final fallback for all requests within their organization

### Requirement 7: Admin Dashboard Updates

**User Story:** As an Organization Admin or Node Admin, I want to see only the pending requests relevant to my scope, so that I can efficiently manage my responsibilities.

#### Acceptance Criteria

1. WHEN an Organization_Admin views pending requests, THE System SHALL show requests for nodes without specific admins
2. WHEN a Node_Admin views pending requests, THE System SHALL show only requests for their assigned node and admin-less children
3. THE Admin_Dashboard SHALL display separate sections for Join_Requests and Branch_Requests
4. THE Admin_Dashboard SHALL show the request type, requester, target node, and date
5. THE Admin_Dashboard SHALL provide Approve and Reject buttons for each request

### Requirement 8: Request Status Tracking

**User Story:** As a user, I want to track the status of my join and branch requests, so that I know if they are pending, approved, or rejected.

#### Acceptance Criteria

1. THE System SHALL store all requests with status: pending, approved, or rejected
2. WHEN a user views their dashboard, THE System SHALL show their pending requests
3. THE System SHALL notify users when their request status changes
4. THE System SHALL store the approver/rejector email and timestamp for audit purposes
5. IF a request is rejected, THE System SHALL store and display the rejection reason

### Requirement 9: Pending Approvals Data Structure

**User Story:** As a developer, I want a clear data structure for pending approvals, so that the system can efficiently route requests to the correct admin.

#### Acceptance Criteria

1. THE pendingApprovals collection SHALL store: requestType (join/branch), targetNodePath, requesterEmail, status, createdAt
2. FOR Join_Requests, THE document SHALL include the target node path
3. FOR Branch_Requests, THE document SHALL include parentNodePath, proposedName, proposedType
4. THE document SHALL include approverEmail and processedAt when processed
5. THE document SHALL include rejectionReason if rejected

### Requirement 10: Super Admin Dashboard Simplification

**User Story:** As a Super Admin, I want my dashboard to only show organization-level items, so that I'm not distracted by sub-node details.

#### Acceptance Criteria

1. THE Super_Admin dashboard SHALL only show root-level organizations in the Organizations page
2. THE Super_Admin pending approvals SHALL only show new organization requests
3. THE Super_Admin Admin Control page SHALL only allow assigning admins to root organizations
4. THE Super_Admin SHALL NOT see sub-node creation requests or member join requests
5. WHEN an organization is approved, THE Super_Admin SHALL be prompted to assign an admin
