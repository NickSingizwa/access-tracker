# 🏛️ Public Service Access Tracker

A full-stack web application that improves accessibility and understanding of public services.

## Features

- 📋 View public service requirements and processes
- 📊 Track application stages and expected timelines
- 🗂️ Store and manage personal certificates and licenses
- 🔔 Receive alerts for expiring documents

---

## 🛠️ Tech Stack

### Frontend
- [React](https://react.dev/) (Vite + TypeScript)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (Online Database)
- [Mongoose](https://mongoosejs.com/)
- JWT Authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) (password hashing)

---

## 📁 Project Structure

```
project-root/
│
├── ps-access-tracker/   # React app
└── ps-access-tracker-backend/    # Node.js API
```

---

## ✅ Prerequisites

Before running this project, ensure you have:

- [Node.js](https://nodejs.org/) v18+ recommended
- `npm` or `yarn`
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

---

## 🚀 Getting Started

### 1️⃣ Clone the Project

```bash
git clone https://github.com/NickSingizwa/access-tracker.git
cd access-tracker
```

---

### 2️⃣ Setup Backend

Navigate to the backend folder:

```bash
cd ps-access-tracker-backend
```

**Install dependencies:**

```bash
npm install
```

**Create environment file:**

```bash
touch .env
```

Add the following to your `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Example values:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/public-service-tracker
JWT_SECRET=mysecretkey
```

**Setup MongoDB Atlas:**

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Allow network access from `0.0.0.0/0`
5. Copy your connection string and paste it into `.env`

**Run the backend server:**

```bash
npm run dev
```

> Or alternatively: `node server.js`

The server will run at: **http://localhost:5000**

---

### 3️⃣ Setup Frontend

Open a new terminal:

```bash
cd ps-access-tracker
```

**Install dependencies:**

```bash
npm install
```

**Start the frontend:**

```bash
npm run dev
```

The frontend will run at: **http://localhost:5173**

---

## 👤 Author

**Nick Mizero Singizwa**  
African Leadership University