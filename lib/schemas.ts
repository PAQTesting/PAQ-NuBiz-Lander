import { z } from "zod"


// Hero Section Schema
export const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  ctaText: z.string(),
  ctaLink: z.string().url("Must be a valid URL").or(z.string().regex(/^mailto:/, "Must be a valid mailto link")).or(z.literal("")),
  videoUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  backgroundImage: z.string(),
  selectedBackground: z.string(),
  visible: z.boolean(),
  useRichText: z.boolean().optional(),
  richTextContent: z.string().optional(),
  showCta: z.boolean().optional(),
  backgroundFit: z.enum(["cover", "contain", "fill"]).optional(),
  backgroundPosition: z.enum(["center", "top", "bottom", "left", "right"]).optional(),
})

// Pitch Section Schema
export const pitchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  documentUrl: z.string(),
  documentName: z.string(),
  displayType: z.enum(["inline", "download", "link"]),
  visible: z.boolean(),
  useRichText: z.boolean().optional(),
  richTextContent: z.string().optional(),
  htmlEmbed: z.string().optional(),
})

// Team Member Schema
export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: z.string(),
  bio: z.string(),
  image: z.string(),
  linkedin: z.string().url("Must be a valid URL").or(z.literal("")),
  email: z.string().email("Must be a valid email").or(z.literal("")),
})

// Team Section Schema
export const teamSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  members: z.array(teamMemberSchema),
  visible: z.boolean(),
})

// Case Study Schema
export const caseStudySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  results: z.string(),
  icon: z.string(),
  documentUrl: z.string(),
  documentName: z.string(),
  buttonText: z.string(),
})

// Case Studies Section Schema
export const caseStudiesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  studies: z.array(caseStudySchema),
  visible: z.boolean(),
})

// FAQ Item Schema
export const faqItemSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
})

// FAQ Section Schema
export const faqSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  items: z.array(faqItemSchema),
  visible: z.boolean(),
})

// Surprise & Delight Schema
export const surpriseDelightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  imageUrl: z.string(),
  formTitle: z.string(),
  ctaText: z.string(),
  notifyEmail: z.string().email("Must be a valid email").or(z.literal("")),
  visible: z.boolean(),
})

// Customization Schema
export const customizationSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  fontFamily: z.string(),
  logo: z.string(),
  theme: z.string(),
})

// Password Protection Schema
export const passwordProtectionSchema = z.object({
  enabled: z.boolean(),
  password: z.string(),
})

// Analytics Schema
export const analyticsSchema = z.object({
  googleAnalytics: z.string().optional(),
  customCode: z.string().optional(),
})

// Full Landing Page Schema
export const landingPageSchema = z.object({
  hero: heroSchema,
  pitch: pitchSchema,
  team: teamSchema,
  caseStudies: caseStudiesSchema,
  faq: faqSchema,
  surpriseDelight: surpriseDelightSchema,
  customization: customizationSchema,
  sectionOrder: z.array(z.string()),
  passwordProtection: passwordProtectionSchema.optional(),
  analytics: analyticsSchema.optional(),
})

// Helper function to validate and auto-fix data
export function validateAndFixData(data: any) {
  try {
    return {
      data: landingPageSchema.parse(data),
      errors: [],
      isValid: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        data: null,
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
        isValid: false,
      }
    }
    return {
      data: null,
      errors: [{ path: "unknown", message: "Unknown validation error" }],
      isValid: false,
    }
  }
}

export function validateLandingPageData(data: any): any {
  try {
    // Parse and validate the data, returning validated data or throwing error
    const validated = landingPageSchema.parse(data)
    return validated
  } catch (error) {
    if (error instanceof z.ZodError) {
      // For now, return the original data with a warning
      // In production, you might want to throw or handle differently
      console.warn("Validation errors found:", error.errors)
      return data
    }
    return data
  }
}

// Export all schemas
export type HeroData = z.infer<typeof heroSchema>
export type PitchData = z.infer<typeof pitchSchema>
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamData = z.infer<typeof teamSchema>
export type CaseStudy = z.infer<typeof caseStudySchema>
export type CaseStudiesData = z.infer<typeof caseStudiesSchema>
export type FaqItem = z.infer<typeof faqItemSchema>
export type FaqData = z.infer<typeof faqSchema>
export type SurpriseDelightData = z.infer<typeof surpriseDelightSchema>
export type CustomizationData = z.infer<typeof customizationSchema>
export type PasswordProtection = z.infer<typeof passwordProtectionSchema>
export type Analytics = z.infer<typeof analyticsSchema>
export type LandingPageData = z.infer<typeof landingPageSchema>
