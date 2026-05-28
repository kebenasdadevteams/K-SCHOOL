# 🚀 K-School Development Standards & Workflow

To keep the system scalable, clean, maintainable, and avoid merge conflicts, all developers must follow the same project standards and workflow.

---

# 📁 Project Structure

```bash
project-root/
│
├── frontend/
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       │
│       ├── components/
│       │   ├── ui/
│       │   ├── forms/
│       │   ├── tables/
│       │   └── modals/
│       │
│       ├── pages/
│       │   ├── auth/
│       │   └── public/
│       │
│       ├── dashboards/
│       │   ├── student/
│       │   ├── teacher/
│       │   ├── pastor/
│       │   ├── admin/
│       │   ├── editor/
│       │   ├── developer/
│       │   └── podcast/
│       │
│       ├── layouts/
│       │   ├── DashboardLayout.jsx
│       │   └── AuthLayout.jsx
│       │
│       ├── contexts/
│       │   └── AuthContext.jsx
│       │
│       ├── routes/
│       │   ├── AppRoutes.jsx
│       │   └── ProtectedRoute.jsx
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── auth-service.js
│       │   ├── course-service.js
│       │   └── podcast-service.js
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useFetch.js
│       │
│       ├── utils/
│       │   ├── constants.js
│       │   └── helpers.js
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── controllers/
│   │   ├── auth-controller.js
│   │   ├── user-controller.js
│   │   ├── course-controller.js
│   │   ├── content-controller.js
│   │   └── podcast-controller.js
│   │
│   ├── routes/
│   │   ├── auth-routes.js
│   │   ├── user-routes.js
│   │   ├── course-routes.js
│   │   ├── content-routes.js
│   │   └── podcast-routes.js
│   │
│   ├── middleware/
│   │   ├── auth-middleware.js
│   │   ├── role-middleware.js
│   │   ├── error-middleware.js
│   │   └── validation-middleware.js
│   │
│   ├── models/
│   │
│   ├── services/
│   │   ├── auth-service.js
│   │   ├── podcast-service.js
│   │   └── scheduler-service.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   └── logger.js
│   │
│   ├── app.js
│   └── server.js
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── schema/
│
├── docs/
│   ├── api/
│   ├── architecture/
│   └── er-diagrams/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 👥 TEAM DASHBOARD RESPONSIBILITIES

## Abenezer + Elshaday

### Assigned Dashboards

* Signup / Signin System
* Role Selector
* Student Dashboard

### Frontend Responsibilities

* Login & signup forms UI
* Role selector UI
* Student dashboard UI
* Course modules interface
* Assignments interface

### Backend Responsibilities

* JWT authentication
* Role-based routing & middleware
* Student data APIs
* Assignment submit/fetch APIs


## Henok + Saba + Lemi

### Assigned Dashboards

* Teacher Dashboard
* Pastor Dashboard

### Frontend Responsibilities

* Teacher dashboard UI
* Course editor interface
* Assignment review system
* Pastor dashboard UI
* Member management interfaces

### Backend Responsibilities

* Courses, chapters, and lessons APIs
* Assignment feedback APIs
* Student progress tracking
* Pastor data APIs

---

## Henok + Abenezer + Lemi

### Assigned Dashboards

* Editor Dashboard
* Developer Dashboard
* Admin Dashboard

### Frontend Responsibilities

* Editor dashboard UI
* Posts & media management
* Developer dashboard tools
* Admin dashboard interfaces

### Backend Responsibilities

* Content CRUD APIs
* Admin APIs
* Audit logs
* Developer tools APIs
* Permissions & role management

---

## Ashemafi

### Assigned Dashboard

* Podcast Dashboard

### Frontend Responsibilities

* Podcast management UI
* Podcast upload & publishing interface
* Podcast analytics components

### Backend Responsibilities

* Podcast CRUD APIs
* Media processing APIs
* Podcast scheduling & automation
* Podcast integrations & streaming services

---

# 🌐 API NAMING CONVENTION

All APIs must start with:

```bash
/api/v1/
```

## Examples

```bash
POST /api/v1/auth/signup
POST /api/v1/auth/login
GET  /api/v1/auth/me

GET  /api/v1/courses
POST /api/v1/courses

GET  /api/v1/posts
POST /api/v1/posts

GET  /api/v1/podcasts
POST /api/v1/podcasts

