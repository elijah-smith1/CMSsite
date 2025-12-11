# CMS Setup Instructions

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the wizard to create your project

#### Enable Services
1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Add authorized users

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in production mode

#### Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Register your app
5. Copy the configuration values

### 3. Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Firebase Security Rules

#### Firestore Rules
Go to Firestore Database > Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tenants/{tenantId} {
      // Allow authenticated users to read tenants
      allow read: if request.auth != null;
      // Add your authorization logic for write
      allow write: if request.auth != null;
      
      match /content/{sectionId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

#### Storage Rules
Go to Storage > Rules and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tenants/{tenantId}/{allPaths=**} {
      // Public read access
      allow read: if true;
      // Only authenticated users can upload
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Create Initial Data

#### Create a Tenant Document

In Firestore, manually create a document:

Collection: `tenants`
Document ID: `demo-site` (or any ID)

```json
{
  "name": "Demo Website",
  "domain": "demo.example.com",
  "createdAt": [Firebase Timestamp - use "now"],
  "sections": ["home", "about", "menu", "events", "gallery", "contact"]
}
```

#### Create User Account

1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password
4. Note: You'll need to implement user-tenant relationships based on your needs

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 7. First Login

1. Use the email/password you created in Firebase Authentication
2. You should see your tenant(s) in the site selector
3. Select a site to start editing

## Customization Points

### Add New Sections

1. Define types in `src/utils/types/index.ts`
2. Add validator in `src/utils/validators/index.ts`
3. Add default content in `src/services/contentService.ts`
4. Create editor in `src/pages/sections/YourSection/`
5. Add route in `src/components/editors/SectionRouter.tsx`
6. Add icon in `src/components/layout/Sidebar.tsx`

### User-Tenant Relationships

Currently, all authenticated users can see all tenants. Implement your own logic:

**Option 1: User Document**
Create a `users` collection:
```json
{
  "email": "user@example.com",
  "tenantIds": ["tenant1", "tenant2"]
}
```

**Option 2: Custom Claims**
Use Firebase Auth custom claims to store tenant access.

**Option 3: Tenant Members Subcollection**
Add a `members` subcollection to each tenant.

### Styling

- Colors: Edit `tailwind.config.js`
- Global styles: Edit `src/styles/index.css`
- Component styles: Use Tailwind classes

## Production Deployment

### Build

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project
# Set public directory to: dist
# Configure as single-page app: Yes
# Set up GitHub Actions: Optional
firebase deploy
```

## Troubleshooting

### "Firebase not initialized" error
- Check your `.env` file exists and has all variables
- Restart the dev server after creating `.env`

### "Permission denied" errors
- Check Firestore and Storage security rules
- Ensure user is authenticated
- Verify tenant ID is correct

### Images not displaying
- Check Storage rules allow public read
- Verify Storage bucket is enabled
- Check browser console for CORS errors

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`
- Ensure all imports are correct

## Support

For issues:
1. Check the console for errors
2. Verify Firebase configuration
3. Check security rules
4. Review the README.md

Happy coding! 🚀

