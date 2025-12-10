import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const precisionAqPath = path.join(process.cwd(), "public", "faqs", "precision-aq-faq.json")
  const peanutsPath = path.join(process.cwd(), "public", "faqs", "peanuts-faq.json")

  const precisionAqFaq = JSON.parse(fs.readFileSync(precisionAqPath, "utf8"))
  const peanutsFaq = JSON.parse(fs.readFileSync(peanutsPath, "utf8"))

  const presets = [
    {
      id: precisionAqFaq.faqVersion.id,
      name: precisionAqFaq.faqVersion.name,
      questions: precisionAqFaq.faqVersion.questions,
    },
    {
      id: peanutsFaq.faqVersion.id,
      name: peanutsFaq.faqVersion.name,
      questions: peanutsFaq.faqVersion.questions,
    },
  ]

  return NextResponse.json(presets)
}
