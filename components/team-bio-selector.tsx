"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react" // Added import for Search
import type { TeamMember } from "@/lib/types"

interface TeamBioSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (member: TeamMember) => void
}

interface PresetTeamMember {
  Name: string
  Title: string
  Bio: string
  LinkedIn: string
  Image: string
  Email?: string
}

export function TeamBioSelector({ open, onClose, onSelect }: TeamBioSelectorProps) {
  const [presetMembers, setPresetMembers] = useState<PresetTeamMember[]>([])
  const [selectedMember, setSelectedMember] = useState<PresetTeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // Added search functionality

  useEffect(() => {
    if (open) {
      loadPresetMembers()
    }
  }, [open])

  const loadPresetMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/team-bios")
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const data = await response.json()
      setPresetMembers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load team bios:", error)
      setPresetMembers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return presetMembers

    const term = searchTerm.toLowerCase()
    return presetMembers.filter(
      (member) => member.Name.toLowerCase().includes(term) || member.Title.toLowerCase().includes(term),
    )
  }, [presetMembers, searchTerm])

  const handleSelect = () => {
    if (selectedMember) {
      const teamMember: TeamMember = {
        id: Date.now().toString(),
        name: selectedMember.Name,
        role: selectedMember.Title,
        bio: selectedMember.Bio,
        linkedin: selectedMember.LinkedIn,
        email: selectedMember.Email || "",
        image: `/bios/bio images/${selectedMember.Image}`, // Correct path construction
      }
      onSelect(teamMember)
      setSelectedMember(null)
      setSearchTerm("") // Clear search on select
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Team Member</DialogTitle>
          <DialogDescription>Choose from pre-existing team member profiles</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading team members...</div>
        ) : presetMembers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No team members found in database</div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredMembers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No members match your search</div>
                ) : (
                  filteredMembers.map((member, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMember === member ? "border-primary bg-accent" : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={`/bios/bio images/${member.Image}`} alt={member.Name} />
                        <AvatarFallback>
                          {member.Name.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold">{member.Name}</h4>
                            <p className="text-sm text-muted-foreground">{member.Title}</p>
                          </div>
                          {selectedMember === member && <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">{member.Bio}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSelect} disabled={!selectedMember}>
                Add Selected Member
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
