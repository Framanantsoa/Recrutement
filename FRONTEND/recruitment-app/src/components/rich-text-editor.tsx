"use client"

import { useEffect, useRef } from "react"
import { styled } from "styled-components"

/* =============================
   Types
============================= */

interface AttachmentValue {
  name: string
  size: number
  type: string
}

interface RichTextEditorProps {
  placeholder?: string
  onChange?: (content: string) => void
  disabled?: boolean
  initialValue?: string
}

interface QuillRange {
  index: number
}

interface QuillInstance {
  root: HTMLElement
  getSelection: () => QuillRange | null
  insertEmbed: (index: number, type: string, value: AttachmentValue) => void
  on: (event: "text-change", handler: () => void) => void
  enable: (enabled: boolean) => void
}

interface QuillBlotStatic {
  blotName: string
  tagName: string
  className: string
  create: (value: AttachmentValue) => HTMLElement
  value: (node: HTMLElement) => AttachmentValue
}

interface QuillToolbarHandler {
  (): void
}

interface QuillOptions {
  theme: string
  modules: {
    toolbar: {
      container: unknown[]
      handlers?: Record<string, QuillToolbarHandler>
    }
  }
  placeholder?: string
}

interface QuillStatic {
  import: (path: string) => unknown
  register: (blot: QuillBlotStatic, overwrite?: boolean) => void
  new (element: HTMLElement, options: QuillOptions): QuillInstance
}

declare global {
  interface Window {
    Quill?: QuillStatic
  }
}

let isQuillScriptLoaded = false

/* =============================
   Component
============================= */

export default function RichTextEditor({
  placeholder,
  onChange,
  disabled,
  initialValue
}: RichTextEditorProps) {

  const quillRef = useRef<QuillInstance | null>(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  /* =============================
     Helpers
  ============================= */

  const getFileIcon = (type: string): string => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("doc")) return "📝"
    return "📎"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  /* =============================
     Initialize Quill
  ============================= */

  useEffect(() => {

    const initializeQuill = () => {
      if (
        typeof window === "undefined" ||
        !window.Quill ||
        quillRef.current ||
        !editorRef.current
      ) return

      const EmbedImport = window.Quill.import("blots/embed")

      if (typeof EmbedImport !== "function") return

      class AttachmentBlot extends (EmbedImport as { new(): { domNode: HTMLElement } }) {
        static blotName = "attachment"
        static tagName = "div"
        static className = "ql-attachment"

        static create(value: AttachmentValue): HTMLElement {
          const node = document.createElement("div")
          node.className = "ql-attachment"
          node.setAttribute("data-attachment", JSON.stringify(value))

          node.innerHTML = `
            <div class="attachment-preview">
              <span>${getFileIcon(value.type)}</span>
              <span>${value.name}</span>
              <span>${formatFileSize(value.size)}</span>
            </div>
          `
          return node
        }

        static value(node: HTMLElement): AttachmentValue {
          return JSON.parse(node.getAttribute("data-attachment") ?? "{}")
        }
      }

      window.Quill.register(AttachmentBlot)

      quillRef.current = new window.Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: {
            container: [
              [{ size: ["small", false, "large", "huge"] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ]
          }
        }
      })

      if (initialValue) {
        quillRef.current.root.innerHTML = initialValue
      }

      quillRef.current.on("text-change", () => {
        if (!quillRef.current) return
        onChange?.(quillRef.current.root.innerHTML)
      })

      quillRef.current.enable(!disabled)
    }

    if (!isQuillScriptLoaded && !window.Quill) {
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"
      script.async = true
      script.onload = () => {
        isQuillScriptLoaded = true
        initializeQuill()
      }
      document.body.appendChild(script)
    } else {
      initializeQuill()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* =============================
     Sync initialValue safely
  ============================= */

  useEffect(() => {
    if (!quillRef.current || initialValue === undefined) return

    const current = quillRef.current.root.innerHTML
    if (current !== initialValue) {
      quillRef.current.root.innerHTML = initialValue
    }
  }, [initialValue])

  /* =============================
     Handle disabled
  ============================= */

  useEffect(() => {
    if (!quillRef.current) return
    quillRef.current.enable(!disabled)
  }, [disabled])

  /* =============================
     Render
  ============================= */

  return (
    <div className="rich-editor-container">
      <link
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
        rel="stylesheet"
      />
      <div
        ref={editorRef}
        style={{
          minHeight: "120px",
          fontFamily: "'Century Gothic', sans-serif",
          opacity: disabled ? 0.5 : 1
        }}
      />
    </div>
  )
}

/* =============================
   Styled Component
============================= */

export const StyledRichTextEditor = styled(RichTextEditor)`
  .ql-editor {
    font-family: 'Century Gothic', Arial, sans-serif;
    font-size: 12px;
  }
`