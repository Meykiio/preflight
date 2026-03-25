# Build Module Guide

**Sequential build workflow** — From foundation to deployment, one stage at a time.

---

## What It Does

The Build module:
- Generates sequential build prompts
- Tracks progress through stages
- Supports multiple platforms
- Enables prompt export
- Manages stage completion

---

## When to Use It

Use Build **after PRD** — this is where you actually generate the prompts to build your app.

**Prerequisites:**
- Brief completed (80%+)
- Research gathered
- Design prompts generated
- PRD complete
- System instructions ready

---

## Step-by-Step Guide

### 1. Generate Full Build Workflow

Click **"Generate Full Build Workflow"**

The AI generates 5 sequential stages:

#### Stage 1: Foundation
- Project structure
- Configuration files
- Type definitions
- Database schema
- State management
- Layout shell
- DOCS.md creation

#### Stage 2: Database & Auth
- Complete schema implementation
- RLS policies (if using Supabase)
- Service layer
- Auth setup (if applicable)
- Seed data

#### Stage 3: Features
- One prompt per feature
- Each feature is complete and testable
- Features build on each other

#### Stage 4: Audit
- Code quality review
- Refactoring
- Documentation updates
- Test coverage

#### Stage 5: Deployment
- Production build config
- Environment variables
- CI/CD setup
- Security headers

### 2. Review Each Stage

Read each stage carefully:
- Does it match your PRD?
- Are all features included?
- Is the tech stack correct?

### 3. Start with Stage 1

**Never skip stages.** Each stage builds on the previous:

1. Copy Stage 1 prompt
2. Paste into your AI coding tool (Cursor, Lovable, Bolt, etc.)
3. Wait for completion
4. Run `npm run build` — must pass with zero errors
5. Verify the foundation is correct
6. Mark Stage 1 as **Complete** in Preflight

### 4. Proceed Through Stages

Repeat for each stage:
1. Copy stage prompt
2. Paste into AI coding tool
3. Wait for completion
4. Test thoroughly
5. Mark complete in Preflight

### 5. Export All Prompts (Optional)

Click **"Export All"** to download all stage prompts as a single file for reference.

---

## Tips & Best Practices

### Never Skip Stages

Each stage establishes patterns the next stage relies on:
- Foundation → Folder structure, types, config
- Database → Schema, service layer patterns
- Features → Build on established patterns
- Audit → Catches drift and inconsistencies
- Deploy → Production-ready config

### Test After Each Stage

Don't proceed until:
- `npm run build` passes with zero errors
- `npm run typecheck` passes
- All tests pass
- Manual testing confirms features work

### One Feature Per Prompt

If a stage has multiple features:
- Build one feature at a time
- Test thoroughly before moving to next
- This prevents cascading errors

### Use the Right Tool

Match the prompt to your tool:
- **Lovable:** Use Plan Mode, one feature per prompt
- **Cursor:** Reference files with @filename
- **Claude Code:** Read CLAUDE.md first
- **Bolt:** Component isolation

---

## Stage Statuses

| Status | Meaning | Action |
|--------|---------|--------|
| **Locked** | Can't start yet | Complete previous stage first |
| **Not Started** | Ready to begin | Click stage to view prompt |
| **In Progress** | Currently building | Working in AI coding tool |
| **Complete** | Done and tested | Proceed to next stage |

---

## Common Issues

### "Stage 2 failed, what do I do?"

**Don't proceed to Stage 3.** Instead:
1. Read the error messages
2. Ask your AI coding tool to fix
3. Re-run tests
4. Only proceed when Stage 2 passes

### "The generated prompt is too long"

**Solution:**
- Long prompts build better products
- AI coding tools handle long context
- If needed, split into sub-prompts

### "I made a mistake in Stage 1"

**Solution:**
- Go back and fix Stage 1
- Re-test thoroughly
- Then proceed to Stage 2
- Don't build on a broken foundation

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘Enter` | Generate build workflow |
| `⌘E` | Export all prompts |

---

## Error Recovery

If a generation fails mid-stage:
1. Preflight saves progress automatically
2. You'll see a **Resume** option
3. Click **Resume** to continue
4. Or **Retry** to start over

---

## Related Modules

- **[Vault](vault-module.md)** — Store build artifacts and exports
- **[PRD](prd-module.md)** — Reference for build requirements

---

**Next:** [Vault Module Guide](vault-module.md)

**Previous:** [PRD Module](prd-module.md)
