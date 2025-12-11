# Quick Start Guide - 5 Minutes to Running CMS

## Step 1: Install (1 minute)
```bash
npm install
```

## Step 2: Firebase Setup (2 minutes)

### A. Create Firebase Project
1. Visit https://console.firebase.google.com/
2. Click "Add project" → Name it → Create

### B. Enable Services
**Authentication:**
- Left menu → Authentication → Get Started → Email/Password → Enable

**Firestore:**
- Left menu → Firestore Database → Create Database → Production mode → Next → Enable

**Storage:**
- Left menu → Storage → Get Started → Production mode → Done

### C. Get Config
1. Project Settings (gear icon) → Scroll down
2. Click web icon (`</>`) → Register app
3. Copy the config values

## Step 3: Environment Variables (1 minute)

Create `.env` in project root:
```env
VITE_FIREBASE_API_KEY=your-value-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

## Step 4: Create Test Data (1 minute)

### A. Add Security Rules
**Firestore Rules** (Firestore Database → Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules** (Storage → Rules):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### B. Create User
Authentication → Users → Add user:
- Email: `admin@test.com`
- Password: `test123456`

### C. Create Tenant
Firestore Database → Start collection:
- Collection ID: `tenants`
- Document ID: `demo-site`
- Fields:
  ```
  name: "Demo Website" (string)
  domain: "demo.example.com" (string)
  createdAt: [click "timestamp" → now]
  sections: ["home", "about", "menu", "events", "gallery", "contact"] (array)
  ```

## Step 5: Run! (30 seconds)
```bash
npm run dev
```

Visit http://localhost:5173

**Login:**
- Email: `admin@test.com`
- Password: `test123456`

## 🎉 You're Ready!

1. Select "Demo Website"
2. Click any section card
3. Start editing!

## Common First-Time Issues

**"Firebase: Error (auth/configuration-not-found)"**
→ Check your `.env` file exists and has all 6 variables

**"Missing or insufficient permissions"**
→ Make sure you published the Firestore rules (click "Publish")

**Can't see tenant after login**
→ Verify the tenant document was created in Firestore

**Images won't upload**
→ Make sure Storage rules are published

## Next Steps

✅ Read `README.md` for full documentation
✅ Read `SETUP_INSTRUCTIONS.md` for production setup  
✅ Read `PROJECT_OVERVIEW.md` for architecture details

## Getting Help

Check in this order:
1. Browser console (F12)
2. Firebase Console → Project logs
3. README.md troubleshooting section
4. Verify all environment variables

---

**Total setup time: ~5 minutes**
**You now have a fully functional multi-tenant CMS!** 🚀

