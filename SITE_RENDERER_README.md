# Site Renderer - Architecture Documentation

## Implementation Complete ✅

The site renderer is now aligned with the existing Firestore page structure.

## Data Flow

```
URL (e.g., /about)
    ↓
resolvePageId("/about") → "about"
    ↓
Firestore: sites/{siteId}/pages/about
    ↓
PageData { id, title, blocks[] }
    ↓
PageRenderer renders blocks[]
    ↓
SectionRenderer routes each block by type
    ↓
Individual block component renders
```

## URL → Page ID Mapping

| URL | Page ID (Firestore doc) |
|-----|-------------------------|
| `/` | `home` |
| `/about` | `about` |
| `/programs` | `programs` |
| `/schedule` | `schedule` |
| `/gallery` | `gallery` |
| `/contact` | `contact` |

## File Structure

```
src/
├── utils/
│   └── resolvePageId.ts       # URL → page ID resolution
│
├── site/
│   ├── config.ts              # Site ID configuration
│   ├── SiteLayout.tsx         # Layout with nav + footer
│   ├── SitePage.tsx           # Page wrapper
│   │
│   ├── hooks/
│   │   ├── usePageData.ts     # Load page from Firestore
│   │   ├── useNavigation.ts   # Load navigation
│   │   └── useFooter.ts       # Load footer
│   │
│   └── components/
│       ├── PageRenderer.tsx   # Renders blocks[]
│       ├── SectionRenderer.tsx # Routes block.type → component
│       ├── SiteHeader.tsx     # Navigation header
│       ├── SiteFooter.tsx     # Footer component
│       │
│       └── blocks/
│           ├── IntroSection.tsx
│           ├── Hero.tsx
│           ├── ContentBlock.tsx
│           ├── MediaRow.tsx
│           ├── ImageDivider.tsx
│           ├── Features.tsx
│           ├── Programs.tsx
│           ├── Schedule.tsx
│           ├── Credentials.tsx
│           └── CTASection.tsx
```

## Supported Block Types

| Block Type | Component | Key Fields |
|------------|-----------|------------|
| `intro-section` | IntroSection | title, subtitle, description, image, cta |
| `hero` | Hero | title, subtitle, description, image, cta, buttons |
| `content-block` | ContentBlock | label, title, description, image, cta, stats, reverse |
| `media-row` | MediaRow | items[], title |
| `image-divider` | ImageDivider | image, title |
| `features` | Features | title, subtitle, items[] |
| `programs` | Programs | title, subtitle, programs[] |
| `schedule` | Schedule | title, sessions[], filters[] |
| `credentials` | Credentials | title, subtitle, items[] |
| `cta` | CTASection | title, subtitle, description, image, cta, buttons |

## Configuration

Set your site ID in `src/site/config.ts`:

```typescript
export const SITE_ID = 'your-site-id';
```

Or use an environment variable:

```env
VITE_SITE_ID=your-site-id
```

## Routes

### Public Site Routes
- `/` → Home page
- `/about` → About page
- `/programs` → Programs page
- `/schedule` → Schedule page
- `/gallery` → Gallery page
- `/contact` → Contact page
- `/:pageId` → Any other page

### CMS Routes
- `/cms/sites` → Site list
- `/cms/sites/:siteId` → Site editor
- `/cms/sites/:siteId/pages/:pageId` → Page editor

## Debug Logging

Temporary logging is enabled in `usePageData.ts`:

```typescript
console.log('Resolved pageId:', pageId);
console.log('Loaded page blocks:', data.blocks);
```

Remove after verification.

## Key Principles

1. **Firestore is the source of truth** - Never hardcode content
2. **Pages are identified by document ID** - Not filenames or slugs
3. **Render blocks[] not sections** - Use the canonical array
4. **Defensive rendering** - All fields are optional
5. **Unknown blocks don't crash** - Log warning and return null

## Real-time Updates

The site uses Firestore `onSnapshot` for real-time updates:
- CMS edits appear instantly on the live site
- No page refresh required
- Navigation and footer also update in real-time

## Acceptance Criteria ✅

- [x] `/` renders Home page blocks
- [x] `/about` renders About page blocks  
- [x] Navigation works without reload
- [x] Footer persists across pages
- [x] CMS edits appear instantly
- [x] No hardcoded content
- [x] Unknown block types log warnings
- [x] Null fields don't crash rendering

## Troubleshooting

### Page shows 404
- Check Firestore has document at `sites/{siteId}/pages/{pageId}`
- Verify the document ID matches the URL path
- Check console for "Resolved pageId" log

### Blocks not rendering
- Check console for "Loaded page blocks" log
- Verify `blocks` is an array in Firestore
- Check for unknown block type warnings

### Navigation not showing
- Verify `sites/{siteId}/navigation/main` exists
- Check `items` array is present

### Styling issues
- Ensure TailwindCSS is configured
- Check `src/styles/index.css` is imported

