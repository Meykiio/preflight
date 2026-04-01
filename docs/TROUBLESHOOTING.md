# Preflight Troubleshooting Guide

**Last Updated:** April 2026  
**Version:** 0.1.0

---

## Quick Status Check

### ✅ What's Already Working
- OpenRouter provider implemented
- Ollama (local models) provider implemented
- LM Studio (local models) provider implemented
- Content Security Policy updated to allow all providers
- Settings UI supports API keys, base URLs, and model selection
- All providers appear in Settings → AI Providers

### ⚠️ What Needs Attention
- OpenRouter API key needs to be re-entered (old format vs new format)
- Default provider needs to be set to OpenRouter (or your preferred provider)

---

## Quick Setup (When You Return)

### For OpenRouter (2 minutes)

1. **Get Fresh API Key**
   - Go to: https://openrouter.ai/keys
   - Click "Create Key"
   - Copy the new key (format: `sk-or-v1...`)

2. **Configure in Preflight**
   - Open Settings → AI Providers
   - Click Edit (pencil) on OpenRouter card
   - Delete old key, paste new key
   - Select model: `meta-llama/llama-3.1-8b-instruct:free`
   - Click "Save"

3. **Set as Default**
   - Click "SET DEFAULT" on OpenRouter card
   - Green dot should show "Connected"
   - Done!

### For Ollama (Local, 5 minutes)

1. **Install Ollama**
   - Download: https://ollama.ai
   - Run installer

2. **Download Model**
   ```bash
   ollama pull llama3.2
   ```

3. **Configure in Preflight**
   - Settings → Ollama (Local)
   - No API key needed
   - Base URL: `http://localhost:11434/v1`
   - Model: `llama3.2`
   - Click "Save" → "SET DEFAULT"

---

## Common Issues & Solutions

### Issue 1: 429 Rate Limit Errors (OpenAI)

**Error:** `POST https://api.openai.com/v1/chat/completions 429 (Too Many Requests)`

**Cause:** OpenAI API credits expired or rate limit reached

**Solution:**
1. Switch to OpenRouter or local models (see Quick Setup above)
2. OR add credits to OpenAI account

---

### Issue 2: CSP Errors (Connection Blocked)

**Error:** `Refused to connect because it violates the document's Content Security Policy`

**Cause:** `index.html` CSP doesn't allow the domain

**Solution:** Already fixed! The CSP now includes:
- `https://openrouter.ai`
- `https://api.openrouter.ai`
- `http://localhost:11434` (Ollama)
- `http://localhost:1234` (LM Studio)

If you need to add more domains, edit `index.html` line 7, add to `connect-src`.

---

### Issue 3: 404 Not Found (OpenRouter)

**Error:** `POST https://openrouter.ai/api/v1/chat/completions 404 (Not Found)`

**Possible Causes:**
1. **Invalid API key format** - Old key format `SK-OR-V...` vs new `sk-or-v1...`
2. **Wrong model ID** - Model doesn't exist or format is wrong
3. **Key not saved properly** - Need to re-enter

**Solution:**

**Step 1: Check API Key Format**
- ✅ Correct: `sk-or-v1-xxxxxxxxxxxxxxxx`
- ❌ Old/Wrong: `SK-OR-Vxxxxxxxxxxxx`

**Step 2: Get New Key**
1. Go to https://openrouter.ai/keys
2. Delete old key
3. Create new key
4. Copy it (starts with `sk-or-v1...`)

