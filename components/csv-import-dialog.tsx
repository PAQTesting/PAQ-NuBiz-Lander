"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react"
import { parseTeamCSV, generateSampleCSV } from "@/lib/csv-parser"
import type { TeamMember } from "@/lib/types"

interface CsvImportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (members: TeamMember[]) => void
}

export function CsvImportDialog({ open, onClose, onImport }: CsvImportDialogProps) {
  const [csvText, setCsvText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvText(text)
      setError(null)
      setSuccess(false)
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    try {
      const members = parseTeamCSV(csvText)
      if (members.length === 0) {
        setError("No valid team members found in CSV")
        return
      }
      onImport(members)
      setSuccess(true)
      setError(null)
      setTimeout(() => {
        onClose()
        setCsvText("")
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV")
      setSuccess(false)
    }
  }

  const handleDownloadSample = () => {
    const csv = generateSampleCSV()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "team-bios-sample.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Team Members from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file or paste CSV data to import team members. The CSV should include columns for name, role,
            bio, image, linkedin, and email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => document.getElementById("csv-file")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV File
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownloadSample}>
              <Download className="w-4 h-4 mr-2" />
              Download Sample
            </Button>
          </div>

          <input id="csv-file" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />

          <div>
            <label className="text-sm font-medium mb-2 block">Or paste CSV data:</label>
            <Textarea
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value)
                setError(null)
                setSuccess(false)
              }}
              placeholder="name,role,bio,image,linkedin,email&#10;John Doe,CEO,Bio text,/image.png,https://linkedin.com,email@company.com"
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Team members imported successfully!</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 text-blue-900">CSV Format Guide:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• First row must be headers (name, role, bio, etc.)</li>
              <li>• Name column is required</li>
              <li>• Use quotes for values containing commas</li>
              <li>• Image URLs should be full paths or relative paths</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!csvText.trim()} className="flex-1">
              Import Team Members
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
