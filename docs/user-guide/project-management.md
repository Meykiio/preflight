# Project Management Guide

**Your Project Hub** — Where all your ideas come to life.

---

## What It Does

The Project Hub is your central workspace for:
- Creating and organizing projects
- Tracking progress through development stages
- Importing/exporting project data
- Managing multiple projects simultaneously

---

## When to Use It

Use the Project Hub when you want to:
- Start a new project
- Switch between projects
- Review project status
- Backup or share projects (via JSON export)

---

## Step-by-Step Guide

### Create Your First Project

1. **Click "New Project"** button (top right)
2. **Fill in the form:**
   - **Name:** Your project name (e.g., "SaaS Dashboard")
   - **Description:** One sentence describing what it does
   - **Target Platforms:** Select where you'll build (Lovable, Bolt, Cursor, etc.)
   - **Tech Stack:** Add relevant technologies as tags
3. **Click "Create Project"**

Your project is now created and you're automatically taken to the workspace.

### Navigate Projects

**Grid View** (default):
- Visual cards showing all projects
- See status, platforms, and last updated time
- Click any card to open that project

**List View**:
- Compact list view for many projects
- Sort by name, created date, or last updated
- Better for 10+ projects

### Filter Projects

Use the filter dropdown to see:
- **All** — Every project
- **Ideation** — Early stage ideas
- **Researching** — Gathering requirements
- **Designing** — Creating UI specifications
- **Building** — Active development
- **Shipped** — Completed projects

### Update Project Status

Manually track progress:
1. Open a project
2. Click the status badge (top right)
3. Select new status from dropdown

**Status Flow:**
```
Ideation → Researching → Designing → Building → Shipped
```

### Export a Project

Backup or share your work:
1. Go to Project Hub
2. Click the **⋮** menu on a project card
3. Select **Export**
4. JSON file downloads to your computer

### Import a Project

Restore from backup or import from another user:
1. Go to Project Hub
2. Click **"Import"** button
3. Select JSON file
4. Project appears in your hub

### Delete a Project

Remove a project permanently:
1. Click the **⋮** menu on a project card
2. Select **Delete**
3. Confirm deletion

> ⚠️ **Warning:** This deletes the project, brief, all generated artifacts, and vault files. This action cannot be undone.

---

## Tips & Best Practices

### Naming Conventions

Use descriptive names:
- ✅ "SaaS Dashboard — React + Supabase"
- ✅ "Mobile App — Fitness Tracker"
- ❌ "Test Project"
- ❌ "New App"

### Status Management

Update status as you progress:
- Keeps your workflow organized
- Helps you see what needs attention
- Enables filtering by stage

### Tech Stack Tags

Add 3-5 relevant tags:
```
React, Tailwind, Supabase, TypeScript, Stripe
```

This helps AI tools understand your technical constraints.

### Platform Selection

Be realistic about platforms:
- Select only platforms you actually use
- More platforms = more tailored prompts
- You can add platforms later

---

## Common Issues

### "I can't find my project"

**Solution:**
1. Check your filter — make sure it's set to "All"
2. Try List View — might be easier to scan
3. Use browser search (⌘F) to find by name

### "Export file is too large"

**Solution:**
- Vault files (PDFs, images) increase file size
- Export without vault files if needed
- Use cloud storage for large files

### "Import failed"

**Possible causes:**
- Invalid JSON format
- File was modified externally
- Preflight version mismatch

**Solution:**
- Ensure file is unmodified Preflight export
- Update to latest Preflight version
- Try re-exporting from source

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘N` | New Project |
| `⌘F` | Filter/Search projects |
| `Enter` | Open selected project |

---

## Related Modules

- **[Brief](brief-module.md)** — Define your project requirements
- **[Vault](vault-module.md)** — Store project files and references

---

**Next:** [Brief Module Guide](brief-module.md)

**Previous:** [User Guide Index](README.md)
