# Design Module Guide

**Create design prompts for AI tools** — Generate production-ready UI specifications.

---

## What It Does

The Design module:
- Generates design prompts for AI design tools
- Supports multiple platform variants
- Tracks design history
- Stores design exports in Vault

---

## When to Use It

Use Design **after Research** and before PRD. This ensures:
- Your design is informed by research
- You have visual specs before building
- AI coding tools have clear UI requirements

---

## Step-by-Step Guide

### 1. Select Platform

Choose your design tool:
- **Stitch** — Best for complete app generation
- **v0** — Best for component generation
- **Figma AI** — Best for design system work
- **Locofy** — Best for Figma to code
- **Universal** — Platform-agnostic prompt

### 2. Select Context Nodes

Include relevant context:
- ☑️ **Brief** — Your problem and users
- ☑️ **Research Results** — Market insights
- ☐ **Vault Files** — Reference designs

### 3. Generate Design Prompt

Click **"Generate Design Prompt"**

The AI generates a comprehensive design prompt covering:
- Design language (colors, typography, spacing)
- Page layouts and components
- Interaction patterns
- Responsive behavior
- Platform-specific constraints

### 4. Copy and Use

Click **"Copy"** then paste into your chosen design tool.

### 5. Save Design Exports

After generating designs:
1. Export from design tool (PNG, SVG, or code)
2. Upload to **Vault**
3. Mark as **"Active Context"** for PRD generation

---

## Tips & Best Practices

### Be Specific About Design Language

If you have preferences, add them to your Brief notes:
- "Dark theme only, inspired by Linear"
- "Playful, colorful design for Gen Z"
- "Minimal, typography-focused like Notion"

### Generate Multiple Variants

Don't settle for the first design:
- Generate 2-3 variants
- Compare approaches
- Mix and match elements you like

### Include Edge Cases

Good design prompts specify:
- Empty states
- Loading states
- Error states
- Mobile vs. desktop behavior

---

## Platform Comparison

| Platform | Best For | Output |
|----------|----------|--------|
| **Stitch** | Complete apps | Full UI code |
| **v0** | Components | React components |
| **Figma AI** | Design systems | Figma files |
| **Locofy** | Figma → Code | Production code |
| **Universal** | Any tool | Platform-agnostic |

---

## Common Issues

### "The design doesn't match my vision"

**Solution:**
- Add more detail to your Brief
- Include reference designs in Vault
- Regenerate with more specific context

### "Generated code doesn't work"

**Solution:**
- Check that you selected the right platform
- Ensure your tech stack matches the output
- Use the code as a starting point, not final

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘Enter` | Generate design prompt |
| `⌘C` | Copy generated prompt |

---

**Next:** [PRD Module Guide](prd-module.md)

**Previous:** [Research Module](research-module.md)
