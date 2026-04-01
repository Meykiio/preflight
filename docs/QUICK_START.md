# Preflight Quick Start Guide

**For When You Return After a Break** ⚡

---

## Current Status (As of Last Session)

✅ **Implemented:**
- OpenRouter provider (free tier)
- Ollama provider (local models)
- LM Studio provider (local models)
- CSP fixed to allow all providers

⚠️ **Needs Action:**
- Re-enter OpenRouter API key (new format required)
- Set OpenRouter as default provider

---

## 2-Minute Fix (Do This First)

### Step 1: Get New API Key (30 seconds)
```
1. Go to: https://openrouter.ai/keys
2. Click "Create Key"
3. Copy the key (starts with: sk-or-v1...)
```

### Step 2: Update in Preflight (1 minute)
```
1. Open Preflight → Settings → AI Providers
2. Click Edit (pencil) on "OpenRouter" card
3. Delete old key, paste NEW key
4. Select model: meta-llama/llama-3.1-8b-instruct:free
5. Click "Save"
```

### Step 3: Set as Default (30 seconds)
```
1. Click "SET DEFAULT" on OpenRouter card
2. Verify green dot shows "Connected"
3. Done! No more 429 errors!
```

---

## If It Doesn't Work

### Getting 404 Error?
- Key format is wrong (old: `SK-OR-V...` → new: `sk-or-v1...`)
- **Fix:** Get fresh key from openrouter.ai/keys

### Getting CSP Error?
- Already fixed in `index.html`
- **Fix:** Hard refresh page (Ctrl+Shift+R)

### Still Getting 429 (OpenAI)?
- OpenAI is still set as default
- **Fix:** Click "SET DEFAULT" on OpenRouter card

---

## Alternative: Use Local Models (Free & Unlimited)

### Ollama Setup (5 minutes)
```bash
# 1. Install
Download from: https://ollama.ai

# 2. Download model
ollama pull llama3.2

# 3. Start server
ollama serve

# 4. Configure in Preflight
Settings → Ollama (Local) → Save
(No API key needed)
```

### LM Studio Setup (5 minutes)
```
1. Install: https://lmstudio.ai
2. Download model from app
3. Click "Start Server"
4. Settings → LM Studio (Local) → Save
(No API key needed)
```

---

## Quick Reference

### Correct API Key Formats
| Provider | Format | Example |
|----------|--------|---------|
| OpenRouter | `sk-or-v1-...` | `sk-or-v1-abc123xyz` |
| OpenAI | `sk-proj-...` | `sk-proj-abc123xyz` |
| Anthropic | `sk-ant-...` | `sk-ant-abc123xyz` |

### Free Model IDs (OpenRouter)
- `meta-llama/llama-3.1-8b-instruct:free` ⭐ Best balance
- `google/gemma-2-9b-it:free`
- `mistralai/mistral-7b-instruct:free`

### Local Model Names (Ollama)
- `llama3.2` ⭐ Fast & good
- `llama3.1`
- `mistral`
- `phi3`

### Base URLs
- OpenRouter: `https://openrouter.ai/api/v1`
- Ollama: `http://localhost:11434/v1`
- LM Studio: `http://localhost:1234/v1`

---

## Checklist

Before shutting down next time:

- [ ] OpenRouter has green "Connected" dot
- [ ] OpenRouter has "DEFAULT" badge
- [ ] Test generation works (no 429 errors)
- [ ] Bookmark: https://openrouter.ai/keys

---

## Full Documentation

- `docs/TROUBLESHOOTING.md` - Complete troubleshooting guide
- `docs/LOCAL_MODELS_SETUP.md` - Local models setup
- `README.md` - Project overview

---

## TL;DR

**Problem:** OpenAI credits expired → 429 errors

**Solution:** 
1. Get new OpenRouter key: https://openrouter.ai/keys
2. Settings → OpenRouter → Edit → Paste key → Save
3. Click "SET DEFAULT" on OpenRouter
4. Done! 🎉

**Time:** 2 minutes

**Cost:** $0 (free tier)

---

**Safe travels! See you when you're back.** ✈️
