# CareConnect - Clinical Resource Optimization Platform

CareConnect is a high-fidelity MERN stack hospital management and resource optimization platform. It is engineered to streamline outpatient queues, coordinate real-time ICU/ER bed allocations, process full patient admission lifecycles, track critical inventory depletion thresholds, and broadcast city-wide emergency hospital sharing details.

---

## 🚀 Deployment Guide

### 1. Database Setup: MongoDB Atlas (Cloud)
To run or deploy the app in production, you need a cloud-hosted MongoDB instance:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project and build a database cluster (the **M0 Free Tier** is recommended).
3. In the security settings:
   - Add a database user with read/write access (write down the username and password).
   - In **Network Access**, whitelist `0.0.0.0/0` to allow connections from any hosting provider.
4. Click **Connect** on your cluster, choose **Drivers**, and copy the connection string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/careconnect?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with your database user credentials.

---

### 2. Backend Deployment (e.g., Render or Railway)
Deploy the server located in the `/backend` directory.

#### Option A: Render (Free Tier)
1. Sign up on [Render](https://render.com/).
2. Create a new **Web Service** and connect your GitHub repository.
3. Configure the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *A secure random string (e.g. `your_jwt_secret_key`)*
   - `PORT`: `5000`
5. Deploy the service and copy the generated Web Service URL (e.g., `https://careconnect-backend.onrender.com`).

---

### 3. Frontend Deployment (e.g., Vercel or Netlify)
Deploy the React+Vite frontend located in the root directory.

#### Option A: Vercel
1. Sign up on [Vercel](https://vercel.com/).
2. Import your GitHub repository.
3. In the project settings, configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Root directory of the repo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Since the frontend makes API requests to `/api/*`, configure a proxy in Vercel. Create a `vercel.json` file in the root of your project:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://careconnect-backend.onrender.com/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   *(Replace `https://careconnect-backend.onrender.com` with your active backend URL)*.
5. Click **Deploy**.

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally

### 1. Run the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file inside the `backend` directory to override defaults:
   ```env
   MONGODB_URI=mongodb://localhost:27017/careconnect
   JWT_SECRET=careconnect_super_secret_key
   PORT=5000
   ```
4. Seed the database with sample clinical data (users, patients, beds, queues, and alerts):
   ```bash
   npm run seed
   ```
5. Start the backend:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:5000`.

### 2. Run the Frontend App
1. Open a new terminal in the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173` and automatically proxy `/api` calls to `http://localhost:5000`.

---

## 🛠️ Tech Stack
- **Frontend**: React (v18), Vite, React Router, Material UI, Recharts, Tailwind CSS.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), BcryptJS.
