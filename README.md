# Albertus Rowan - Systems Analyst Portfolio

[![Deploy static content to Pages](https://github.com/albertusro1/Portofolio/actions/workflows/static.yml/badge.svg)](https://github.com/albertusro1/Portofolio/actions/workflows/static.yml)

A premium, highly interactive, and visually stunning developer portfolio website for **Albertus Rowan**, System Analyst at Bank OCBC Indonesia.

Built with modern vanilla HTML, CSS, and JavaScript, this portfolio features a sleek Obsidian dark-theme design system, custom particles connectivity background, scroll-reveal staggered animations, a retro command-line console mockup, and a recruiter-friendly STAR case studies layout.

---

## 🚀 Key Features

*   **Premium Obsidian Aesthetics:** Sleek, high-contrast dark theme utilizing glassmorphism panels, glowing neon highlights (Cyan, Purple), and professional typography.
*   **Scroll-Reveal Animations:** Interactive scroll-linked reveal transitions and staggered grid item entrances powered by vanilla JavaScript `IntersectionObserver`.
*   **STAR Case Studies:** Clean, recruiter-oriented tabs (Situation, Task, Action, Result) outlining regional banking system migrations and database HA architectures.
*   **Developer CLI Terminal Console:** A functional retro terminal emulator running custom commands like `help`, `about`, `skills`, `experience`, `secrets`, and `clear`.
*   **Floating Navigation & Utility Widgets:** Includes smooth-scroll navigation links, light/dark theme toggle overrides, and a fixed scroll-to-top button.
*   **Automated CI/CD Pipeline:** Fully configured GitHub Actions workflow (`static.yml`) for automated static deployment to GitHub Pages on push.

---

## 🛠️ Technology Stack

*   **Core Logic:** Vanilla JavaScript (ES6+)
*   **Styling System:** Responsive CSS3 Custom Properties / Design Tokens
*   **Document Structure:** Semantic HTML5
*   **Icons Library:** Lucide Icons & Custom Inline Brand SVGs
*   **Deployment Pipeline:** GitHub Actions & GitHub Pages

---

## 💻 Local Development

Since this is a purely static website, you do not need to install complex dependencies or run servers to test changes.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/albertusro1/Portofolio.git
    cd Portofolio
    ```

2.  **Open Locally:**
    *   Directly double-click or open `index.html` in any web browser.
    *   *OR* spin up a lightweight Python HTTP server for accurate routing:
        ```bash
        python -m http.server 8000
        ```
        Then, navigate to `http://localhost:8000` in your browser.

---

## 📁 Repository Structure

```text
Portofolio/
├── .github/
│   └── workflows/
│       └── static.yml    # GitHub Pages deployment action
├── index.html            # Main markup page
├── styles.css            # Custom CSS tokens & animation rules
├── script.js             # Particle background, terminal, & scroll reveal JS
├── rowan_profile.jpg     # Profile picture asset
├── .gitignore            # Git exclusion rules
└── README.md             # Project documentation
```

---

## 📧 Contact Information

*   **Email:** [albertusrowan@gmail.com](mailto:albertusrowan@gmail.com)
*   **LinkedIn:** [linkedin.com/in/albertus-rowan/](https://linkedin.com/in/albertus-rowan/)
*   **GitHub:** [github.com/albertusro1](https://github.com/albertusro1)
*   **Location:** Jakarta, Indonesia
