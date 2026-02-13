# Deployment Guide: Sales Reward Engine

This guide steps through deploying the Sales Reward Engine to **Render** (Backend + Database) and **Vercel** (Frontend).

---

## Part 1: Backend Deployment (Render)

We will use Render to host the Spring Boot backend and the PostgreSQL database.

### 1. Push Code to GitHub
Ensure your code is pushed to a GitHub repository.

### 2. Create a Render Account
1.  Go to [render.com](https://render.com).
2.  Sign up/Log in using your GitHub account.

### 3. Create a New Blueprint Instance
1.  Click **New +** and select **Blueprint**.
2.  Connect your GitHub repository `Sales-Reward-Engine`.
3.  Render will automatically detect the `render.yaml` file in the root directory.
4.  Click **Apply**.

### 4. What Happens Next?
Render will automatically:
-   Create a **PostgreSQL Database** (`sales-db`).
-   Build your **Spring Boot Application** using the `Dockerfile`.
-   Deploy the web service.
-   Inject the database credentials (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) into your app automatically.

### 5. Verify Backend
Once deployed, Render will give you a **Service URL** (e.g., `https://sales-incentive-system.onrender.com`).
-   Visit `https://<YOUR-URL>/actuator/health` to verify it's running (should return `{"status":"UP"}`).

---

## Part 2: Frontend Deployment (Vercel)

We will use Vercel to host the React frontend.

### 1. Create a Vercel Account
1.  Go to [vercel.com](https://vercel.com).
2.  Sign up/Log in using GitHub.

### 3. Import Project
1.  Click **Add New...** -> **Project**.
2.  Import your `Sales-Reward-Engine` repository.

### 4. Configure Project
1.  **Framework Preset**: Vite (should be auto-detected).
2.  **Root Directory**: Click "Edit" and select `frontend`.
3.  **Environment Variables**:
    -   Key: `VITE_API_URL`
    -   Value: `https://<YOUR-RENDER-BACKEND-URL>` (The URL from Part 1, e.g., `https://sales-incentive-system.onrender.com`)

### 5. Deploy
1.  Click **Deploy**.
2.  Vercel will build and deploy your frontend.
3.  Once done, you will get a production URL (e.g., `https://sales-reward-engine.vercel.app`).

---

## Part 3: Troubleshooting

### Backend Issues
-   **Logs**: Check the "Logs" tab in Render dashboard for startup errors.
-   **Database**: Ensure the `sales-db` service is healthy.
-   **Environment Variables**: Double check `MAIL_USERNAME` and `MAIL_PASSWORD` are set if you need email features.

### Frontend Issues
-   **API Connection**: Open Developer Tools (F12) -> Network tab. If API calls fail, check if they are going to the correct `VITE_API_URL`.
-   **CORS**: The Spring Boot backend is configured to allow all origins (`*`) by default, so Vercel should be able to connect.

---

## Local Development
To run locally:
1.  **Backend**: `./run_backend.sh` (Requires MySQL locally or update config to use Docker/PostgreSQL).
2.  **Frontend**: `cd frontend && npm run dev`.
3.  The frontend will use `http://localhost:8080` by default (defined in `frontend/.env`).