GET  /api/v1/promotions
POST /api/v1/promotions
```

---

# 📦 RESPONSE FORMAT STANDARD

## Success Response

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

# 📂 FILE NAMING RULES

## Use

* lowercase
* kebab-case

✅ GOOD

```bash
auth-controller.js
student-dashboard.jsx
role-selector.jsx
```

❌ BAD

```bash
AuthController.js
studentDashboard.jsx
RoleSelector.jsx
```

---

# ⚛ REACT COMPONENT NAMING

## React Components

Use PascalCase

✅ GOOD

```bash
StudentDashboard.jsx
ProtectedRoute.jsx
RoleSelector.jsx
```

## Hooks

```bash
useAuth.js
useAssignments.js
```

## Contexts

```bash
AuthContext.jsx
```

---

# 🗄 DATABASE NAMING RULES

## Use

* snake_case
* plural table names

✅ GOOD

```bash
users
user_roles
audit_logs
podcast_episodes
```

❌ BAD

```bash
User
UserRole
AuditLog
```

---

# 🌿 GIT BRANCH STRATEGY

## Main Branches

```bash
main
develop
```

## Rules

* Never push directly to main
* Use feature branches
* Merge through Pull Requests only

## Feature Branch Examples

```bash
feature/auth-system
feature/student-dashboard
feature/teacher-system
feature/admin-system
feature/editor-dashboard
feature/podcast-system
```

## Bug Fix Examples

```bash
fix/login-error
fix/sidebar-routing
```

---

# 📌 GIT WORKFLOW RULES

## Branch Structure

```bash
main
↓
develop
↓
feature/your-task-name
```

## Rules

### 1. DO NOT push directly to main

❌ WRONG

```bash
git push origin main
```

✅ CORRECT

```bash
feature branch → Pull Request → develop
```

---

### 2. Create your own feature branch from develop

```bash
git checkout develop
git pull origin develop
git checkout -b feature/auth-system
```

## Other Examples

```bash
feature/student-dashboard
feature/course-api
feature/editor-dashboard
feature/podcast-system
feature/assignment-system
```

---

### 3. Work only inside your own branch

```bash
git add .
git commit -m "add login API"
git push origin feature/auth-system
```

---

### 4. After finishing your task

Create Pull Request:

```bash
feature branch
↓
develop
```

Never directly to main.

---

### 5. develop is the integration branch

All completed features are merged into develop for testing.

---

# 🔄 PROJECT FLOW

```bash
Developer Work
      ↓
feature/your-task
      ↓
Pull Request
      ↓
develop
      ↓
testing
      ↓
main
```

---

# ⚠ DAILY RULE BEFORE STARTING WORK

```bash
git checkout develop
git pull origin develop
```

This prevents conflicts and keeps everyone synchronized.

---

# 📝 COMMIT MESSAGE RULES

✅ GOOD

```bash
git commit -m "Setup JWT authentication"
git commit -m "Add student dashboard routes"
git commit -m "Implement role selector UI"
```

❌ BAD

```bash
git commit -m "update"
git commit -m "fix"
```

---

# 🔐 AUTHENTICATION RULES

* JWT Authentication
* Role-Based Access Control (RBAC)
* One user can have multiple roles
* Default signup role = student
* If user has multiple roles → show Role Selector
* If user has one role → direct dashboard access

---

# 🛡 ROUTE PROTECTION

## Public Routes

```bash
/
/about
/contact
```

## Protected Routes

```bash
/dashboard/*
/student/*
/teacher/*
/admin/*
/editor/*
/podcast/*
```

---

# ⚙ DEVELOPMENT WORKFLOW

1. Pull latest develop branch
2. Create feature branch
3. Develop feature
4. Push feature branch
5. Create Pull Request
6. Review
7. Merge into develop

⚠ Never merge directly into main.

---

# 🎯 PROJECT GOAL

Transform the current static church website into a scalable dynamic role-based platform with:

* Authentication System
* Student Learning System
* Teacher Management System
* Editor CMS
* Podcast Automation
* Promotions/Billboards
* Admin Control Panel
* Developer Tools Dashboard

---

# 🔥 IMPORTANT TEAM RULES

* Maintain consistent UI across dashboards
* Enforce secure role-based permissions
* Follow clean API architecture
* Keep frontend/backend separation strict
* Reuse shared components/layouts
* Avoid duplicated logic
* Test before merging
