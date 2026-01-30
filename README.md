# FleetKeeper Website

Presentation website for the FleetKeeper mobile app - a fleet expiration management solution for transportation companies.

**Live URL:** https://fleetkeeper.app

## Structure

```
web-fleetkeeper/
├── index.html              # Homepage
├── download.html           # Download page with device detection
├── privacy-policy.html     # Privacy Policy (GDPR compliant)
├── terms-of-service.html   # Terms of Service
├── cookie-policy.html      # Cookie Policy
├── gdpr.html               # GDPR Information
├── 404.html                # 404 Error Page
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── main.js             # Main JavaScript
├── images/                 # Image assets (add your images here)
├── sitemap.xml             # XML Sitemap
├── robots.txt              # Robots.txt
├── llms.txt                # LLMs.txt for AI crawlers
├── site.webmanifest        # Web App Manifest
├── humans.txt              # Humans.txt
├── .htaccess               # Apache configuration
├── _headers                # Netlify/Cloudflare headers
├── _redirects              # Netlify/Cloudflare redirects
└── .well-known/
    └── security.txt        # Security contact information
```

## Features

- **Fully Responsive:** Mobile-first design that works on all devices
- **SEO Optimized:** 
  - Semantic HTML5
  - Structured data (Schema.org)
  - Open Graph and Twitter Cards
  - XML Sitemap
  - Robots.txt
  - LLMs.txt for AI crawlers
- **Performance:** 
  - Minimal dependencies
  - Optimized CSS
  - Lazy loading ready
  - Caching headers configured
- **Accessibility:** 
  - WCAG 2.1 compliant
  - Keyboard navigation
  - Screen reader friendly
  - Reduced motion support
- **Legal Compliance:**
  - GDPR compliant privacy policy
  - Cookie consent banner
  - Terms of Service
  - Cookie Policy

## Required Images

Add these images to the `/images/` directory:

- `favicon-16x16.png` - 16x16 favicon
- `favicon-32x32.png` - 32x32 favicon
- `apple-touch-icon.png` - 180x180 Apple touch icon
- `icon-192x192.png` - 192x192 PWA icon
- `icon-512x512.png` - 512x512 PWA icon
- `og-image.png` - 1200x630 Open Graph image
- `logo.png` - Logo image

## Deployment (Netlify)

1. Connect your repository to Netlify
2. Set publish directory to `/` (root)
3. No build command needed (static site)
4. Configuration is in `netlify.toml`

The site is configured for Netlify with:
- Security headers
- Caching rules
- Pretty URLs (no .html extension needed)

## Configuration

### App Store Links
Update the download page links in `download.html`:

```javascript
const STORE_URLS = {
    ios: 'https://apps.apple.com/app/fleetkeeper/id...', 
    android: 'https://play.google.com/store/apps/details?id=com.fleetkeeper.app'
};
```

### Analytics
To add Google Analytics, update `js/main.js` and add your tracking code in the `initAnalytics()` function.

### Contact Emails
Update contact emails throughout if different from:
- support@fleetkeeper.app
- privacy@fleetkeeper.app
- legal@fleetkeeper.app
- security@fleetkeeper.app
- dpo@fleetkeeper.app

## Multi-Language Support

The website supports 12 languages matching the mobile app:

| Code | Language |
|------|----------|
| en | English (default) |
| ro | Română |
| de | Deutsch |
| hu | Magyar |
| pl | Polski |
| fr | Français |
| es | Español |
| it | Italiano |
| pt | Português |
| nl | Nederlands |
| bg | Български |
| cs | Čeština |

**How it works:**
- Language selection via dropdown in navigation
- Translations stored in `/locales/*.json` files
- Auto-detects browser language on first visit
- Saves preference to localStorage
- Can be set via URL parameter: `?lang=ro`

**Adding a new language:**
1. Create a new JSON file in `/locales/` (copy from `en.json`)
2. Translate all strings
3. Add the language code to `SUPPORTED_LANGUAGES` in `main.js`
4. Add option to language selector in HTML

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Inter Font (Google Fonts)
- JSON-based i18n (no external dependencies)

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari
- Chrome for Android

## License

Proprietary - All rights reserved.
