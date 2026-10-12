# Deployment Guide: Electricity Bill Management System

This guide outlines how to deploy the full-stack system with your MongoDB Atlas cluster.

- **Frontend**: React (Vite) → Render / Vercel / Netlify
- **Backend**: Spring Boot 3.3.4 (Java 21) → Render / Railway / AWS EC2
- **Database**: MongoDB Atlas (`cluster0.ym5laon.mongodb.net`)

---

## Step 1: MongoDB Atlas Configuration (Important)

Your MongoDB cluster needs to allow network traffic from your deployed backend service:

1. Open [MongoDB Atlas](https://cloud.mongodb.com/).
2. Go to **Network Access** under Security.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (`0.0.0.0/0`) or enter your backend server's static IP.
5. Confirm your database user `manicharan549_db_user` has `readWriteAnyDatabase` privileges.

---

## Step 2: Deploy Backend (Option A: Render - Recommended Free/Simple)

Render natively supports Docker and Java web services:

1. Sign up / Log in to [Render](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your repository: `manicharan549/ELECTRICITY-BILLMANAGEMENT`.
4. Configure service settings:
   - **Name**: `electricity-billing-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Java` (or `Docker`)
   - **Build Command**:
     ```bash
     mvn clean package -DskipTests
     ```
   - **Start Command**:
     ```bash
     java -jar target/bill-management-system-1.0.0.jar
     ```
5. In **Environment Variables**, add:
   - `SPRING_DATA_MONGODB_URI`: `mongodb+srv://manicharan549_db_user:manicharan123@cluster0.ym5laon.mongodb.net/electricity_billing_db?retryWrites=true&w=majority&appName=Cluster0`
   - `APP_CORS_ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app,http://localhost:3000`
   - `SERVER_PORT`: `8080` (or `10000`)
6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g. `https://electricity-billing-backend.onrender.com`).

---

## Step 3: Configure Frontend API URL for Production

In `frontend/src/services/api.js`, enable the production environment variable:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## Step 4: Deploy Frontend (Vercel / Netlify / Render)

### Deploying to Vercel:
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import `manicharan549/ELECTRICITY-BILLMANAGEMENT`.
3. Set the **Root Directory** to `frontend`.
4. Build & Development Settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://your-backend-render-url.onrender.com/api/v1`
6. Click **Deploy**.

---

## Step 5: Update CORS on Backend

After your frontend is live:
1. Go back to your backend deployment settings (Render / Railway).
2. Update `APP_CORS_ALLOWED_ORIGINS` to include your new production frontend URL:
   ```
   https://your-frontend.vercel.app
   ```
3. Trigger a quick redeploy.

---

## Step 6: Verify Deployment

1. Visit your live frontend URL.
2. Log in using the bootstrapped administrator credentials:
   - **Email**: `admin@electricity.gov.in`
   - **Password**: `Admin@12345`
3. Register a test customer to test end-to-end database connectivity with MongoDB Atlas.
