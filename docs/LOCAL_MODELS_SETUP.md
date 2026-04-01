# Local Models & OpenRouter Setup Guide

This guide explains how to configure **OpenRouter** (free tier available) and **local LLM models** (completely free) in Preflight.

---

## Table of Contents

1. [OpenRouter - Free Tier API](#openrouter---free-tier-api)
2. [Ollama - Run Local Models](#ollama---run-local-models)
3. [LM Studio - Local Models with GUI](#lm-studio---local-models-with-gui)
4. [Troubleshooting](#troubleshooting)
5. [Cost Comparison](#cost-comparison)

---

## OpenRouter - Free Tier API

**What is OpenRouter?**  
OpenRouter is an API gateway with 200+ AI models including free options from Meta, Google, and Mistral. You get **$1 free credit** (~100K tokens) to start, with pay-per-use pricing after that.

### Setup Steps

#### 1. Get Your API Key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign in (GitHub, Google, or email)
3. Click **"Create Key"**
4. Copy the generated key

#### 2. Configure in Preflight

1. Open **Settings** → **AI Providers**
2. Click **"OpenRouter"** card
3. Paste your API key
4. Select a model from the dropdown:
   - **Free models:**
     - `meta-llama/llama-3.1-8b-instruct:free` ⭐ Recommended
     - `meta-llama/llama-3.2-90b-vision-instruct:free`
     - `google/gemma-2-9b-it:free`
     - `mistralai/mistral-7b-instruct:free`
     - `qwen/qwen-2-7b-instruct:free`
   - **Paid models** (higher quality):
     - `openai/gpt-4o-mini`
     - `openai/gpt-4o`
     - `anthropic/claude-3.5-sonnet`
5. Click **"Save"**

#### 3. Test It

1. Go to any Preflight page (Research, Build, etc.)
2. Submit a prompt
3. If it works, you're done! 🎉

### Free Model Quality Comparison

| Model | Quality | Speed | Best For |
|-------|---------|-------|----------|
| Llama 3.1 8B | Good | Fast | General tasks, code |
| Llama 3.2 90B | Very Good | Medium | Complex reasoning |
| Gemma 2 9B | Good | Fast | Creative writing |
| Mistral 7B | Good | Fast | Code, analysis |

---

## Ollama - Run Local Models

**What is Ollama?**  
Ollama lets you run LLM models **completely free** on your local machine. No internet required, unlimited usage, and your data stays private.

### System Requirements

- **RAM:** 8GB minimum (16GB recommended)
- **GPU:** NVIDIA/AMD with 4GB+ VRAM (optional but recommended)
- **Storage:** 5-20GB per model
- **OS:** Windows, macOS, or Linux

### Setup Steps

#### 1. Install Ollama

1. Download from [https://ollama.ai](https://ollama.ai)
2. Run the installer
3. Ollama will run in the background automatically

#### 2. Download Models

Open **Command Prompt** or **PowerShell** and run:

```bash
# Recommended models (choose one or more):
ollama pull llama3.2              # ⭐ Best balance (3.2B params, fast)
ollama pull llama3.1              # Good quality (8B params)
ollama pull mistral               # Great for code (7B params)
ollama pull mixtral               # High quality (8x7B params, needs 16GB RAM)
ollama pull phi3                  # Microsoft's small model (3.8B params)
```

#### 3. Verify Server is Running

Ollama should start automatically. To check:

```bash
ollama list
```

You should see your downloaded models. If not, run:

```bash
ollama serve
```

#### 4. Configure in Preflight

1. Open **Settings** → **AI Providers**
2. Click **"Ollama (Local)"** card
3. **No API key needed** - leave it empty
4. Base URL should be: `http://localhost:11434/v1` (default)
5. Select your model from dropdown:
   - `llama3.2` ⭐ Recommended
   - `llama3.1`
   - `mistral`
   - `mixtral`
   - `phi3`
6. Click **"Save"**

#### 5. Test It

1. Go to any Preflight page
2. Submit a prompt
3. If it works, you're done! 🎉

### Custom Base URL

If you changed Ollama's default port, update the Base URL in Settings:
- Default: `http://localhost:11434/v1`
- Custom: `http://localhost:YOUR_PORT/v1`

---

## LM Studio - Local Models with GUI

**What is LM Studio?**  
LM Studio provides a **user-friendly GUI** for downloading and running local LLM models from HuggingFace.

### System Requirements

- **RAM:** 8GB minimum (16GB recommended)
- **GPU:** NVIDIA/AMD with 4GB+ VRAM (optional)
- **Storage:** 5-50GB per model
- **OS:** Windows, macOS, or Linux

### Setup Steps

#### 1. Install LM Studio

1. Download from [https://lmstudio.ai](https://lmstudio.ai)
2. Run the installer
3. Open LM Studio

#### 2. Download Models

1. Click **"Download"** in the left sidebar
2. Search for models (e.g., "Llama 3.2", "Mistral", "Phi-3")
3. Click **Download** on your preferred model
4. Wait for download to complete

#### 3. Start Local Server

1. Click **"Local Server"** in the left sidebar
2. Select your downloaded model from the dropdown
3. Click **"Start Server"**
4. Wait for "Server started" message

#### 4. Configure in Preflight

1. Open **Settings** → **AI Providers**
2. Click **"LM Studio (Local)"** card
3. **No API key needed** - leave it empty
4. Base URL should be: `http://localhost:1234/v1` (default)
5. Model: `local-model` (LM Studio doesn't expose model names via API)
6. Click **"Save"**

#### 5. Test It

1. Go to any Preflight page
2. Submit a prompt
3. If it works, you're done! 🎉

---

## Troubleshooting

### OpenRouter Issues

**Error: "Invalid API key"**
- Double-check you copied the entire key (no extra spaces)
- Ensure you're logged into OpenRouter
- Try regenerating the key

**Error: "Rate limit exceeded"**
- Free models have usage limits
- Wait a few hours or try a different free model
- Consider adding $5-10 credit for higher limits

**Error: "Model not found"**
- Some models may be temporarily unavailable
- Try a different model from the list
- Check [OpenRouter status](https://openrouter.ai/status)

---

### Ollama Issues

**Error: "Connection refused" / "Cannot connect to localhost:11434"**

1. **Check if Ollama is running:**
   ```bash
   ollama list
   ```

2. **Start the server manually:**
   ```bash
   ollama serve
   ```

3. **Check firewall:**
   - Windows: Allow Ollama through Windows Defender Firewall
   - macOS: Allow incoming connections in System Preferences

**Error: "Model not found"**

1. **Download the model:**
   ```bash
   ollama pull llama3.2
   ```

2. **Verify it's installed:**
   ```bash
   ollama list
   ```

**Slow performance:**
- Use smaller models: `llama3.2` or `phi3`
- Close other applications
- Consider upgrading RAM/GPU

**Out of memory:**
- Use smaller models (3B-8B parameters)
- Close other applications
- Reduce model context size in Ollama config

---

### LM Studio Issues

**Error: "Connection refused" / "Cannot connect to localhost:1234"**

1. **Check if server is running:**
   - Open LM Studio
   - Go to "Local Server"
   - Ensure server is started

2. **Check port:**
   - Default is `1234`
   - If changed, update Base URL in Preflight Settings

**Error: "No model loaded"**

1. **Load a model:**
   - Go to "Local Server" in LM Studio
   - Select a model from the dropdown
   - Click "Load Model"

**Slow performance:**
- Use smaller models (3B-8B parameters)
- Enable GPU acceleration in LM Studio settings
- Close other applications

---

### General Issues

**Preflight not responding:**

1. **Check browser console:**
   - Press `F12` → Console tab
   - Look for errors
   - Share errors if asking for help

2. **Restart Preflight:**
   - Stop the dev server (`Ctrl+C`)
   - Run `npm run dev` again

3. **Clear browser cache:**
   - `Ctrl+Shift+Delete` → Clear cache
   - Reload Preflight

**Models producing poor quality responses:**

- **Free models** are less capable than paid ones
- **Local models** vary in quality (Llama 3.2 70B ≈ GPT-3.5 level)
- Try different models for different tasks
- For critical work, consider paid APIs (OpenAI, Anthropic)

---

## Cost Comparison

| Provider | Cost | Models | Speed | Quality | Best For |
|----------|------|--------|-------|---------|----------|
| **OpenRouter (Free)** | $0 | 10+ free models | Fast | Good | Getting started, testing |
| **Ollama (Local)** | $0 | Unlimited (download) | Depends on hardware | Varies | Privacy, offline, unlimited |
| **LM Studio (Local)** | $0 | Unlimited (download) | Depends on hardware | Varies | GUI, easy setup |
| OpenRouter (Paid) | $0.15-15/1M tokens | 200+ models | Fast | Best | Production, high quality |
| OpenAI Direct | $0.15-2.50/1K tokens | GPT-4, etc. | Fast | Best | Enterprise |
| Anthropic Direct | $0.25-15/1M tokens | Claude 3.5 | Fast | Best | Long context |

---

## Quick Reference

### OpenRouter
- **Website:** https://openrouter.ai
- **API Keys:** https://openrouter.ai/keys
- **Free Models:** https://openrouter.ai/models?o=top-weekly&max_price=0
- **Base URL:** `https://openrouter.ai/api/v1`

### Ollama
- **Website:** https://ollama.ai
- **Download:** `ollama pull llama3.2`
- **Server:** `ollama serve`
- **Base URL:** `http://localhost:11434/v1`

### LM Studio
- **Website:** https://lmstudio.ai
- **Models:** Download from HuggingFace via app
- **Server:** Start from "Local Server" tab
- **Base URL:** `http://localhost:1234/v1`

---

## Need Help?

- **GitHub Issues:** Report bugs or request features
- **Discord:** Join the community for real-time help
- **Documentation:** Check the main README.md

---

**Last Updated:** April 2026  
**Preflight Version:** 0.1.0
