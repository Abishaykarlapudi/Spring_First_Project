# VCube Directory Hub (Spring Boot + React CRUD & Auth System)

A full-stack Contact & Directory Management web application built with **Spring Boot 4 (Java 25)** and **React 19 + Vite**, featuring modern UI & UX design, full authentication, and instant directory operations.

---

## 🚀 Features

- **🔐 Authentication Portal (Login & Registration)**:
  - **Sign In page**: Clean email/password inputs, password visibility toggle, "Remember Me" option.
  - **Quick Demo Login**: 1-click test login shortcut for instant evaluation without typing.
  - **Registration page**: Full name, email, password strength meter (Weak/Medium/Strong), password confirmation, and terms validation.
  - **Persistent Session**: User state is securely stored and restored on page refresh.
  - **User Profile in Navbar**: Displays the authenticated user's avatar, name, role badge, and a **Sign Out** button.

- **🎨 Modern SaaS Dashboard Design**:
  - Full Light & Dark mode support with persistent user preference across both Auth and Dashboard pages.
  - Clean typography using Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*).
  - Responsive layout optimized for desktop, tablet, and mobile screens.

- **⚡ Rich UX Directory Interactions**:
  - **Live Multi-Field Search**: Real-time filtering across Name, Email, Phone, and ID as you type.
  - **Quick ID Lookup**: Dedicated lookup input to find and inspect records by primary key.
  - **Table View & Card Grid View**: Easily switch between a high-density data table and modern responsive card grid.
  - **Sorting**: Sort by ID (Ascending/Descending) or Name (A-Z / Z-A).
  - **CSV Export**: One-click download of directory records as `.csv`.
  - **Click-to-Copy**: Instant clipboard copy for email addresses and phone numbers.
  - **Action Modals**:
    - Add New Contact modal with client-side field validation.
    - Edit Contact modal with pre-populated values.
    - Quick "Patch Name" modal leveraging the backend's `@PatchMapping` endpoint.
    - Contact Details modal with direct `mailto:` and `tel:` links.
    - Safe Delete Confirmation modal with item preview.
  - **Toast Notifications**: Stackable floating alerts for success, error, info, and warnings.
  - **Keyboard Shortcuts**: <kbd>Ctrl</kbd> + <kbd>K</kbd> to quickly add a new record.

---

## 🛠️ Tech Stack

- **Backend**:
  - Spring Boot 4.1.1 (Java 25)
  - Spring Data JPA
  - MySQL Database Driver (`mysql-connector-j`)
  - Lombok
- **Frontend**:
  - React 19
  - Vite 8
  - Axios
  - Lucide React (modern icon suite)
  - Custom Design Tokens CSS system

---

## 📡 REST API Endpoints

### Authentication (`/auth`):
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user account |
| `POST` | `/auth/login` | Authenticate user credentials |
| `GET` | `/auth/me/{id}` | Retrieve user profile by ID |

### Directory Records (`/dmo`):
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dmo/get` | Retrieve all directory records |
| `GET` | `/dmo/getid/{id}` | Retrieve a single record by ID |
| `POST` | `/dmo/add` | Create a new contact record |
| `PUT` | `/dmo/update/{id}` | Update all fields of an existing record |
| `PATCH` | `/dmo/updatename/{id}` | Update only the contact name |
| `DELETE` | `/dmo/delete/{id}` | Delete a record by ID |

---

## 💻 How to Run

### 1. Start the Spring Boot Backend
Ensure MySQL is running on port 3306 with database `batch78` (configured in `demo/src/main/resources/application.properties`).

Open a terminal in the `demo` directory:
```powershell
cd c:\Users\kabis\Desktop\vcube\maven\demo\demo
.\mvnw.cmd spring-boot:run
```
The server will start on port `5000`.

### 2. Start the React Frontend
Open a terminal in the `demo-frontend` directory:
```powershell
cd c:\Users\kabis\Desktop\vcube\maven\demo\demo-frontend
npm run dev
```
The frontend will start on `http://localhost:5173`.
