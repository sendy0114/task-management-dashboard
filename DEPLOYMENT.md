# Deployment Guide - Task Management System

## 🚀 Quick Deployment Steps

### **Prerequisites**
- GitHub account
- Vercel account (for frontend)
- Render/Railway account (for backend)
- Firebase project with Firestore enabled

---

## 📦 **Part 1: Deploy Backend (Render)**

### **Option A: Deploy to Render (Recommended)**

1. **Push code to GitHub**
   ```bash
   cd /Users/mac/Assignment
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Render Dashboard**
   - Visit: https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder

3. **Configure Build Settings**
   - **Name**: `task-manager-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**
   Click "Environment" and add:
   ```
   PORT=5001
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your backend URL: `https://task-manager-backend-xxxx.onrender.com`

---

## 🎨 **Part 2: Deploy Frontend (Vercel)**

### **Deploy to Vercel**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` folder

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://task-manager-backend-xxxx.onrender.com/api
   ```
   (Use your Render backend URL from Part 1)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (1-2 minutes)
   - Your site will be live at: `https://your-project.vercel.app`

---

## 🔧 **Part 3: Update CORS**

After frontend is deployed, update backend CORS:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://your-project.vercel.app
   ```
5. Save and redeploy

---

## 🔥 **Part 4: Firebase Setup**

1. **Get Firebase Credentials**
   - Go to Firebase Console: https://console.firebase.google.com
   - Select your project
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

2. **Extract Values**
   From the downloaded JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

3. **Add to Render Environment Variables**

---

## ✅ **Testing Deployment**

1. **Visit your frontend URL**: `https://your-project.vercel.app`
2. **Test Login**:
   - Admin: `sahil.l@admin.com` / `Sahil@123`
   - User: `rahul.sharma@taskmanager.com` / `User@123`
3. **Verify**:
   - ✅ Login works
   - ✅ Dashboard loads
   - ✅ Tasks display
   - ✅ Create/Edit/Delete works

---

## 🐛 **Troubleshooting**

### **Backend Issues**
- Check Render logs: Dashboard → Logs
- Verify environment variables are set
- Ensure Firebase credentials are correct

### **Frontend Issues**
- Check browser console for errors
- Verify `VITE_API_URL` points to correct backend
- Check Vercel deployment logs

### **CORS Errors**
- Ensure `CORS_ORIGIN` in backend matches frontend URL exactly
- No trailing slash in URLs

---

## 📝 **Alternative: Deploy to Railway (Backend)**

1. Visit: https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select repository
4. Add same environment variables
5. Deploy

---

## 🎉 **You're Done!**

Your Task Management System is now live!

**Frontend**: https://your-project.vercel.app
**Backend**: https://task-manager-backend.onrender.com

---

## 📧 **Default Login Credentials**

**Admin:**
- Email: `sahil.l@admin.com`
- Password: `Sahil@123`

**Users:**
- `rahul.sharma@taskmanager.com` / `User@123`
- `priya.patel@taskmanager.com` / `User@123`
- `amit.verma@taskmanager.com` / `User@123`
- `sneha.gupta@taskmanager.com` / `User@123`
- `david.kumar@taskmanager.com` / `User@123`
