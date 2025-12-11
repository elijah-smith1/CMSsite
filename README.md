# Multi-Tenant CMS Application

A comprehensive Content Management System built with Vite, React, TypeScript, Firebase, and TailwindCSS. Designed for non-technical clients to easily manage their website content.

## 🚀 Features

- **Multi-Tenant Architecture**: Support for multiple client websites from a single CMS
- **Firebase Integration**: Firestore for data, Storage for media, and Authentication
- **Section Editors**: 
  - Home (Hero section, content blocks)
  - About (Story, mission, vision, values)
  - Menu (Items, categories, pricing)
  - Events (Upcoming events with details)
  - Gallery (Photo management with categories)
  - Contact (Contact info and social media)
- **Rich Content Editing**: WYSIWYG editor for text content
- **Image Management**: Upload and manage images with Firebase Storage
- **Auto-save**: Content automatically saves every 10 seconds
- **Validation**: Zod schema validation for all content
- **Responsive UI**: Mobile-friendly interface
- **Type-Safe**: Full TypeScript support

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd multi-tenant-cms
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore, Storage, and Authentication (Email/Password)
   - Copy your Firebase configuration

4. Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Start the development server:
```bash
npm run dev
```

## 🗄️ Firebase Data Structure

### Tenants Collection
```
tenants/{tenantId}
  - name: string
  - domain: string
  - createdAt: Timestamp
  - sections: string[] // e.g., ["home", "about", "menu"]
```

### Content Subcollection
```
tenants/{tenantId}/content/{sectionId}
  - [section-specific fields]
```

Example Home section:
```javascript
{
  heroTitle: "Welcome",
  heroSubtitle: "...",
  heroImage: "https://...",
  blocks: [
    {
      type: "checkerboard",
      title: "Feature 1",
      body: "Description...",
      image: "https://...",
      position: "left"
    }
  ]
}
```

## 🎨 Customization

### Adding New Section Types

1. **Define Types** (`src/utils/types/index.ts`):
```typescript
export interface NewSectionContent {
  field1: string;
  field2: string;
}
```

2. **Create Validator** (`src/utils/validators/index.ts`):
```typescript
export const newSectionSchema = z.object({
  field1: z.string().min(1),
  field2: z.string(),
});
```

3. **Add Default Content** (`src/services/contentService.ts`):
```typescript
case 'newsection':
  return {
    field1: 'Default value',
    field2: 'Default value',
  };
```

4. **Create Editor Component** (`src/pages/sections/NewSection/NewSectionEditor.tsx`)

5. **Update Router** (`src/components/editors/SectionRouter.tsx`)

## 🔐 Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tenants collection
    match /tenants/{tenantId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Add custom authorization logic
      
      // Content subcollection
      match /content/{sectionId} {
        allow read, write: if request.auth != null; // Add tenant-specific auth
      }
    }
  }
}
```

Add these Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tenants/{tenantId}/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Add tenant-specific auth
    }
  }
}
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── editors/           # Section editor router
│   ├── forms/             # Form components (SaveBar, RepeaterField)
│   ├── inputs/            # Input components (TextInput, ImageUpload, etc.)
│   └── layout/            # Layout components (Sidebar, Header, etc.)
├── context/               # React Context providers
├── firebase/              # Firebase configuration and helpers
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
│   ├── dashboard/         # Dashboard page
│   ├── site-selector/     # Tenant selection page
│   └── sections/          # Section editor pages
├── services/              # Service layer for Firebase operations
├── styles/                # Global styles
├── utils/                 # Utility functions, types, validators
├── App.tsx                # Main app component with routing
└── main.tsx               # Entry point
```

## 🚧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### React Query
Configure caching and refetch behavior in `src/App.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
```

### Auto-save Delay
Modify auto-save interval in section editors:

```typescript
const { save, isAutoSaving } = useAutoSave(
  tenant.id,
  'section-id',
  content,
  10000 // milliseconds
);
```

## 📝 User Management

Currently, user-tenant relationships need to be implemented based on your requirements. Options include:

1. **Firestore User Documents**: Store tenant IDs in user documents
2. **Custom Claims**: Use Firebase Auth custom claims
3. **Admin Panel**: Build an admin interface for user management

Update `src/pages/site-selector/SiteSelector.tsx` to fetch user-specific tenants.

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📄 License

This project is available for use as a starter template.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Tips

- Always validate content before saving
- Use the service layer for all Firebase operations
- Keep section editors modular and reusable
- Add comments where customization is expected
- Test with multiple tenants to ensure proper isolation

## 🐛 Troubleshooting

**Issue**: Firebase initialization error
- Check your `.env` file has all required variables
- Ensure Firebase project is properly configured

**Issue**: Images not uploading
- Check Firebase Storage security rules
- Verify storage bucket is enabled in Firebase Console

**Issue**: Content not saving
- Check Firestore security rules
- Ensure user is authenticated
- Verify tenant ID is correctly set

## 📞 Support

For issues and questions, please open an issue in the repository.

