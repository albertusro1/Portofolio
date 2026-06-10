// ROWAN'S PORTFOLIO - CORE JAVASCRIPT ENGINE (SYSTEMS ALIGNED)

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ----------------------------------------------------
  // 1. LIGHT/DARK THEME TOGGLE
  // ----------------------------------------------------
  const themeToggle = document.getElementById("theme-toggle");
  
  // Check local storage or system preferences
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const theme = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", theme);
  });

  // ----------------------------------------------------
  // 2. MOBILE MENU TOGGLE
  // ----------------------------------------------------
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  mobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    mobileToggle.classList.toggle("active");
    
    // Animate burger bars
    const bars = mobileToggle.querySelectorAll(".bar");
    if (mobileToggle.classList.contains("active")) {
      bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
    } else {
      bars[0].style.transform = "none";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "none";
    }
  });

  // Close mobile menu when nav link is clicked
  const navLinksList = document.querySelectorAll(".nav-item, .nav-item-terminal");
  navLinksList.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      mobileToggle.classList.remove("active");
      const bars = mobileToggle.querySelectorAll(".bar");
      bars.forEach(bar => bar.style.transform = "none");
      bars[1].style.opacity = "1";
    });
  });

  // ----------------------------------------------------
  // 3. CANVAS PARTICLE SYSTEM (API Nodes Connection)
  // ----------------------------------------------------
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(80, Math.floor((width * height) / 18000));
  const connectionDistance = 120;
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
    }

    update() {
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 0.08;
          this.vy += Math.sin(angle) * force * 0.08;
        }
      }

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        this.vx = (this.vx / speed) * 1.5;
        this.vy = (this.vy / speed) * 1.5;
      }

      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      if (this.x > width) { this.x = width; this.vx *= -1; }
      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      if (this.y > height) { this.y = height; this.vy *= -1; }
    }

    draw() {
      const isLight = document.body.classList.contains("light-mode");
      ctx.fillStyle = isLight ? "rgba(13, 148, 136, 0.4)" : "rgba(0, 242, 254, 0.4)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.body.classList.contains("light-mode");
    const lineColor = isLight ? "13, 148, 136" : "0, 242, 254";
    const lineAltColor = isLight ? "79, 70, 229" : "127, 0, 255";

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (connectionDistance - dist) / connectionDistance * 0.12;
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (mouse.radius - dist) / mouse.radius * 0.18;
          ctx.strokeStyle = `rgba(${lineAltColor}, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ----------------------------------------------------
  // 4. CASE STUDIES TAB SWITCHER
  // ----------------------------------------------------
  const starTabs = document.querySelectorAll(".star-tab");

  starTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const studyId = tab.getAttribute("data-study");
      const stepId = tab.getAttribute("data-step");

      // Deactivate all tabs for this specific study
      document.querySelectorAll(`.star-tab[data-study="${studyId}"]`).forEach(t => {
        t.classList.remove("active");
      });

      // Activate clicked tab
      tab.classList.add("active");

      // Hide all content panes for this study
      document.querySelectorAll(`[id^="${studyId}-"]`).forEach(pane => {
        pane.classList.remove("active");
      });

      // Show target content pane
      const targetPane = document.getElementById(`${studyId}-${stepId}`);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });

  // ----------------------------------------------------
  // 5. EXPERIENCE TIMELINE TABS
  // ----------------------------------------------------
  const tabButtons = document.querySelectorAll(".tab-btn");
  const expDetails = document.querySelectorAll(".exp-detail-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const expId = btn.getAttribute("data-exp");
      expDetails.forEach(detail => {
        detail.classList.remove("active");
        if (detail.getAttribute("id") === `exp-${expId}`) {
          detail.classList.add("active");
        }
      });
    });
  });

  // ----------------------------------------------------
  // 6. PROJECTS GRID FILTERING
  // ----------------------------------------------------
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const categories = card.getAttribute("data-categories").split(" ");
        
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // ----------------------------------------------------
  // 7. DEVELOPER CLI TERMINAL EMULATOR
  // ----------------------------------------------------
  const terminalBody = document.getElementById("terminal-body");
  const terminalInput = document.getElementById("terminal-input");
  const terminalContainer = document.getElementById("terminal-container");

  const commands = {
    help: () => `
Available Commands:
  <span class="term-highlight">about</span>       - Print professional profile summary
  <span class="term-highlight">skills</span>      - Print system analysis & technical skills matrix
  <span class="term-highlight">experience</span>  - List banking system analyst work history
  <span class="term-highlight">projects</span>    - List featured github projects
  <span class="term-highlight">contact</span>     - View contact phone, email, and social links
  <span class="term-highlight">secrets</span>     - Run decrypted core system diagnostic logs
  <span class="term-highlight">clear</span>       - Clear the console output
    `,
    about: () => `
<span class="term-cyan">SYSTEM ANALYST PROFILE LOADED:</span>
  Rowan is a System Analyst at Bank OCBC with 3+ years in corporate banking systems.
  Specializes in requirements engineering (BRD/FRD/SRS), UML diagramming, RESTful API
  specifications, and data model designs (ERDs).
  Bridged system requirements for regional unified platforms, collaborating with 14 engineers, 
  10+ external partners, and cross-border bank representatives.
  Academic: Bachelor of Computer Science, Brawijaya University (GPA 3.91, Summa Cum Laude).
    `,
    skills: () => `
<span class="term-purple">SYSTEM ANALYST COMPETENCY DATABASE:</span>
  * Specs & Analysis : BRD/FRD/SRS writing, requirements gathering, UAT execution
  * Modeling & Flow  : UML Sequence & Use Cases, BPMN activity mapping, database ERDs
  * Integrations     : RESTful microservices APIs, OpenAPI/Swagger specifications, ISO 8583 flows
  * Tech Stack       : Golang, Java, PostgreSQL, Redis caching, Kafka & RabbitMQ event topics
  * Observability    : Prometheus monitoring, Grafana dashboards, GitLab CI/CD, Docker
    `,
    experience: () => `
<span class="term-cyan">EXPERIENCE TIMELINE:</span>
  [1] <span class="term-highlight">System Analyst @ OCBC Indonesia (Jun 2023 - Present)</span>
      - Represented ID market as dedicated SA for regional loyalty replatform across 4 countries.
      - Governed requirements engineering, translating specs into 400+ user stories.
      - Designed specifications for 30+ RESTful APIs on enterprise gateway (50k+ requests/hour).
      - Integrated 15+ external partners and card switching flows (ISO 8583).
      - Slashed database read overhead by 30% via Redis application-layer caching.
      - Coordinated database HA failover specifications (slashing downtime by 50%).
      - Mentored trainee developer squads on system design specifications.
  [2] <span class="term-highlight">Backend Developer & QA (Trainee Program) @ OCBC Indonesia (Sep 2022 - May 2023)</span>
      - Built concurrent Golang simulators for deposit and savings products.
    `,
    projects: () => `
<span class="term-cyan">SELECTED GITHUB PROJECTS:</span>
  * <span class="term-highlight">BacktesterApp</span> (Svelte) - Trading backtester analytics panel.
  * <span class="term-highlight">TradePilot</span> (JavaScript) - Workers scheduler & trading dashboard.
  * <span class="term-highlight">ARIMA Forecasting WebApp</span> (Streamlit) - Epistemological data tracker.
  * <span class="term-highlight">Hypertension Stacked LSTM</span> (Python) - deep learning neural model.
  * <span class="term-highlight">Food Delivery Simulator</span> (Java) - Multithreading task allocator.
    `,
    contact: () => `
<span class="term-cyan">COMMUNICATION ENDPOINTS:</span>
  * Email    : albertusrowan@gmail.com
  * Phone    : +62 821-1400-3078
  * LinkedIn : linkedin.com/in/albertus-rowan/
  * Location : Jakarta, Indonesia (Open to Remote)
    `,
    secrets: () => `
<span class="term-error">DECRYPTING DIAGNOSTIC TELEMETRY LOGS...</span>
  <span class="term-success">[SUCCESS] decryption keys loaded.</span>
  * GPA verification: 3.91/4.00 Summa Cum Laude.
  * System scale: Engineered APIs handling 50,000+ requests per hour and 20,000+ redemptions/month.
  * Easter Egg: Rowan once successfully resolved a high-priority deadlock thread in a core 
    loyalty database cluster, protecting transaction flow for thousands of mobile card accounts!
    `
  };

  function processCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
    
    const commandLog = document.createElement("p");
    commandLog.innerHTML = `<span class="terminal-prompt">rowan@sa-core:~$</span> ${cmdText}`;
    terminalBody.insertBefore(commandLog, terminalInput.parentNode);

    if (cleanCmd === "") {
      return;
    }

    if (cleanCmd === "clear") {
      const welcome = terminalBody.querySelector(".terminal-welcome");
      terminalBody.innerHTML = "";
      terminalBody.appendChild(welcome);
      return;
    }

    const outputLog = document.createElement("p");
    
    if (commands[cleanCmd]) {
      outputLog.innerHTML = commands[cleanCmd]();
    } else {
      outputLog.innerHTML = `<span class="term-error">Command not found: "${cleanCmd}". Type "help" to view options.</span>`;
    }

    terminalBody.insertBefore(outputLog, terminalInput.parentNode);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = terminalInput.value;
      processCommand(command);
      terminalInput.value = "";
    }
  });

  terminalContainer.addEventListener("click", () => {
    terminalInput.focus();
  });

  // Make project cards clickable to open GitHub repo in a new tab
  const projectCardsList = document.querySelectorAll(".project-card");
  projectCardsList.forEach(card => {
    card.addEventListener("click", (e) => {
      // Don't trigger if clicked directly on an anchor link
      if (e.target.closest("a")) return;
      const repoLink = card.querySelector(".project-links a");
      if (repoLink) {
        window.open(repoLink.href, "_blank");
      }
    });
  });

  // Scroll to Top Button functionality
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // ----------------------------------------------------
  // 9. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ----------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .stagger-container");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger container child items
        if (entry.target.classList.contains("stagger-container")) {
          const items = entry.target.querySelectorAll(".stagger-item");
          items.forEach((item, idx) => {
            item.style.transitionDelay = `${idx * 0.12}s`;
            item.classList.add("revealed");
          });
        }
        
        // Single elements
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05, // Trigger early when 5% of element is in view
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
