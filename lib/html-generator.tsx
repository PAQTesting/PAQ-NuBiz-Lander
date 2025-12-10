import type { LandingPageData, TeamMember, CaseStudy, FaqItem } from "@/lib/types"
import { sanitizeHtml, escapeHtml } from "@/lib/sanitize"
import { validateLandingPageData } from "@/lib/schemas"

export function generateHTML(data: LandingPageData): string {
  const validatedData = validateLandingPageData(data)

  const validateCtaLink = (link: string): string => {
    if (link.includes("@") && !link.startsWith("mailto:")) {
      return `mailto:${link}`
    }
    if (link.match(/^\d/) && !link.startsWith("tel:")) {
      return `tel:${link}`
    }
    return link
  }

  const passwordProtectionHTML = validatedData.passwordProtection?.enabled
    ? `
    <script>
      (function() {
        const correctPassword = "${validatedData.passwordProtection.password}";
        const hasAccess = sessionStorage.getItem("siteAccess") === "granted";
        
        if (!hasAccess) {
          const password = prompt("This site is password protected. Please enter the password:");
          if (password === correctPassword) {
            sessionStorage.setItem("siteAccess", "granted");
          } else {
            alert("Incorrect password");
            window.location.href = "about:blank";
          }
        }
      })();
    </script>
    `
    : ""

  const analyticsHTML = `
    ${
      validatedData.analytics?.googleAnalytics
        ? `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${validatedData.analytics.googleAnalytics}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${validatedData.analytics.googleAnalytics}');
    </script>
    `
        : ""
    }
    ${validatedData.analytics?.customCode || ""}
    `

  const pitchContentHTML = validatedData.pitch.htmlEmbed
    ? `<div class="html-embed">${validatedData.pitch.htmlEmbed}</div>`
    : validatedData.pitch.documentUrl
      ? `
        <div class="document-container">
          ${
            validatedData.pitch.displayType === "inline"
              ? `<iframe src="${validatedData.pitch.documentUrl}" style="width: 100%; height: 600px; border: none; border-radius: 8px;"></iframe>`
              : validatedData.pitch.displayType === "link"
                ? `<a href="${validatedData.pitch.documentUrl}" target="_blank" rel="noopener noreferrer" class="btn">Open ${validatedData.pitch.documentName || "Document"}</a>`
                : `<a href="${validatedData.pitch.documentUrl}" class="btn" download="${validatedData.pitch.documentName || "document"}">Download ${validatedData.pitch.documentName || "Document"}</a>`
          }
        </div>
      `
        : ""

  const heroSubtitle = validatedData.hero.useRichText
    ? sanitizeHtml(validatedData.hero.richTextContent || validatedData.hero.subtitle)
    : escapeHtml(validatedData.hero.subtitle)
  
  const pitchDescription = validatedData.pitch.useRichText
    ? sanitizeHtml(validatedData.pitch.richTextContent || validatedData.pitch.description)
    : escapeHtml(validatedData.pitch.description)

  const footerData = validatedData.footer || {
    copyrightText: "© {year} Precision AQ. All rights reserved.",
    ctaText: "Get in touch with Precision",
    ctaEmail: "hello@precisionaq.com",
    backgroundColor: "#111827",
    textColor: "#ffffff",
    ctaButtonColor: "#2563eb",
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'self';">
  <meta name="description" content="${escapeHtml(validatedData.hero.subtitle)}">
  <meta name="theme-color" content="${validatedData.customization.primaryColor}">
  <title>${escapeHtml(validatedData.hero.title)}</title>
  <link rel="icon" href="${validatedData.customization.logo || "/favicon.ico"}" type="image/x-icon">
  ${analyticsHTML}
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { 
      font-family: ${validatedData.customization.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      line-height: 1.6; 
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img { max-width: 100%; height: auto; display: block; }
    
    .logo-header { 
      background: white; 
      border-bottom: 1px solid #e5e7eb; 
      padding: 1rem 2rem; 
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo-header img { height: 48px; object-fit: contain; }
    
    .hero { 
      min-height: 600px; 
      background: ${validatedData.hero.backgroundImage ? `url('${validatedData.hero.backgroundImage}')` : validatedData.customization.primaryColor};
      background-size: ${validatedData.hero.backgroundFit || "cover"};
      background-position: ${validatedData.hero.backgroundPosition || "center"};
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      position: relative;
    }
    ${validatedData.hero.backgroundImage ? `.hero::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5); }` : ""}
    
    .hero-content { position: relative; z-index: 1; padding: 2rem; max-width: 800px; }
    .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1rem; font-weight: 700; }
    .hero p, .hero div { font-size: clamp(1rem, 3vw, 1.5rem); margin-bottom: 2rem; }
    .hero-video { 
      max-width: 600px; 
      margin: 2rem auto; 
      border-radius: 8px; 
      overflow: hidden;
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
    }
    .hero-video video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .btn {
      background: ${validatedData.customization.primaryColor};
      color: white;
      padding: 1rem 2.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover { 
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .section { padding: 5rem 2rem; }
    .section-title { font-size: clamp(2rem, 4vw, 2.5rem); text-align: center; margin-bottom: 1rem; font-weight: 700; color: ${validatedData.customization.primaryColor}; }
    .section-subtitle { text-align: center; color: #666; font-size: clamp(1rem, 2vw, 1.2rem); margin-bottom: 3rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .card { 
      background: white; 
      padding: 2rem; 
      border-radius: 8px; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { 
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }
    .card h3 { margin-bottom: 1rem; font-size: 1.5rem; color: ${validatedData.customization.primaryColor}; }
    .bg-gray { background: #f9fafb; }
    .team-member { text-align: center; }
    .team-member img { 
      width: 200px; 
      height: 200px; 
      border-radius: 50%; 
      margin: 0 auto 1rem; 
      object-fit: cover;
      border: 4px solid ${validatedData.customization.primaryColor};
      display: block;
    }
    .team-member-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 1rem;
    }
    .team-member-buttons a {
      padding: 0.5rem 1rem;
      border: 1px solid ${validatedData.customization.primaryColor};
      color: ${validatedData.customization.primaryColor};
      text-decoration: none;
      border-radius: 4px;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .team-member-buttons a:hover {
      background: ${validatedData.customization.primaryColor};
      color: white;
    }
    .case-study { 
      background: white; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      padding: 2rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .case-study:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }
    .case-study-icon { 
      width: 48px; 
      height: 48px; 
      margin-bottom: 1rem;
      object-fit: contain;
    }
    .case-study h3 { font-size: 1.8rem; margin-bottom: 1rem; color: ${validatedData.customization.primaryColor}; }
    .case-study .results { 
      color: ${validatedData.customization.primaryColor}; 
      font-weight: bold; 
      font-size: 1.2rem; 
      margin-top: 1rem; 
      margin-bottom: 1rem;
    }
    .faq-item { 
      background: white; 
      border: 1px solid #e5e7eb; 
      border-radius: 8px; 
      margin-bottom: 1rem; 
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .faq-item:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .faq-question { 
      padding: 1.5rem; 
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      font-weight: 600;
      color: ${validatedData.customization.primaryColor};
      transition: background 0.2s;
      user-select: none;
    }
    .faq-question:hover { background: #f9fafb; }
    .faq-answer { 
      padding: 0 1.5rem 1.5rem; 
      color: #666; 
      display: none;
      line-height: 1.7;
    }
    .faq-item.active .faq-answer { display: block; }
    .faq-icon { 
      transition: transform 0.2s; 
      font-size: 1.5rem;
    }
    .faq-item.active .faq-icon { transform: rotate(180deg); }
    .surprise-section { 
      background: #f3f4f6; 
      padding: 5rem 2rem; 
    }
    .surprise-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 3rem; 
      max-width: 1000px; 
      margin: 0 auto; 
      align-items: center; 
    }
    .surprise-image { max-width: 100%; border-radius: 8px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input { 
      width: 100%; 
      padding: 0.75rem; 
      border: 1px solid #d1d5db; 
      border-radius: 4px; 
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .form-group input:focus {
      outline: none;
      border-color: ${validatedData.customization.primaryColor};
    }
    .document-container { margin: 2rem 0; }
    .html-embed { margin: 2rem 0; }
    
    @media (max-width: 768px) {
      .surprise-grid { grid-template-columns: 1fr; }
      .hero h1 { font-size: 2rem; }
      .grid { grid-template-columns: 1fr; }
      .team-member img { width: 150px; height: 150px; }
      .section { padding: 3rem 1rem; }
    }
  </style>
</head>
<body>
  ${passwordProtectionHTML}
  
  ${
    validatedData.customization.logo
      ? `
  <div class="logo-header">
    <img src="${validatedData.customization.logo}" alt="Logo">
  </div>
  `
      : ""
  }

  ${
    validatedData.hero.visible
      ? `
  <div class="hero">
    <div class="hero-content">
      <h1>${escapeHtml(validatedData.hero.title)}</h1>
      ${validatedData.hero.useRichText ? `<div>${heroSubtitle}</div>` : `<p>${heroSubtitle}</p>`}
      ${validatedData.hero.videoUrl ? `<div class="hero-video"><video controls src="${validatedData.hero.videoUrl}"></video></div>` : ""}
      ${
        validatedData.hero.showCta !== false
          ? `<a href="${validateCtaLink(validatedData.hero.ctaLink)}" class="btn">${escapeHtml(validatedData.hero.ctaText)}</a>`
          : ""
      }
    </div>
  </div>
  `
      : ""
  }

  ${
    validatedData.pitch.visible
      ? `
  <div class="section bg-gray">
    <div class="container">
      <h2 class="section-title">${escapeHtml(validatedData.pitch.title)}</h2>
      ${validatedData.pitch.useRichText ? `<div class="section-subtitle">${pitchDescription}</div>` : `<p class="section-subtitle">${pitchDescription}</p>`}
      ${pitchContentHTML}
    </div>
  </div>
  `
      : ""
  }

  ${
    validatedData.team.visible && validatedData.team.members.length > 0
      ? `
  <div class="section">
    <div class="container">
      <h2 class="section-title">${escapeHtml(validatedData.team.title)}</h2>
      ${validatedData.team.subtitle ? `<p class="section-subtitle">${escapeHtml(validatedData.team.subtitle)}</p>` : ""}
      <div class="grid">
        ${validatedData.team.members
          .map(
            (m: TeamMember) => `
          <div class="team-member">
            <img src="${m.image}" alt="${escapeHtml(m.name)}" loading="lazy">
            <h3>${escapeHtml(m.name)}</h3>
            <p style="color: #666; margin-bottom: 0.5rem;">${escapeHtml(m.role)}</p>
            <p style="font-size: 0.875rem; color: #666;">${escapeHtml(m.bio)}</p>
            <div class="team-member-buttons">
              ${m.linkedin ? `<a href="${m.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ""}
              ${m.email ? `<a href="mailto:${m.email}">Email</a>` : ""}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </div>
  `
      : ""
  }

  ${
    validatedData.caseStudies.visible && validatedData.caseStudies.studies.length > 0
      ? `
  <div class="section bg-gray">
    <div class="container">
      <h2 class="section-title">${escapeHtml(validatedData.caseStudies.title)}</h2>
      ${validatedData.caseStudies.description ? `<p class="section-subtitle">${escapeHtml(validatedData.caseStudies.description)}</p>` : ""}
      ${validatedData.caseStudies.studies
        .map(
          (s: CaseStudy) => `
        <div class="case-study">
          ${s.icon ? `<img src="${s.icon}" alt="Icon" class="case-study-icon" loading="lazy">` : ""}
          <h3>${escapeHtml(s.title)}</h3>
          <p>${escapeHtml(s.description)}</p>
          <p class="results">${escapeHtml(s.results)}</p>
          ${
            s.documentUrl
              ? `<div style="text-align: center; margin-top: 1.5rem;"><a href="${s.documentUrl}" class="btn" download="${s.documentName || "case-study"}">${escapeHtml(s.buttonText || "Download Case Study")}</a></div>`
              : ""
          }
        </div>
      `,
        )
        .join("")}
    </div>
  </div>
  `
      : ""
  }

  ${
    validatedData.faq.visible && validatedData.faq.items.length > 0
      ? `
  <div class="section">
    <div class="container" style="max-width: 800px;">
      <h2 class="section-title">${escapeHtml(validatedData.faq.title)}</h2>
      ${validatedData.faq.subtitle ? `<p class="section-subtitle">${escapeHtml(validatedData.faq.subtitle)}</p>` : ""}
      ${validatedData.faq.items
        .map(
          (item: FaqItem, index: number) => `
        <div class="faq-item" id="faq-${index}">
          <div class="faq-question" onclick="toggleFaq(${index})">
            <span>${escapeHtml(item.question)}</span>
            <span class="faq-icon">▼</span>
          </div>
          <div class="faq-answer">
            <p>${escapeHtml(item.answer)}</p>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>
  <script>
    function toggleFaq(index) {
      const item = document.getElementById('faq-' + index);
      item.classList.toggle('active');
    }
  </script>
  `
      : ""
  }

  ${
    validatedData.surpriseDelight.visible
      ? `
  <div class="surprise-section">
    <div class="surprise-grid">
      <div>
        <img src="${validatedData.surpriseDelight.imageUrl}" alt="Surprise" class="surprise-image" loading="lazy">
      </div>
      <div>
        <h2 style="font-size: 2rem; margin-bottom: 1rem; color: ${validatedData.customization.primaryColor};">${escapeHtml(validatedData.surpriseDelight.title)}</h2>
        <p style="margin-bottom: 2rem; color: #666;">${escapeHtml(validatedData.surpriseDelight.subtitle)}</p>
        <h3 style="margin-bottom: 1rem;">${escapeHtml(validatedData.surpriseDelight.formTitle)}</h3>
        <form action="https://formspree.io/f/${validatedData.surpriseDelight.notifyEmail || "YOUR_FORM_ID"}" method="POST">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" required>
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required>
          </div>
          <button type="submit" class="btn">${escapeHtml(validatedData.surpriseDelight.ctaText)}</button>
        </form>
      </div>
    </div>
  </div>
  `
      : ""
  }

  <!-- Added footer section - always visible on exported sites -->
  <footer style="background:${footerData.backgroundColor}; color:${footerData.textColor}; padding:2rem 1.5rem; text-align:center; margin-top:3rem;">
    <div style="max-width:960px; margin:0 auto;">
      <p style="font-size:0.875rem; opacity:0.85; margin:0 0 1rem 0;">
        ${escapeHtml(footerData.copyrightText.replace("{year}", new Date().getFullYear().toString()))}
      </p>
      <a
        href="mailto:${footerData.ctaEmail}"
        style="display:inline-block; padding:0.75rem 1.5rem; border-radius:9999px; background:${footerData.ctaButtonColor}; color:#ffffff; text-decoration:none; font-weight:600; font-size:0.95rem;"
      >
        ${escapeHtml(footerData.ctaText)}
      </a>
    </div>
  </footer>
</body>
</html>`
}
