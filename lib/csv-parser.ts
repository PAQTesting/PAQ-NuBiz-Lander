import type { TeamMember } from "./types"

export function parseTeamCSV(csvText: string): TeamMember[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row")
  }

  // Parse header
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

  // Expected headers (flexible matching)
  const nameIndex = headers.findIndex((h) => h.includes("name"))
  const roleIndex = headers.findIndex((h) => h.includes("role") || h.includes("position") || h.includes("title"))
  const bioIndex = headers.findIndex((h) => h.includes("bio") || h.includes("description"))
  const imageIndex = headers.findIndex((h) => h.includes("image") || h.includes("photo") || h.includes("picture"))
  const linkedinIndex = headers.findIndex((h) => h.includes("linkedin"))
  const emailIndex = headers.findIndex((h) => h.includes("email"))

  if (nameIndex === -1) {
    throw new Error("CSV must have a 'name' column")
  }

  // Parse data rows
  const members: TeamMember[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle quoted values with commas
    const values: string[] = []
    let currentValue = ""
    let insideQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === "," && !insideQuotes) {
        values.push(currentValue.trim())
        currentValue = ""
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())

    const member: TeamMember = {
      id: `csv-${Date.now()}-${i}`,
      name: values[nameIndex] || "Team Member",
      role: roleIndex !== -1 ? values[roleIndex] || "Position" : "Position",
      bio: bioIndex !== -1 ? values[bioIndex] || "" : "",
      image: imageIndex !== -1 ? values[imageIndex] || "/professional-headshot.png" : "/professional-headshot.png",
      linkedin: linkedinIndex !== -1 ? values[linkedinIndex] || "" : "",
      email: emailIndex !== -1 ? values[emailIndex] || "" : "",
    }

    members.push(member)
  }

  return members
}

export function generateSampleCSV(): string {
  return `name,role,bio,image,linkedin,email
John Doe,CEO & Founder,Visionary leader with 15+ years of experience in technology and innovation,/professional-headshot.png,https://linkedin.com/in/johndoe,john@company.com
Jane Smith,CTO,Technical expert specializing in scalable architecture and team leadership,/professional-headshot.png,https://linkedin.com/in/janesmith,jane@company.com
Mike Johnson,Head of Design,Creative director with a passion for user-centered design,/professional-headshot.png,https://linkedin.com/in/mikejohnson,mike@company.com`
}
