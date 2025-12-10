export interface HeroData {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  videoUrl: string
  backgroundImage: string
  selectedBackground: string
  visible: boolean
  useRichText?: boolean
  richTextContent?: string
  showCta?: boolean
  backgroundFit?: "cover" | "contain" | "fill"
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right"
}

export interface PitchData {
  title: string
  description: string
  documentUrl: string
  documentName: string
  displayType: "inline" | "download" | "link"
  visible: boolean
  useRichText?: boolean
  richTextContent?: string
  htmlEmbed?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  linkedin: string
  email: string
}

export interface TeamData {
  title: string
  subtitle: string
  members: TeamMember[]
  visible: boolean
}

export interface CaseStudy {
  id: string
  title: string
  description: string
  results: string
  icon: string
  documentUrl: string
  documentName: string
  buttonText: string
}

export interface CaseStudiesData {
  title: string
  description: string
  studies: CaseStudy[]
  visible: boolean
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqData {
  title: string
  subtitle: string
  items: FaqItem[]
  visible: boolean
}

export interface SurpriseDelightData {
  title: string
  subtitle: "With our partnership, you can sleep easy knowing we have your back. Now, the only thing keeping you up will be the coffee!"
  imageUrl: "/coffee-cup-wooden-table.png"
  formTitle: "Free cup on us!"
  ctaText: "Give Me Coffee"
  notifyEmail: ""
  visible: boolean
}

export interface FooterData {
  copyrightText: string
  ctaText: string
  ctaEmail: string
  backgroundColor: string
  textColor: string
  ctaButtonColor: string
}

export interface CustomizationData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  logo: string
  theme: string
}

export interface LandingPageData {
  hero: HeroData
  pitch: PitchData
  team: TeamData
  caseStudies: CaseStudiesData
  faq: FaqData
  surpriseDelight: SurpriseDelightData
  customization: CustomizationData
  footer: FooterData // Added footer to landing page data
  sectionOrder: string[]
  passwordProtection?: {
    enabled: boolean
    password: string
  }
  analytics?: {
    googleAnalytics?: string
    customCode?: string
  }
}

export const defaultLandingPageData: LandingPageData = {
  hero: {
    title: "Thanks for having us!",
    subtitle:
      "It was an honor and a privilege to be able to be considered for your RFP and the time that we shared, please have a look around. In case you you forgot anything we shared, please have a look around.",
    ctaText: "Be in Touch",
    ctaLink: "#contact",
    videoUrl: "",
    backgroundImage: "",
    selectedBackground: "gradient-magenta",
    visible: true,
    useRichText: false,
    richTextContent: "",
    showCta: true,
    backgroundFit: "cover",
    backgroundPosition: "center",
  },
  pitch: {
    title: "What we shared with you",
    description: "In case you missed it, here's a refresher of what we shared with you in our presentation",
    documentUrl: "",
    documentName: "",
    displayType: "inline",
    visible: true,
    useRichText: false,
    richTextContent: "",
    htmlEmbed: "",
  },
  team: {
    title: "Meet Your Team",
    subtitle: "The folks on your side throughout the work",
    members: [],
    visible: true,
  },
  caseStudies: {
    title: "Show Your Work",
    description: "We have loads of experience and here are some relevant case studies from our recent work",
    studies: [],
    visible: true,
  },
  faq: {
    title: "Learn more about Precision AQ",
    subtitle: "Additional background on Precision AQ and other things",
    items: [],
    visible: true,
  },
  surpriseDelight: {
    title: "Know what's keeping you up at night",
    subtitle:
      "With our partnership, you can sleep easy knowing we have your back. Now, the only thing keeping you up will be the coffee!",
    imageUrl: "/coffee-cup-wooden-table.png",
    formTitle: "Free cup on us!",
    ctaText: "Give Me Coffee",
    notifyEmail: "",
    visible: true,
  },
  customization: {
    primaryColor: "#cb009f",
    secondaryColor: "#850064",
    accentColor: "#0f1822",
    fontFamily: "Proxima Nova, Arial, sans-serif",
    logo: "/logos/precision-aq-logo-full-color.png",
    theme: "default",
  },
  footer: {
    copyrightText: "© {year} Precision AQ. All rights reserved.",
    ctaText: "Get in touch with Precision",
    ctaEmail: "hello@precisionaq.com",
    backgroundColor: "#111827",
    textColor: "#ffffff",
    ctaButtonColor: "#2563eb",
  },
  sectionOrder: ["hero", "pitch", "team", "caseStudies", "faq", "surpriseDelight", "footer"],
  passwordProtection: {
    enabled: false,
    password: "",
  },
  analytics: {
    googleAnalytics: "",
    customCode: "",
  },
}
