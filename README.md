# Blood Donation Application (B12-A11 Category-01)


##  Project name: BloodDrop

A MERN Stack blood donation platform that connects blood donors with people who need blood. Users can create blood donation requests, search donors by location & blood group, manage requests from dashboards, and optionally donate funds to support the organization.

## 🔗 Live Website
- Live URL: https://blood-drop-b7711.web.app
## 🎯 Purpose
The goal of this project is to build a user-friendly Blood Donation system with role-based dashboards (Admin, Donor, Volunteer), secured routes using JWT/Firebase Auth, and a smooth experience for searching donors and managing donation requests.

---

## ✅ Key Features

### 🔐 Authentication & Security
- Email + password login/registration (Firebase Authentication)
- JWT token exchange from Firebase token for securing private APIs
- Protected dashboard routes
- Firebase & MongoDB credentials secured using environment variables

### 👤 Roles & Dashboards
- **Donor**
  - View profile & update profile
  - Create donation requests
  - View own requests (pagination + filtering)
  - Mark requests done/canceled when in progress
- **Volunteer**
  - View all donation requests
  - Update donation status only
- **Admin**
  - View admin stats (users, requests, total funding)
  - Manage users (block/unblock, change role)
  - Full control over donation requests

### 🔎 Public Pages
- Search donors by **blood group + district + upazila**
- View all pending donation requests
- Donation request details page (private) with donate confirmation modal

### 💰 Funding (Challenge Requirement)
- Funding page (private)
- Shows list of funding history (name, amount, date)
- Total funding shown in Admin/Volunteer dashboard stats


---

## 🧰 Tech Stack

### Client
- React + Vite
- Tailwind CSS + DaisyUI
- React Router DOM
- Axios
- Firebase Authentication

### Server
- Node.js + Express.js
- MongoDB
- Firebase Admin
- JWT Authentication
- CORS configured for local & production

---

## 📦 Packages Used

### ✅ Client-Side NPM Packages
- **react**
- **react-dom**
- **react-router-dom**
- **axios**
- **firebase**
- **tailwindcss**
- **postcss**
- **autoprefixer**
- **daisyui**
- **react-icons**
- **react-hot-toast** 
- **framer-motion** 
- **Swiper** 

>

### ✅ Server-Side NPM Packages
- **express**
- **cors**
- **dotenv**
- **mongodb**
- **jsonwebtoken**
- **firebase-admin**
- **nodemon** (dev dependency)

