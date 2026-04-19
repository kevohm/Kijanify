# SmartSeason Field Monitoring System

## 🌱 Full Stack Developer Technical Assessment

## Overview

SmartSeason Field Monitoring System is a web application designed to help track crop progress across multiple fields during a growing season. It enables coordinators (Admins) and Field Agents to collaborate efficiently by monitoring field activities, updating crop stages, and generating insights through a simple dashboard.

The system demonstrates:

* Clean system design
* Core business logic implementation
* A usable and intuitive interface

---

## 🚀 Features

### 1. Authentication & Roles

The system supports two user roles:

* **Admin (Coordinator)**
* **Field Agent**

Users can securely log in and only access features relevant to their role.

---

### 2. Field Management

Admins can:

* Create, edit, and manage fields
* Assign fields to specific Field Agents

Each field contains:

* Name
* Crop Type
* Planting Date
* Current Stage

---

### 3. Field Updates

Field Agents can:

* Update the field stage
* Add notes and observations

Admins can:

* View all fields
* Monitor updates made by agents

---

### 4. Field Lifecycle

Fields follow a simple lifecycle:

* Planted
* Growing
* Ready
* Harvested

---

### 5. Field Status Logic

Each field has a computed **status** based on its lifecycle stage and activity:

| Status    | Logic                                                                                    |
| --------- | ---------------------------------------------------------------------------------------- |
| Active    | Field is in "Planted" or "Growing" stage and receiving updates                           |
| At Risk   | Field is not updated for a defined period (e.g., 7+ days) or shows inconsistent progress |
| Completed | Field is in "Harvested" stage                                                            |

**Approach:**

* A timestamp (`lastUpdated`) is tracked for each field
* If no updates occur within a threshold (configurable), the field becomes **At Risk**
* Once the stage is **Harvested**, the field is marked **Completed**
* Otherwise, it remains **Active**

---

### 6. Dashboard

#### Admin Dashboard:

* Total number of fields
* Status breakdown (Active, At Risk, Completed)
* Overview of all field activities

#### Field Agent Dashboard:

* Assigned fields
* Status summary of their fields
* Recent updates and notes

---

## 🛠️ Tech Stack

**Backend:**

* Node.js (Express) *(or Laravel / Django alternative)*

**Frontend:**

* React

**Database:**

* PostgreSQL *(or MySQL)*

**Other Tools:**

* JWT for authentication
* REST API architecture

---

## 📦 Project Structure

```
/project-root
  /backend
    /controllers
    /models
    /routes
    /services
  /frontend
    /components
    /pages
    /services
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-link>
cd smartseason
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# configure environment variables

npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 4. Database Setup

* Create a PostgreSQL/MySQL database
* Run migrations:

```bash
npm run migrate
```

---

## 🔐 Demo Credentials

**Admin**

```
email: admin@smartseason.com
password: password123
```

**Field Agent**

```
email: agent@smartseason.com
password: password123
```

---

## 🌍 Live Demo (Optional)

[Add deployment link here]

---

## 🧠 Design Decisions

* **Role-Based Access Control (RBAC):** Ensures separation of concerns between Admins and Agents
* **RESTful API Design:** Keeps backend modular and scalable
* **Computed Field Status:** Avoids redundant storage by deriving status dynamically
* **Simple Lifecycle Model:** Keeps system intuitive and easy to extend
* **Modular Frontend Components:** Improves reusability and maintainability

---

## ⚠️ Assumptions

* A field is assigned to only one agent at a time
* Field updates are timestamped automatically
* "At Risk" threshold is configurable (default: 7 days)
* No real-time updates (polling or refresh-based system)

---

## 📌 Future Improvements

* Real-time notifications (WebSockets)
* Mobile-friendly interface
* Geo-location for fields (maps integration)
* Image uploads for field observations
* Advanced analytics & reporting

---

## ✅ Evaluation Focus

This project prioritizes:

* Clear and logical structure
* Functional core features
* Readable and maintainable code
* Simple and intuitive UI

---

## 📬 Submission

Submit:

* GitHub repository link
* Demo credentials
* (Optional) Live deployment link

**Deadline:** 25/04/2026

---

## 👨‍💻 Author

Kevin Kibet

---
