# 🚀 Cleanz24 - Backend Hosting & APK Generation Guide

This guide explains how to host your backend server on the cloud (Render.com) and generate your Android APK (`.apk` file) automatically.

---

## 📱 PART 1: Generate Android APK via GitHub Actions (Recommended & Automated)

Your project already contains:
1. Native Android project (`android/`)
2. Capacitor configuration (`capacitor.config.json`)
3. Automated GitHub Actions workflow (`.github/workflows/build-apk.yml`)

### Steps to get your APK:
1. **Create a new GitHub repository**:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `cleanz24_app` (or any name you prefer)
   - Choose **Public** or **Private**
   - Click **Create repository**

2. **Push your code to GitHub**:
   Run the following commands in your terminal (inside the `cleanz24_app` folder):
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```

3. **Download your APK**:
   - In your GitHub repo, click the **Actions** tab at the top.
   - You will see the **"Build Android APK"** workflow running automatically.
   - Once it completes (~2 to 3 minutes), click on the workflow run.
   - Under **Artifacts** at the bottom, click **Cleanz24-Debug-APK** to download your `app-debug.apk` file!
   - Install it directly onto any Android phone.

---

## 🌐 PART 2: Host Backend on Render.com (Free & Fast)

Your project includes `render.yaml` for instant deployment.

### Steps to deploy:
1. **Log in to Render**:
   - Go to [https://render.com](https://render.com) and log in with your GitHub account.

2. **Create New Web Service**:
   - Click **New +** (top right) -> **Web Service**.
   - Select your GitHub repository (`cleanz24_app`).
   - Fill in:
     - **Name**: `cleanz24-backend`
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node index.js`
     - **Plan**: `Free`

3. **Add Environment Variables**:
   Under the **Environment Variables** section, add:
   - `PORT`: `10000`
   - `MONGODB_URI`: `mongodb+srv://rishabnegi333_db_user:rishabrishu1792004@clusterrishab.ukgyemv.mongodb.net/cleanz24_db?retryWrites=true&w=majority&appName=ClusterRishab`
   - `FAST2SMS_API_KEY`: `4hedoxOSs9tzp6eDAnDC8x1nuveFVsJ2oWy0KwOYEYLK4tFMOlMtub1blzpH`
   - `WHATSAPP_TOKEN`: `(Your token if using Meta WhatsApp)`
   - `WHATSAPP_PHONE_ID`: `1232168166656706`
   - `WHATSAPP_TEMPLATE_NAME`: `hello_world`

4. **Click "Deploy Web Service"**:
   - Render will build and deploy your API in ~1 minute.
   - Your live API URL will be something like: `https://cleanz24-backend.onrender.com`.
   - Test it by opening: `https://cleanz24-backend.onrender.com/api/health`.

---

## 🔗 PART 3: Connect APK to Deployed Backend

Once Render gives you your live URL (e.g., `https://cleanz24-backend.onrender.com`):
1. In your project, create a `.env.production` file:
   ```env
   VITE_API_URL=https://cleanz24-backend.onrender.com
   ```
2. Re-sync and push:
   ```bash
   npm run cap:sync
   git add .
   git commit -m "chore: point APK to live Render backend"
   git push
   ```
3. GitHub Actions will automatically re-build a new APK connected to your live cloud server!
