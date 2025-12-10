"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, FileText } from "lucide-react"

interface DocumentViewerProps {
  url: string
  fileName: string
  displayType: "inline" | "download" | "link"
}

export function DocumentViewer({ url, fileName, displayType }: DocumentViewerProps) {
  const [error, setError] = useState(false)

  const getFileType = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase()
    return extension || "unknown"
  }

  const fileType = getFileType(url)
  const isPdf = fileType === "pdf"
  const isOffice = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(fileType)

  if (displayType === "download") {
    return (
      <a href={url} download={fileName} className="inline-block">
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Download {fileName}
        </Button>
      </a>
    )
  }

  if (displayType === "link") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block">
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open {fileName}
        </Button>
      </a>
    )
  }

  // Inline display
  if (error) {
    return (
      <div className="border rounded-lg p-8 text-center bg-gray-50">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-4">Unable to display document inline</p>
        <a href={url} download={fileName}>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Instead
          </Button>
        </a>
      </div>
    )
  }

  if (isPdf) {
    return (
      <iframe
        src={url}
        className="w-full h-[600px] border rounded-lg"
        onError={() => setError(true)}
        title={fileName}
      />
    )
  }

  if (isOffice) {
    // Use Microsoft Office Online Viewer for Office documents
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
        className="w-full h-[600px] border rounded-lg"
        onError={() => setError(true)}
        title={fileName}
      />
    )
  }

  // Fallback for other file types
  return (
    <div className="border rounded-lg p-8 text-center bg-gray-50">
      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-gray-600 mb-2">{fileName}</p>
      <p className="text-sm text-gray-500 mb-4">Preview not available for this file type</p>
      <div className="flex gap-2 justify-center">
        <a href={url} download={fileName}>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </a>
      </div>
    </div>
  )
}
