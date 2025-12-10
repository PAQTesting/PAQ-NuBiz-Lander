/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses a conservative allowlist approach
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""

  // Allowed tags and attributes
  const allowedTags = [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "code",
    "pre",
    "span",
    "div",
  ]

  const allowedAttributes: Record<string, string[]> = {
    a: ["href", "title", "target", "rel"],
    span: ["class", "style"],
    div: ["class", "style"],
  }

  // Create a DOM parser
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Recursive function to sanitize nodes
  function sanitizeNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return node
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const tagName = element.tagName.toLowerCase()

      // Remove disallowed tags
      if (!allowedTags.includes(tagName)) {
        return null
      }

      // Create sanitized element
      const sanitized = document.createElement(tagName)

      // Copy allowed attributes
      const allowed = allowedAttributes[tagName] || []
      Array.from(element.attributes).forEach((attr) => {
        if (allowed.includes(attr.name)) {
          // Sanitize href attributes to prevent javascript: urls
          if (attr.name === "href") {
            const href = attr.value
            if (
              href.startsWith("http://") ||
              href.startsWith("https://") ||
              href.startsWith("mailto:") ||
              href.startsWith("#")
            ) {
              sanitized.setAttribute(attr.name, attr.value)
            }
          } else if (attr.name === "target") {
            // Only allow _blank
            if (attr.value === "_blank") {
              sanitized.setAttribute(attr.name, "_blank")
              sanitized.setAttribute("rel", "noopener noreferrer")
            }
          } else {
            sanitized.setAttribute(attr.name, attr.value)
          }
        }
      })

      // Recursively sanitize children
      Array.from(element.childNodes).forEach((child) => {
        const sanitizedChild = sanitizeNode(child)
        if (sanitizedChild) {
          sanitized.appendChild(sanitizedChild)
        }
      })

      return sanitized
    }

    return null
  }

  // Sanitize all nodes in the body
  const sanitizedBody = document.createElement("div")
  Array.from(doc.body.childNodes).forEach((child) => {
    const sanitized = sanitizeNode(child)
    if (sanitized) {
      sanitizedBody.appendChild(sanitized)
    }
  })

  return sanitizedBody.innerHTML
}

/**
 * Escapes HTML entities in plain text (server-safe)
 * Works in both browser and Node.js environments
 */
export function escapeHtml(text: string): string {
  if (!text) return ""
  
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Sanitizes plain text by escaping HTML entities (legacy browser-based)
 * Note: Use escapeHtml() instead for better compatibility
 */
export function sanitizeText(text: string): string {
  if (!text) return ""

  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

/**
 * Strips all HTML tags from a string
 */
export function stripHtml(html: string): string {
  if (!html) return ""

  const div = document.createElement("div")
  div.innerHTML = html
  return div.textContent || ""
}
