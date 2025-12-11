# CMS Page Identity Architecture Fix

## Problem Solved

The CMS had a page identity coupling bug where:
- Page identity was ambiguous (array index, navigation order, route strings)
- Editing one page could affect another
- Home page had fallback logic that caused issues

## Solution Implemented

### 1. Single Source of Truth

**Firestore document ID is the ONLY page identifier.**

```
sites/{siteId}/pages/{pageId}
                       ↑
                       This is the only identifier
```

### 2. Page Index (Canonical Registry)

Created `pageIndex` service at:
```
sites/{siteId}/pageIndex/main
```

Structure:
```json
{
  "pages": [
    { "id": "home", "path": "/", "title": "Home" },
    { "id": "about", "path": "/about", "title": "About" },
    { "id": "programs", "path": "/programs", "title": "Programs" }
  ]
}
```

- CMS page selector reads from pageIndex
- Falls back to generating from existing pages if pageIndex doesn't exist
- Navigation is decoupled from page editing

### 3. Deterministic Page Fetching

**Correct pattern (implemented):**
```typescript
docs.map(d => ({
  id: d.id,        // Firestore document ID
  ...d.data()
}))
```

**Prohibited pattern (removed):**
```typescript
docs.map(d => d.data())  // Missing doc.id!
```

### 4. Home Page Handling

```typescript
// resolvePageId.ts
if (route === '' || route === '/') {
  return 'home';  // EXPLICIT - no fallback
}
```

Rules:
- Route `/` MUST map to `home`
- No other page may map to `/`
- No fallback logic based on array index

### 5. Deterministic Save Pipeline

```typescript
// savePageById - deterministic save
await setDoc(
  doc(db, `sites/${siteId}/pages/${pageId}`),
  {
    title: page.title,
    blocks: page.blocks,
    updatedAt: serverTimestamp()
  },
  { merge: true }
)
```

**Prohibited:**
- Saving by array index
- Saving by route string
- Saving via navigation href

## Files Modified

| File | Change |
|------|--------|
| `src/utils/resolvePageId.ts` | Added validation, explicit home handling |
| `src/services/siteService.ts` | Added pageIndex service, savePageById |
| `src/hooks/useSites.ts` | Added usePageIndex, useSavePage hooks |
| `src/cms/pages/SiteEditor.tsx` | Uses pageIndex, no fallback selection |
| `src/cms/pages/PageEditor.tsx` | Validates pageId, logs identity |

## Debug Logging

Console logs enabled for verification:

```
[CMS] SiteEditor - siteId: xxx, pageId from URL: about
[CMS] Navigating to page: about
[CMS] PageEditor mounted
[CMS] siteId: xxx
[CMS] pageId from URL: about
[CMS] Page loaded: { id: "about", title: "About", blocksCount: 3 }
[CMS] Saving block: { siteId: xxx, pageId: about, blockIndex: 0 }
```

Remove after verification.

## Regression Test Checklist

- [ ] Edit About → refresh → About changed
- [ ] Edit Programs → refresh → Programs changed
- [ ] Edit Home → refresh → Home changed
- [ ] Reorder navigation → CMS still works
- [ ] Remove navigation → CMS still works
- [ ] page.id in UI === Firestore doc.id

## Architecture Guarantees

✅ One page = one Firestore document
✅ CMS page selector is stable and deterministic
✅ Editing never affects wrong page
✅ Page identity cannot be ambiguous
✅ Supports multi-tenant CMS architecture

## Migration Notes

If pages have internal `id` fields that differ from document ID:

1. The document ID takes precedence
2. Internal `id` fields are ignored
3. Consider removing internal `id` fields from documents

To generate pageIndex for existing sites:
```typescript
const pageIndex = await generatePageIndexFromPages(siteId);
await savePageIndex(siteId, pageIndex);
```

