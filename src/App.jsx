import { useState, useCallback, useMemo, useRef } from 'react'
import { marked } from 'marked'

const EXAMPLE_MD = `# Welcome to Markdown Preview

Markdown is a **lightweight** markup language you can use to format plain text.

## Why Markdown?

- Simple and readable syntax
- Converts to clean HTML instantly
- Perfect for docs, notes, and READMEs
- Supported everywhere — GitHub, Notion, Slack

## Basic Formatting

You can write *italic*, **bold**, or ~~strikethrough~~ text inline.

> "The best tool is the one you'll actually use."

## Code

Inline \`code\` is easy. And here's a block:

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Links & Images

[Visit GitHub](https://github.com) to explore open-source projects.

## Tables

| Feature     | Supported |
|-------------|-----------|
| Headers     | ✅        |
| Lists       | ✅        |
| Code blocks | ✅        |
| Tables      | ✅        |

---

Start editing on the **left** to see your preview update live on the **right**.`

const TOOLBAR_ACTIONS = [
  { label: 'H1', title: 'Heading 1', prefix: '# ', suffix: '' },
  { label: 'H2', title: 'Heading 2', prefix: '## ', suffix: '' },
  { label: 'H3', title: 'Heading 3', prefix: '### ', suffix: '' },
  { label: 'B', title: 'Bold', prefix: '**', suffix: '**', wrap: true },
  { label: 'I', title: 'Italic', prefix: '*', suffix: '*', wrap: true },
  { label: '~~', title: 'Strikethrough', prefix: '~~', suffix: '~~', wrap: true },
  { label: '`', title: 'Inline code', prefix: '`', suffix: '`', wrap: true },
  { label: '> ', title: 'Blockquote', prefix: '> ', suffix: '' },
  { label: '—', title: 'Horizontal rule', prefix: '\n---\n', suffix: '' },
  { label: '[]', title: 'Link', prefix: '[', suffix: '](url)' },
]

marked.setOptions({ gfm: true, breaks: true })

export default function App() {
  const [markdown, setMarkdown] = useState(EXAMPLE_MD)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('split')
  const textareaRef = useRef(null)

  const html = useMemo(() => marked(markdown), [markdown])

  const stats = useMemo(() => ({
    chars: markdown.length,
    words: markdown.trim() ? markdown.trim().split(/\s+/).length : 0,
    lines: markdown ? markdown.split('\n').length : 0,
  }), [markdown])

  const insertFormat = useCallback((action) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = markdown.slice(start, end)

    let newText
    let cursorOffset

    if (action.wrap && selected) {
      newText = markdown.slice(0, start) + action.prefix + selected + action.suffix + markdown.slice(end)
      cursorOffset = start + action.prefix.length + selected.length + action.suffix.length
    } else if (action.wrap) {
      const placeholder = action.title
      newText = markdown.slice(0, start) + action.prefix + placeholder + action.suffix + markdown.slice(end)
      cursorOffset = start + action.prefix.length + placeholder.length
    } else {
      newText = markdown.slice(0, start) + action.prefix + selected + action.suffix + markdown.slice(end)
      cursorOffset = start + action.prefix.length + selected.length + action.suffix.length
    }

    setMarkdown(newText)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(cursorOffset, cursorOffset)
    }, 0)
  }, [markdown])

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const clearAll = () => {
    setMarkdown('')
    textareaRef.current?.focus()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Markdown Preview</h1>
        <p className="subtitle">Write raw, see clean — live preview as you type</p>
      </header>

      <div className="toolbar">
        <div className="toolbar-left">
          {TOOLBAR_ACTIONS.map((action) => (
            <button
              key={action.label}
              className="toolbar-btn"
              onClick={() => insertFormat(action)}
              title={action.title}
              aria-label={action.title}
            >
              {action.label}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <div className="view-tabs" role="group" aria-label="View mode">
            {['split', 'edit', 'preview'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className={`main view-${activeTab}`}>
        <div className={`panel editor-panel ${activeTab === 'preview' ? 'hidden' : ''}`}>
          <div className="panel-header">
            <div className="panel-title">
              <span>Markdown</span>
              <div className="stats">
                <span>{stats.chars} chars</span>
                <span>{stats.words} words</span>
                <span>{stats.lines} lines</span>
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn-ghost" onClick={() => setMarkdown(EXAMPLE_MD)} aria-label="Load example">
                Example
              </button>
              {markdown && (
                <button className="btn-ghost" onClick={clearAll} aria-label="Clear">
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Start writing markdown here..."
            spellCheck={false}
            aria-label="Markdown input"
          />
        </div>

        <div className={`panel preview-panel ${activeTab === 'edit' ? 'hidden' : ''}`}>
          <div className="panel-header">
            <div className="panel-title">
              <span>Preview</span>
            </div>
            <div className="panel-actions">
              <button
                className={`btn-primary ${copied ? 'copied' : ''}`}
                onClick={handleCopyHtml}
                disabled={!html}
                aria-label="Copy HTML output"
              >
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
            </div>
          </div>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: html }}
            aria-label="Rendered preview"
          />
        </div>
      </main>

      <footer className="footer">
        <a
          href="https://instagram.com/berkindev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Coded by @berkindev
        </a>
      </footer>
    </div>
  )
}
