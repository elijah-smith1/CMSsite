# CMS Site Manager - Documentation

## Overview

This CMS is built to manage websites stored in Firebase Firestore under the `/sites` collection. It provides a complete admin interface for editing pages, blocks, navigation, and site settings.

## Data Structure

```
/sites/{siteId}
  ├── (site metadata: name, tagline, domain, theme)
  ├── /pages/{pageId}
  │   ├── title
  │   ├── slug
  │   ├── blocks[]
  │   └── order
  ├── /navigation/main
  │   └── items[]
  └── /components/footer
      ├── logo
      ├── columns[]
      └── socialLinks[]
```

## CMS Routes

| Route | Description |
|-------|-------------|
| `/cms/sites` | List all sites in the database |
| `/cms/sites/:siteId` | Site editor (sidebar with pages) |
| `/cms/sites/:siteId/pages/:pageId` | Page editor with block management |
| `/cms/sites/:siteId/navigation` | Navigation editor (coming soon) |
| `/cms/sites/:siteId/footer` | Footer editor (coming soon) |
| `/cms/sites/:siteId/settings` | Site settings (coming soon) |

## Supported Block Types

| Type | Description | Fields |
|------|-------------|--------|
| `hero` | Full-width hero section | title, subtitle, backgroundImage, ctas[], alignment |
| `content-block` | Text + image side by side | label, title, text, image, imagePosition, cta |
| `text` | Rich text content | title, content (HTML) |
| `media-row` | Grid of images | images[], columns |
| `image-divider` | Full-width image | image, alt, height |
| `features` | Feature cards | title, subtitle, features[], columns |
| `programs` | Program cards | title, subtitle, programs[] |
| `schedule` | Session schedule | title, filters[], sessions[] |
| `cta` | Call to action section | title, description, buttons[], backgroundImage |
| `gallery` | Image gallery | title, images[], layout |
| `testimonials` | Customer quotes | title, testimonials[] |

## File Structure

```
src/
├── cms/
│   ├── pages/
│   │   ├── SiteList.tsx        # Lists all sites
│   │   ├── SiteEditor.tsx      # Site editor wrapper with sidebar
│   │   └── PageEditor.tsx      # Page editor with blocks
│   └── components/
│       ├── BlockEditor.tsx     # Block type router
│       ├── AddBlockModal.tsx   # Modal for adding new blocks
│       ├── blocks/             # Individual block editors
│       │   ├── HeroBlockEditor.tsx
│       │   ├── ContentBlockEditor.tsx
│       │   ├── TextBlockEditor.tsx
│       │   ├── MediaRowBlockEditor.tsx
│       │   ├── ImageDividerBlockEditor.tsx
│       │   ├── FeaturesBlockEditor.tsx
│       │   ├── ProgramsBlockEditor.tsx
│       │   ├── ScheduleBlockEditor.tsx
│       │   ├── CTABlockEditor.tsx
│       │   ├── GalleryBlockEditor.tsx
│       │   └── TestimonialsBlockEditor.tsx
│       └── common/
│           ├── BlockImageUpload.tsx
│           ├── CTAEditor.tsx
│           └── BlockSaveBar.tsx
├── services/
│   ├── siteService.ts          # Firestore operations for sites/pages
│   └── storageService.ts       # Firebase Storage operations
├── hooks/
│   └── useSites.ts             # React Query hooks for sites/pages
└── utils/types/
    └── sites.ts                # TypeScript types for all data
```

## Key Features

### 1. Site Discovery
- Queries `/sites` collection
- Displays site name, tagline, and ID
- Click to enter site editor

### 2. Page Editor
- Loads page from `/sites/{siteId}/pages/{pageId}`
- Renders blocks dynamically based on `block.type`
- Collapsible block cards
- Add/remove/reorder blocks

### 3. Block Editors
- Each block type has a dedicated editor component
- Inline editing with live form updates
- Per-block save button
- Image upload integration

### 4. Image Handling
- Uploads to Firebase Storage
- Path: `/sites/{siteId}/{pageId}/{blockId}/image.jpg`
- Automatic URL generation
- 10MB file size limit

### 5. Block Management
- Add new blocks (modal with type selection)
- Delete blocks (with confirmation)
- Move blocks up/down
- Drag handle ready for drag-and-drop

## Firebase Security Rules

```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sites/{siteId}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == "admin";
    }
  }
}

// Storage rules  
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /sites/{siteId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Setting Up Admin Users

To enable write access, set custom claims on Firebase Auth users:

```javascript
// Using Firebase Admin SDK
admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

## Usage

1. **Login**: Authenticate with email/password
2. **Select Site**: Click a site from the list
3. **Edit Pages**: Click a page in the sidebar
4. **Edit Blocks**: Click a block to expand and edit
5. **Save**: Click "Save Block" to persist changes

## Adding New Block Types

1. Add type to `src/utils/types/sites.ts`
2. Add metadata to `BLOCK_TYPE_META`
3. Create editor in `src/cms/components/blocks/`
4. Add case to `BlockEditor.tsx`
5. Add default in `AddBlockModal.tsx`

## Customization Points

### Theme Colors
Edit `tailwind.config.js` to change the primary color palette.

### Block Types
Add or remove block types based on your site needs.

### Validation
Add Zod schemas for stricter validation if needed.

## Live Website Integration

Your public websites should:
1. Query Firestore for page content
2. Render blocks using a block renderer component
3. Use the same block type definitions
4. Enable real-time updates with Firestore listeners

Example fetch:
```javascript
const pageDoc = await getDoc(doc(db, 'sites', siteId, 'pages', pageSlug));
const page = pageDoc.data();
// Render page.blocks
```

## Troubleshooting

### "Permission denied" on save
- Check user is authenticated
- Verify admin custom claim is set
- Review Firestore security rules

### Images not uploading
- Check Storage rules allow authenticated writes
- Verify Storage bucket is enabled
- Check file size (max 10MB)

### Site not appearing
- Verify site document exists in `/sites` collection
- Check site has `name` field
- Ensure Firestore rules allow read

## Performance Tips

1. **React Query Caching**: Data is cached for 5 minutes by default
2. **Optimistic Updates**: Consider adding for better UX
3. **Lazy Loading**: Block editors are loaded on demand
4. **Image Optimization**: Consider adding image compression

---

Built with Vite + React + TypeScript + Firebase + TailwindCSS

