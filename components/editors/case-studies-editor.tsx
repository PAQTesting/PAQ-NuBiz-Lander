"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { CaseStudiesData } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { InfoButton } from "@/components/info-button"
import { FileUpload } from "@/components/file-upload"
import { IconSelector } from "@/components/icon-selector"

interface CaseStudiesEditorProps {
  data: CaseStudiesData
  onChange: (data: CaseStudiesData) => void
}

export function CaseStudiesEditor({ data, onChange }: CaseStudiesEditorProps) {
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [selectedStudyId, setSelectedStudyId] = useState<string>("")

  const updateField = (field: keyof CaseStudiesData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addStudy = () => {
    const newStudy = {
      id: Date.now().toString(),
      title: "Case Study Title",
      description: "Brief description of the case study",
      results: "Key results and outcomes",
      icon: "/icons/Check-Badge.svg",
      documentUrl: "",
      documentName: "",
      buttonText: "View Case Study",
    }
    updateField("studies", [...data.studies, newStudy])
  }

  const removeStudy = (id: string) => {
    updateField(
      "studies",
      data.studies.filter((s) => s.id !== id),
    )
  }

  const updateStudy = (id: string, field: string, value: string) => {
    updateField(
      "studies",
      data.studies.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    )
  }

  const openIconSelector = (studyId: string) => {
    setSelectedStudyId(studyId)
    setIconSelectorOpen(true)
  }

  const handleIconSelect = (iconPath: string) => {
    if (selectedStudyId) {
      updateStudy(selectedStudyId, "icon", iconPath)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="cases-title">Section Title</Label>
          <InfoButton content="The heading for your case studies section." />
        </div>
        <Input id="cases-title" value={data.title} onChange={(e) => updateField("title", e.target.value)} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="cases-description">Description</Label>
          <InfoButton content="A brief description that appears below the section title." />
        </div>
        <Textarea
          id="cases-description"
          value={data.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Label>Case Studies</Label>
            <InfoButton content="Showcase your success stories with measurable results." />
          </div>
          <Button size="sm" onClick={addStudy}>
            <Plus className="w-4 h-4 mr-1" />
            Add Case Study
          </Button>
        </div>

        <div className="space-y-4">
          {data.studies.map((study) => (
            <div key={study.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <Label className="text-sm font-semibold">
                  {study.title || `Case Study ${data.studies.indexOf(study) + 1}`}
                </Label>
                <Button size="sm" variant="ghost" onClick={() => removeStudy(study.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs">Title</Label>
                  <InfoButton content="The name of your case study or project." />
                </div>
                <Input
                  placeholder="Case Study Title"
                  value={study.title}
                  onChange={(e) => updateStudy(study.id, "title", e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs">Description</Label>
                  <InfoButton content="Brief overview of the challenge and solution." />
                </div>
                <Textarea
                  placeholder="Description of the case study"
                  value={study.description}
                  onChange={(e) => updateStudy(study.id, "description", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs">Results</Label>
                  <InfoButton content="Key outcomes and measurable impact (e.g., '300% increase in efficiency')." />
                </div>
                <Textarea
                  placeholder="Results and outcomes"
                  value={study.results}
                  onChange={(e) => updateStudy(study.id, "results", e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs">Icon</Label>
                  <InfoButton content="Visual icon to represent this case study." />
                </div>
                <div className="flex items-center gap-2">
                  {study.icon && (
                    <div className="w-12 h-12 border rounded flex items-center justify-center bg-white">
                      <img src={study.icon || "/placeholder.svg"} alt="Icon" className="w-8 h-8 object-contain" />
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={() => openIconSelector(study.id)}>
                    {study.icon ? "Change Icon" : "Select Icon"}
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs">Document</Label>
                  <InfoButton content="Upload a PDF or document with more details about this case study." />
                </div>
                <FileUpload
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  value={study.documentUrl}
                  onChange={(value) => updateStudy(study.id, "documentUrl", value)}
                  onFileNameChange={(name) => updateStudy(study.id, "documentName", name)}
                />
              </div>

              {study.documentUrl && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-xs">Button Text</Label>
                    <InfoButton content="Customize what the download/view button says." />
                  </div>
                  <Input
                    placeholder="View Case Study"
                    value={study.buttonText}
                    onChange={(e) => updateStudy(study.id, "buttonText", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <IconSelector
        open={iconSelectorOpen}
        onClose={() => setIconSelectorOpen(false)}
        onSelect={handleIconSelect}
        selectedIcon={data.studies.find((s) => s.id === selectedStudyId)?.icon}
      />
    </div>
  )
}
