# Vault Module Guide

**Store and organize files** — Your project's central file repository.

---

## What It Does

The Vault module:
- Stores research reports, design exports, and reference files
- Organizes files by category
- Enables context injection for generations
- Tracks file metadata (size, upload date)
- Shows active context files

---

## When to Use It

Use the Vault throughout your workflow:
- **After Research:** Upload research reports
- **After Design:** Upload design exports
- **During Build:** Store reference materials
- **Anytime:** Add relevant files for context

---

## Step-by-Step Guide

### Upload Files

**Method 1: Drag & Drop**
1. Drag files onto the Vault area
2. Files upload automatically
3. Select category when prompted

**Method 2: Click to Upload**
1. Click **"Upload Files"** or drag area
2. Select files from your computer
3. Choose category
4. Files upload and appear in grid

### Supported File Types

| Type | Extensions | Max Size |
|------|------------|----------|
| Documents | PDF, MD, TXT | 10 MB |
| Images | PNG, JPG, JPEG | 10 MB |
| Data | JSON, ZIP | 10 MB |

### Categorize Files

Files are organized into categories:
- **Research** — Research reports, market analysis
- **Design** — Design exports, mockups, screenshots
- **Export** — Generated prompts, build artifacts
- **Other** — Miscellaneous files

### Mark as Active Context

To include a file in AI generations:
1. Find the file in the Vault
2. Toggle **"Active Context"** switch ON
3. File will be included in context for:
   - Research prompts
   - Design prompts
   - PRD generation
   - Build prompts

### Search Files

Use the search bar to find files:
- Search by filename
- Filter by category
- Sort by upload date

### Download Files

To download a file:
1. Click the **download** icon on the file card
2. File downloads to your computer

### Delete Files

To remove a file:
1. Click the **delete** icon on the file card
2. Confirm deletion

> ⚠️ **Warning:** This action cannot be undone.

---

## Tips & Best Practices

### Upload Research Immediately

After generating research:
1. Save the report as PDF or MD
2. Upload to Vault immediately
3. Mark as Active Context
4. Future prompts will reference it

### Organize by Category

Proper categorization helps:
- Find files quickly
- Understand what each file is for
- Keep Vault clean as it grows

### Use Descriptive Filenames

Name files clearly:
- ✅ `perplexity-market-research-2026-03-25.pdf`
- ✅ `v0-dashboard-design-export.png`
- ❌ `research.pdf`
- ❌ `design.png`

### Active Context Strategy

Be selective with Active Context:
- **Include:** Directly relevant files
- **Exclude:** Outdated or tangential files
- **Rotate:** Update as project evolves

Too many active files = bloated prompts
Too few active files = missing context

### Vault Integrity

The **Vault Integrity** metric shows:
- Percentage of modules with supporting files
- Higher = better documented project
- Target: 80%+ for well-documented projects

---

## Context Injection

When you mark a file as **Active Context**:

1. The file is included in AI generations
2. The AI can reference specific content
3. Generated prompts are more informed
4. Results are more tailored to your project

**Example:**
- Upload research report about fitness apps
- Mark as Active Context
- Design prompt includes fitness app patterns from research

---

## Common Issues

### "File won't upload"

**Possible causes:**
- File exceeds 10 MB limit
- Unsupported file type
- Browser storage full

**Solution:**
- Compress large files
- Convert to supported format
- Clear browser cache

### "Can't find my file"

**Solution:**
- Use search bar
- Check category filter
- Try List view instead of Grid view

### "Vault is full"

**Solution:**
- Delete old/unused files
- Export and archive externally
- Keep only essential reference files

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘O` | Open file picker |
| `⌘F` | Search files |
| `Delete` | Delete selected file |

---

## Storage Limits

**Current:** Local-first storage (IndexedDB)
- Limited by browser storage quota
- Typically 50-100 MB per origin
- Varies by browser and available disk space

**Future:** Cloud sync option (planned)
- Supabase storage
- Multi-device sync
- Larger quotas

---

## Related Modules

- **[Research](research-module.md)** — Upload research reports here
- **[Design](design-module.md)** — Store design exports here
- **[Build](build-module.md)** — Reference files during build

---

**Previous:** [Build Module](build-module.md)

**Back to:** [User Guide Index](README.md)
