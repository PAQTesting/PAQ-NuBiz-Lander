"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { LandingPageData } from "@/lib/types"
import { Download, Loader2, FileCode, Package, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AssetConverter } from "@/lib/asset-converter"
import { createZipExport } from "@/lib/zip-exporter"
import { createAssetFolderExport, calculateExportSize, formatFileSize } from "@/lib/asset-folder-exporter"
import { generateHTML } from "@/lib/html-generator"

interface ExportDialogProps {
  data: LandingPageData
  onClose: () => void
}

export function ExportDialog({ data, onClose }: ExportDialogProps) {
  const [exportType, setExportType] = useState<"html" | "json" | "zip" | "asset-folder">("html")
  const [exported, setExported] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      let processedData = data

      if (exportType === "html" || exportType === "zip") {
        const converter = new AssetConverter()
        processedData = await converter.processLandingPageData(data)
      }

      if (exportType === "asset-folder") {
        const zipBlob = await createAssetFolderExport(data)
        const url = URL.createObjectURL(zipBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = "nubiz_site_asset_folder.zip"
        a.click()
        URL.revokeObjectURL(url)
      } else if (exportType === "zip") {
        const html = generateHTML(processedData)
        const zipBlob = await createZipExport(processedData, html)
        const url = URL.createObjectURL(zipBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = "landing-page.zip"
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const content = exportType === "html" ? generateHTML(processedData) : JSON.stringify(processedData, null, 2)
        const blob = new Blob([content], { type: exportType === "html" ? "text/html" : "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `landing-page.${exportType}`
        a.click()
        URL.revokeObjectURL(url)
      }
      
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const singleFileSize = calculateExportSize(generateHTML(data))
  const showSizeWarning = singleFileSize > 6 * 1024 * 1024 && exportType === "html"

  const exportOptions = [
    {
      id: "html",
      icon: FileCode,
      title: "Single-File (Portable)",
      description: "One HTML file with all assets embedded inline",
      details: "Perfect for quick sharing via email or simple hosting. All images and styles are encoded directly into the HTML file, making it completely self-contained and portable.",
      useCases: ["Email attachments", "Quick prototypes", "Simple hosting"],
      fileSize: singleFileSize > 0 ? formatFileSize(singleFileSize) : null,
      recommended: false,
    },
    {
      id: "asset-folder",
      icon: Package,
      title: "Asset Folder (Recommended)",
      description: "Organized folder structure with separate HTML, CSS, and assets",
      details: "Professional setup with optimized file organization. Includes hashed filenames for cache-busting, separate CSS for easy styling, and comprehensive deployment instructions. Best for production sites.",
      useCases: ["Production deploys", "Team collaboration", "Future editing"],
      fileSize: null,
      recommended: true,
    },
    {
      id: "json",
      icon: FileJson,
      title: "JSON Data Backup",
      description: "Save your page configuration for later import",
      details: "Export your entire page configuration as JSON data. Use this to back up your work, share with team members, or import into another project.",
      useCases: ["Version control", "Team sharing", "Data backup"],
      fileSize: null,
      recommended: false,
    },
    {
      id: "zip",
      icon: Download,
      title: "ZIP Package",
      description: "Complete bundle with HTML, README, and deployment guide",
      details: "Get everything in one package: single-file HTML, deployment instructions, and a comprehensive README. Ideal for client handoffs or quick deployment to any platform.",
      useCases: ["Client handoff", "Quick deploy", "Documentation"],
      fileSize: null,
      recommended: false,
    },
  ] as const

  const selectedOption = exportOptions.find((opt) => opt.id === exportType)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Export Landing Page</DialogTitle>
          <DialogDescription className="text-base">
            Choose your export format based on how you plan to deploy and maintain your site.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {exported && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                Successfully exported! Check your downloads folder.
              </AlertDescription>
            </Alert>
          )}

          {showSizeWarning && (
            <Alert className="border-amber-500 bg-amber-50">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Large file detected ({formatFileSize(singleFileSize)}).</strong> Consider using the{" "}
                <button
                  onClick={() => setExportType("asset-folder")}
                  className="underline font-semibold hover:text-amber-900"
                >
                  Asset Folder option
                </button>{" "}
                for faster loading and easier editing.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-[1.2fr_1.5fr] gap-8">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Select export format:</Label>
              <RadioGroup value={exportType} onValueChange={(value) => setExportType(value as typeof exportType)}>
                {exportOptions.map((option) => (
                  <div key={option.id} className="relative">
                    <Label
                      htmlFor={option.id}
                      className={`flex items-start gap-4 p-5 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 ${
                        exportType === option.id
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <RadioGroupItem value={option.id} id={option.id} className="mt-1 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <option.icon className="w-5 h-5 text-gray-700 flex-shrink-0" />
                          <span className="font-semibold text-base text-gray-900 flex-shrink-0">{option.title}</span>
                          {option.recommended && (
                            <span className="ml-auto text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                        {option.fileSize && exportType === option.id && (
                          <p className="text-xs text-gray-500 mt-2">
                            Estimated size: <strong>{option.fileSize}</strong>
                          </p>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                {selectedOption && <selectedOption.icon className="w-6 h-6 text-blue-700 mt-1 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">{selectedOption?.title}</h3>
                  <p className="text-sm text-blue-800 leading-relaxed mb-4">{selectedOption?.details}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">Best for:</p>
                    <ul className="space-y-1.5">
                      {selectedOption?.useCases.map((useCase) => (
                        <li key={useCase} className="flex items-center gap-2 text-sm text-blue-800">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {exportType === "asset-folder" && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2">What's included:</p>
                      <ul className="space-y-1 text-xs text-blue-700">
                        <li>• Separate CSS file for easy customization</li>
                        <li>• Optimized asset organization with hashing</li>
                        <li>• Works perfectly offline after unzipping</li>
                        <li>• Deployment guide for all major platforms</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="flex-1" disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {exportType === "asset-folder" ? "Extracting Assets..." : "Preparing Export..."}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download {exportType === "html" ? "HTML" : exportType === "asset-folder" ? "ZIP" : exportType.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
