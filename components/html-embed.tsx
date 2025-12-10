"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Eye, AlertTriangle } from "lucide-react"

interface HtmlEmbedProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function HtmlEmbed({ value, onChange, label = "HTML Code" }: HtmlEmbedProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sanitizeHtml = (html: string): string => {
    // Basic sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/on\w+='[^']*'/gi, "")
  }

  const handleChange = (newValue: string) => {
    try {
      const sanitized = sanitizeHtml(newValue)
      onChange(sanitized)
      setError(null)
    } catch (e) {
      setError("Invalid HTML code")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? <Code className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showPreview ? (
        <div className="border rounded-lg p-4 bg-white min-h-[200px]">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="<div>Your HTML code here...</div>"
          className="font-mono text-sm min-h-[200px]"
        />
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Script tags and event handlers are automatically removed for security.
        </AlertDescription>
      </Alert>
    </div>
  )
}
