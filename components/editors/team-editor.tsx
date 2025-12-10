"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { TeamData, TeamMember } from "@/lib/types"
import { Plus, Trash2, Upload, Users } from "lucide-react"
import { InfoButton } from "@/components/info-button"
import { CsvImportDialog } from "@/components/csv-import-dialog"
import { TeamBioSelector } from "@/components/team-bio-selector"
import { FileUpload } from "@/components/file-upload"

interface TeamEditorProps {
  data: TeamData
  onChange: (data: TeamData) => void
}

export function TeamEditor({ data, onChange }: TeamEditorProps) {
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [showBioSelector, setShowBioSelector] = useState(false)

  const updateField = (field: keyof TeamData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: "Team Member",
      role: "Position",
      bio: "Brief bio",
      image: "/professional-headshot.png",
      linkedin: "",
      email: "",
    }
    updateField("members", [...data.members, newMember])
  }

  const handleBioSelect = (member: TeamMember) => {
    updateField("members", [...data.members, member])
  }

  const removeMember = (id: string) => {
    updateField(
      "members",
      data.members.filter((m) => m.id !== id),
    )
  }

  const updateMember = (id: string, field: string, value: string) => {
    updateField(
      "members",
      data.members.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    )
  }

  const handleCsvImport = (members: TeamMember[]) => {
    updateField("members", [...data.members, ...members])
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="team-title">Section Title</Label>
          <InfoButton content="The heading for your team section." />
        </div>
        <Input id="team-title" value={data.title} onChange={(e) => updateField("title", e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Label>Team Members</Label>
            <InfoButton content="Add team members using preset profiles, CSV import, or manual entry." />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowBioSelector(true)}>
              <Users className="w-4 h-4 mr-1" />
              Select from Database
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowCsvImport(true)}>
              <Upload className="w-4 h-4 mr-1" />
              Import CSV
            </Button>
            <Button size="sm" onClick={addMember}>
              <Plus className="w-4 h-4 mr-1" />
              Add Manually
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {data.members.map((member) => (
            <div key={member.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <Label className="text-sm font-semibold">
                  {member.name || `Member ${data.members.indexOf(member) + 1}`}
                </Label>
                <Button size="sm" variant="ghost" onClick={() => removeMember(member.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, "name", e.target.value)}
                />
                <Input
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => updateMember(member.id, "role", e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Bio"
                value={member.bio}
                onChange={(e) => updateMember(member.id, "bio", e.target.value)}
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="LinkedIn URL"
                  value={member.linkedin}
                  onChange={(e) => updateMember(member.id, "linkedin", e.target.value)}
                />
                <Input
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) => updateMember(member.id, "email", e.target.value)}
                />
              </div>
              <FileUpload
                value={member.image}
                onChange={(value) => updateMember(member.id, "image", value)}
                accept="image/*"
                placeholder="Upload headshot or enter URL"
              />
            </div>
          ))}
        </div>
      </div>

      <TeamBioSelector open={showBioSelector} onClose={() => setShowBioSelector(false)} onSelect={handleBioSelect} />

      <CsvImportDialog open={showCsvImport} onClose={() => setShowCsvImport(false)} onImport={handleCsvImport} />
    </div>
  )
}
