# Markdown Preview

Minimal web app to **preview Markdown instantly**.
No signup.
No API.
Just write and preview.

---

## Live Demo

https://markdown-preview-taupe.vercel.app/

---

## Features

- **Live preview** – see rendered output as you type
- **Split / Edit / Preview modes** – switch between layouts freely
- **Formatting toolbar** – one-click insert for:
  - H1, H2, H3 headings
  - **Bold**, *Italic*, ~~Strikethrough~~
  - Inline `code`
  - Blockquote, Horizontal rule, Link
- **GFM support** – GitHub Flavored Markdown (tables, strikethrough, line breaks)
- **Live stats:**
  - Character count
  - Word count
  - Line count
- **Copy HTML** – copy rendered HTML output to clipboard
- **Example text** – load sample markdown to get started
- **Clear** – reset the editor instantly
- Clean, responsive, Apple-inspired dark UI
- No authentication
- No ads
- No watermarks

---

## Tech Stack

- React (Vite)
- marked.js (Markdown parser)
- Vanilla CSS (Apple-inspired UI)
- Vercel (static deploy)

---

## How It Works

1. **Write Markdown** in the editor on the left
2. **See the rendered preview** update live on the right
3. **Use the toolbar** to insert formatting without typing syntax
4. **Copy the HTML** output with one click

> Everything is processed client-side. Nothing is uploaded.

---

## Privacy

All processing happens **locally in your browser**.
No data is sent to any server.

---

## Installation

```bash
# Clone the repo
git clone https://github.com/berkinyilmaz/markdown-preview.git

# Install dependencies
cd markdown-preview
npm install

# Run locally
npm run dev
```
