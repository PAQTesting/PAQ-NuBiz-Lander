import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "bios", "team-bios.json")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const teamBiosData = JSON.parse(fileContents)

  return NextResponse.json(teamBiosData)
}
