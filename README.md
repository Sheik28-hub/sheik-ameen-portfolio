# Sheik Ameen — Professional 3D Portfolio
### Finance × Analytics
> **"Transforming Financial Data into Strategic Decisions."**

A premium, interactive, 3D personal portfolio presenting professional experience across **Financial Analysis, Investment Research, Business Analytics, and Business Intelligence**.

---

## 🌟 Visual Identity & Design System
- **Theme:** Dark Futuristic · Premium Financial Technology Aesthetics
- **Color Palette:**
  - Background Primary: `#070A12`
  - Background Secondary: `#101624`
  - Card Background: `#121B2B`
  - Primary Accent: `#00D4FF` (Electric Cyan)
  - Secondary Accent: `#6366F1` (Indigo Glow)
  - Typography Primary: `#F8FAFC`
  - Typography Secondary: `#94A3B8`
  - Borders: `#263449`
- **Typography:**
  - Headings: `Space Grotesk`
  - Body: `Inter`
  - Metrics / Mono: `JetBrains Mono`

---

## 🛠️ Technology Stack
- **Bundler & Dev Server:** Vite 5
- **3D Graphics:** Three.js (Interactive particles, floating wireframe geometries, parallax depth)
- **Animations:** Custom CSS3 Hardware-Accelerated Keyframes & Transitions, GSAP ready
- **Typography & Icons:** Google Fonts (Space Grotesk, Inter, JetBrains Mono), custom SVG icons

---

## 📁 Project Structure
```
sheik-ameen-portfolio/
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   └── sheik-ameen.jpg (Original photograph)
│   │   ├── projects/
│   │   │   ├── credit-risk.svg
│   │   │   ├── financial-model.svg
│   │   │   ├── dcf-valuation.svg
│   │   │   └── powerbi-dashboard.svg
│   │   ├── certificates/
│   │   │   ├── tableau.svg
│   │   │   ├── powerbi.svg
│   │   │   ├── sql.svg
│   │   │   ├── financial-modelling.svg
│   │   │   ├── ml.svg
│   │   │   └── ga4.svg
│   │   ├── resume/
│   │   │   └── Sheik_Ameen_Resume.pdf
│   │   └── branding/
│   │       └── og-image.svg
│   ├── favicon.svg
│   └── og-image.svg
│
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Experience.js
│   │   ├── Projects.js
│   │   ├── Skills.js
│   │   ├── Education.js
│   │   ├── Certifications.js
│   │   ├── Contact.js
│   │   └── Footer.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── animations.css
│   │   └── responsive.css
│   │
│   ├── three/
│   │   └── scene.js
│   │
│   ├── utils/
│   │   └── animations.js
│   │
│   └── main.js
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Generates optimized, production-ready static assets in the `dist/` directory.

### 4. Deploying to Vercel
1. Push repository to GitHub (`sheik-ameen-portfolio`).
2. Import project in Vercel.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**.

---

## 📄 License & Attribution
Designed & Developed for **Sheik Ameen** — All rights reserved © 2026.