**Step 3: Re-save in Preflight**
1. Settings → AI Providers → OpenRouter → Edit
2. Delete old key completely
3. Paste new key
4. Select model from dropdown (don't type manually)
5. Click "Save"

**Step 4: Verify Model ID**
Use these exact model IDs (from dropdown):
- `meta-llama/llama-3.1-8b-instruct:free` ✅
- `meta-llama/llama-3.2-90b-vision-instruct:free` ✅
- `google/gemma-2-9b-it:free` ✅
- `mistralai/mistral-7b-instruct:free` ✅

---

### Issue 4: "No AI provider configured"

**Error:** `No AI provider configured. Please add an API key in Settings.`

**Cause:** No providers are set up or database is empty

**Solution:**
1. Go to Settings → AI Providers
2. Configure at least one provider (OpenRouter recommended)
3. Click "SET DEFAULT" on that provider
4. Save and try again

---

### Issue 5: Ollama Connection Refused

**Error:** `Connection refused` or `Cannot connect to localhost:11434`

**Cause:** Ollama server not running

**Solution:**
1. Check if Ollama is installed: `ollama --version`
2. Start server: `ollama serve`
3. Verify models: `ollama list`
4. Check firewall (allow port 11434)

---

### Issue 6: LM Studio Connection Refused

**Error:** `Connection refused` or `Cannot connect to localhost:1234`

**Cause:** LM Studio server not running

**Solution:**
1. Open LM Studio
2. Go to "Local Server" tab
3. Select a model
4. Click "Start Server"
5. Wait for "Server started" message

---

## API Key Reference

### OpenRouter
- **Format:** `sk-or-v1-xxxxxxxxxxxxxxxx`
- **Get Key:** https://openrouter.ai/keys
- **Free Tier:** $1 credit (~100K tokens)
- **Base URL:** `https://openrouter.ai/api/v1`

### Ollama
- **API Key:** Not required (use "ollama" as dummy if needed)
- **Base URL:** `http://localhost:11434/v1`
- **Setup:** https://ollama.ai

### LM Studio
- **API Key:** Not required
- **Base URL:** `http://localhost:1234/v1`
- **Setup:** https://lmstudio.ai

### OpenAI (if using paid)
- **Format:** `sk-proj-xxxxxxxxxxxxxxxx`
- **Get Key:** https://platform.openai.com/api-keys
- **Base URL:** `https://api.openai.com/v1`

### Anthropic (if using paid)
- **Format:** `sk-ant-xxxxxxxxxxxxxxxx`
- **Get Key:** https://console.anthropic.com/settings/keys
- **Base URL:** N/A (uses SDK directly)

---

## Model ID Reference

### OpenRouter Free Models
```
meta-llama/llama-3.1-8b-instruct:free
meta-llama/llama-3.2-90b-vision-instruct:free
google/gemma-2-9b-it:free
mistralai/mistral-7b-instruct:free
qwen/qwen-2-7b-instruct:free
```

### OpenRouter Paid Models (Higher Quality)
```
openai/gpt-4o-mini
openai/gpt-4o
anthropic/claude-3.5-sonnet
anthropic/claude-3-opus
```

### Ollama Models (Local)
```
llama3.2
llama3.1
mistral
mixtral
phi3
```

### LM Studio Models
```
local-model (auto-detected from loaded model)
```

---

## Database Reset (Last Resort)

If everything is broken and you want to start fresh:

1. **Open Browser DevTools** (F12)
2. **Go to Application tab**
3. **Expand IndexedDB** → `preflight-db`
4. **Right-click** → "Clear" or "Delete"
5. **Refresh page** (Ctrl+Shift+R)
6. **Re-configure providers** in Settings

⚠️ **Warning:** This deletes all projects, prompts, and settings!

---

## Checklist for First-Time Setup

- [ ] Get OpenRouter API key from https://openrouter.ai/keys
- [ ] Open Preflight Settings → AI Providers
- [ ] Click Edit on OpenRouter card
- [ ] Paste API key (format: `sk-or-v1...`)
- [ ] Select model: `meta-llama/llama-3.1-8b-instruct:free`
- [ ] Click "Save"
- [ ] Click "SET DEFAULT" on OpenRouter card
- [ ] Verify green dot shows "Connected"
- [ ] Test by generating something (Research, Build, etc.)
- [ ] No errors = Success! 🎉

---

## Getting Help

If you're still stuck:

1. **Check Browser Console** (F12 → Console tab)
   - Copy the full error message
   - Look for status codes (404, 429, 500)
   - Look for CORS or CSP errors

2. **Verify Provider Status**
   - Settings → AI Providers
   - Check which provider has "DEFAULT" badge
   - Check which providers show "Connected" (green dot)

3. **Test Connection**
   - Try a simple prompt first
   - Check if it's a specific page or all pages
   - Try different models

4. **Documentation**
   - `docs/LOCAL_MODELS_SETUP.md` - Full setup guide
   - `docs/QUICK_START.md` - 2-minute reference (create next)
   - `README.md` - Project overview

---

## Files Reference

### Key Files Modified
- `index.html` - CSP configuration (line 7)
- `src/types/index.ts` - Provider types
- `src/lib/ai/providerCatalog.ts` - Provider definitions
- `src/services/ai/providers/` - Provider implementations
- `src/components/settings/ProviderCard.tsx` - Settings UI

### Documentation Files
- `docs/LOCAL_MODELS_SETUP.md` - Complete setup guide
- `docs/TROUBLESHOOTING.md` - This file
- `docs/QUICK_START.md` - Quick reference (to create)

---

## Next Steps After Setup

Once OpenRouter is working:

1. **Try Local Models** (optional, for unlimited free usage)
   - Install Ollama or LM Studio
   - Configure in Settings
   - Set as default if preferred

2. **Explore Features**
   - Research page
   - Build page
   - Design page
   - PRD generation

3. **Customize**
   - Agent prompts
   - Platform launchers
   - Appearance settings

---

**Remember:** The most common issue is the API key format. Always use the fresh `sk-or-v1...` format, not the old `SK-OR-V...` format.
