import JSZip from "jszip"
import type { LandingPageData } from "./types"

export async function createZipExport(data: LandingPageData, html: string): Promise<Blob> {
  const zip = new JSZip()

  // Add HTML file
  zip.file("index.html", html)

  // Add README with instructions
  const readme = `# Landing Page Export

## Files Included
- index.html - Your complete landing page

## Deployment Instructions

### Option 1: Upload to Web Host
1. Upload index.html to your web host via FTP or file manager
2. Access your site at your domain

### Option 2: Deploy to Netlify (Free)
1. Go to https://app.netlify.com/drop
2. Drag and drop this folder
3. Get instant live URL

### Option 3: Deploy to Vercel (Free)
1. Install Vercel CLI: npm i -g vercel
2. Run: vercel
3. Follow the prompts

### Option 4: GitHub Pages
1. Create a new GitHub repository
2. Upload index.html
3. Enable GitHub Pages in repository settings

## Support
For questions, visit: https://yoursite.com/support
`

  zip.file("README.md", readme)

  // Add package.json for npm-based deployments
  const packageJson = {
    name: "landing-page-export",
    version: "1.0.0",
    scripts: {
      serve: "npx serve .",
    },
  }

  zip.file("package.json", JSON.stringify(packageJson, null, 2))

  return await zip.generateAsync({ type: "blob" })
}
