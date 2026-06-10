// ROWAN'S PORTFOLIO - CORE JAVASCRIPT ENGINE

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
  const particleCount = Math.min(80, Math.floor((width * height) / 18000)); // Responsive count
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
      // Repel from mouse
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

      // Limit speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        this.vx = (this.vx / speed) * 1.5;
        this.vy = (this.vy / speed) * 1.5;
      }

      // Friction
      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;

      // Bounce/wrap borders
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

      // Draw connection to mouse
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
  // 4. SYSTEM ARCHITECTURE PLAYGROUND (SIMULATOR)
  // ----------------------------------------------------
  const simButtons = document.querySelectorAll(".sim-btn");
  const metricLatency = document.getElementById("metric-latency");
  const metricStatus = document.getElementById("metric-status");
  const metricCache = document.getElementById("metric-cache");
  const simTerminal = document.getElementById("sim-terminal");
  const diagramNodes = document.querySelectorAll(".node-wrapper");
  const lines = document.querySelectorAll(".connector-line");

  let simulationInterval = null;

  function clearActiveStates() {
    diagramNodes.forEach(node => {
      node.classList.remove("active", "active-purple");
    });
    lines.forEach(line => {
      line.classList.remove("active", "active-purple");
      line.style.display = "block";
    });
    
    // Hide signals
    const signals = document.querySelectorAll(".pulse-signal");
    signals.forEach(sig => {
      sig.style.display = "none";
      sig.style.animation = "none";
    });

    // Reset lines
    document.getElementById("path-alert-db").style.display = "none";
    document.getElementById("path-srv-ledger").style.display = "block";

    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
  }

  function logSim(text, type = "slate") {
    const time = new Date().toLocaleTimeString();
    const logLine = document.createElement("div");
    logLine.className = `terminal-log-line text-${type}-log`;
    logLine.innerHTML = `[${time}] ${text}`;
    simTerminal.appendChild(logLine);
    simTerminal.scrollTop = simTerminal.scrollHeight;
  }

  function animateSignal(signalId, pathId, duration, delay = 0, color = "#00F2FE") {
    const signal = document.getElementById(signalId);
    const path = document.getElementById(pathId);
    
    if (!signal || !path) return;

    setTimeout(() => {
      signal.setAttribute("fill", color);
      signal.style.display = "block";
      signal.style.offsetPath = `path('${path.getAttribute("d")}')`;
      signal.style.animation = `move-signal ${duration}ms forwards linear`;
    }, delay);
  }

  function runSimulation(flowType) {
    clearActiveStates();
    simTerminal.innerHTML = ""; // Clear logs
    
    logSim(`SYSTEM: Initiating flow simulation: ${flowType.toUpperCase()}`, "slate");
    metricStatus.textContent = "Processing";
    metricStatus.style.color = "var(--primary-color)";
    metricLatency.textContent = "...";
    metricCache.textContent = "...";

    if (flowType === "redemption") {
      // Step-by-step UI updates representing Points Redemption Flow
      
      // Active Nodes
      const activeNodes = ["app", "gateway", "service", "kafka", "vendor"];
      
      // Step 1: App to Gateway
      logSim("CLIENT: User requests reward partner list (Traveloka) in loyalty app", "slate");
      document.querySelector('[data-node="app"]').classList.add("active");
      document.getElementById("path-app-gw").classList.add("active");
      animateSignal("signal-pulse-1", "path-app-gw", 800, 0);

      setTimeout(() => {
        document.querySelector('[data-node="gateway"]').classList.add("active");
        logSim("GATEWAY: Authenticating request via OAuth 2.0 / JWT validation. Rate-limits: OK", "cyan");
        document.getElementById("path-gw-srv").classList.add("active");
        animateSignal("signal-pulse-1", "path-gw-srv", 800, 0);
      }, 800);

      setTimeout(() => {
        document.querySelector('[data-node="service"]').classList.add("active");
        logSim("SERVICE: Loyalty core logic validating user points balance...", "cyan");
        document.getElementById("path-srv-redis").classList.add("active-purple");
        document.querySelector('[data-node="redis"]').classList.add("active-purple");
        animateSignal("signal-pulse-2", "path-srv-redis", 600, 0, "#7F00FF");
      }, 1600);

      setTimeout(() => {
        logSim("CACHE: Redis Cache MISS. Querying relational DB (PostgreSQL HA)", "purple");
        document.getElementById("path-srv-ledger").classList.add("active");
        document.querySelector('[data-node="ledger"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-srv-ledger", 600, 0);
      }, 2200);

      setTimeout(() => {
        logSim("DB: Read replica balance validation success (balance: 34,200 points)", "emerald");
        logSim("SERVICE: Publishing point-deduct-pending message to event stream", "cyan");
        document.getElementById("path-srv-kafka").classList.add("active");
        document.querySelector('[data-node="kafka"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-srv-kafka", 800, 0);
      }, 2800);

      setTimeout(() => {
        logSim("QUEUE: Kafka broker routing topic 'redemption-events' to consumer worker", "purple");
        document.getElementById("path-kafka-vendor").classList.add("active");
        document.querySelector('[data-node="vendor"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-kafka-vendor", 800, 0);
      }, 3600);

      setTimeout(() => {
        logSim("EXTERNAL: Calling partner Traveloka API endpoint via secure TLS Webhook...", "amber");
        logSim("EXTERNAL: Booking successful. Partner responds with code 200 OK. Transaction ID: TRV-890", "emerald");
      }, 4400);

      setTimeout(() => {
        logSim("SUCCESS: Redemption complete! Point offset logged in financial general ledger.", "emerald");
        metricStatus.textContent = "Success";
        metricStatus.style.color = "var(--emerald-color)";
        metricLatency.textContent = "65 ms (Cache Warm)";
        metricCache.textContent = "Miss (Wrote Core)";
      }, 5000);

    } else if (flowType === "qris") {
      // QRIS Payment Point Offset Flow (Cache Hit scenario)
      
      document.querySelector('[data-node="app"]').classList.add("active");
      document.getElementById("path-app-gw").classList.add("active");
      animateSignal("signal-pulse-1", "path-app-gw", 800, 0);

      setTimeout(() => {
        document.querySelector('[data-node="gateway"]').classList.add("active");
        logSim("GATEWAY: Routing mobile QRIS transaction to Settlement processor", "cyan");
        document.getElementById("path-gw-srv").classList.add("active");
        animateSignal("signal-pulse-1", "path-gw-srv", 800, 0);
      }, 800);

      setTimeout(() => {
        document.querySelector('[data-node="service"]').classList.add("active");
        logSim("SERVICE: Fetching user profile classifications and loyalty points multipliers...", "cyan");
        document.getElementById("path-srv-redis").classList.add("active-purple");
        document.querySelector('[data-node="redis"]').classList.add("active-purple");
        animateSignal("signal-pulse-2", "path-srv-redis", 600, 0, "#7F00FF");
      }, 1600);

      setTimeout(() => {
        logSim("CACHE: Redis Cache HIT! Loaded profile details in 2ms. Skipping database query.", "emerald");
        logSim("SERVICE: Point offsetting formula calculated. Initiating General Ledger posting schema.", "cyan");
        document.getElementById("path-srv-ledger").classList.add("active");
        document.querySelector('[data-node="ledger"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-srv-ledger", 600, 0);
      }, 2200);

      setTimeout(() => {
        logSim("DB: Posting offset credit entry to GL ledger. Auto-settlement triggered.", "emerald");
      }, 2800);

      setTimeout(() => {
        logSim("SUCCESS: Point offset offsetted securely! Mobile client notified.", "emerald");
        metricStatus.textContent = "Success";
        metricStatus.style.color = "var(--emerald-color)";
        metricLatency.textContent = "8 ms (Realtime)";
        metricCache.textContent = "HIT (Redis)";
      }, 3400);

    } else if (flowType === "failover") {
      // High-Availability Database Failover Scenario
      
      logSim("MONITOR: Prometheus detects master database site failure (heartbeat packet loss)", "warn");
      document.querySelector('[data-node="ledger"]').classList.add("active-purple");
      document.getElementById("path-srv-ledger").classList.add("active-purple");
      
      setTimeout(() => {
        logSim("ALERT: Telemetry triggers Webhook alert to Monitoring team / Auto-failover controller", "warn");
        // Hide normal database line and draw dynamic alternative routing line
        document.getElementById("path-srv-ledger").style.display = "none";
        document.getElementById("path-alert-db").style.display = "block";
        document.getElementById("path-alert-db").classList.add("active");
        
        document.querySelector('[data-node="gateway"]').classList.add("active-purple");
        animateSignal("signal-pulse-2", "path-alert-db", 1000, 0, "#7F00FF");
      }, 1000);

      setTimeout(() => {
        logSim("FAILOVER: Unbinding router from primary site ➔ Binding client profile to Standby secondary database site", "purple");
        logSim("FAILOVER: Secondary site promoted to Primary Master. Syncing replication delta logs...", "purple");
      }, 2000);

      setTimeout(() => {
        logSim("SYNC: Replication integrity verified. Health checks passed.", "emerald");
        document.querySelector('[data-node="ledger"]').classList.remove("active-purple");
        document.querySelector('[data-node="ledger"]').classList.add("active");
        document.getElementById("path-alert-db").classList.remove("active-purple");
        document.getElementById("path-alert-db").classList.add("active");
        logSim("SYSTEM: Database failover recovery successful! Write capacity restored.", "emerald");
      }, 3000);

      setTimeout(() => {
        metricStatus.textContent = "Failover Ok";
        metricStatus.style.color = "var(--emerald-color)";
        metricLatency.textContent = "12 seconds (Slashed 60%)";
        metricCache.textContent = "Bypassed (Auto HA)";
      }, 3600);
    }
  }

  // Bind simulation buttons
  simButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle button states
      simButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const flow = btn.getAttribute("data-flow");
      runSimulation(flow);
    });
  });

  // Start default simulation on load
  runSimulation("redemption");

  // ----------------------------------------------------
  // 5. EXPERIENCE TIMELINE TABS
  // ----------------------------------------------------
  const tabButtons = document.querySelectorAll(".tab-btn");
  const expDetails = document.querySelectorAll(".exp-detail-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Switch active tab button
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Switch active content
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
      // Toggle active button
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const categories = card.getAttribute("data-categories").split(" ");
        
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.style.display = "flex";
          // Small delay for fade transition
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          // Wait for transition before hiding
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

  // Command database
  const commands = {
    help: () => `
Available Commands:
  <span class="term-highlight">about</span>       - Print summary about Rowan
  <span class="term-highlight">skills</span>      - Print technical skills and stacks
  <span class="term-highlight">experience</span>  - List professional experience
  <span class="term-highlight">projects</span>    - List featured github projects
  <span class="term-highlight">contact</span>     - View contact phone and email
  <span class="term-highlight">secrets</span>     - Run system analytics decrypted diagnostic
  <span class="term-highlight">clear</span>       - Clear the console output
    `,
    about: () => `
<span class="term-cyan">SYSTEM DEPLOYMENT ANALYSIS SUMMARY:</span>
  Rowan is a System Analyst at Bank OCBC Indonesia with over 2 years of experience.
  Expert in requirements gathering (BRDs/FRDs), API standardizations, microservices, 
  and database migration architectures.
  Graduated with Summa Cum Laude honors in Computer Science from Brawijaya University (GPA 3.91).
    `,
    skills: () => `
<span class="term-purple">SKILLS INVENTORY LOADED:</span>
  * Core Stacks  : Golang, PostgreSQL, Kafka, RabbitMQ, Swagger/OpenAPI
  * Front-Ends   : Svelte, JavaScript, CSS3, Streamlit
  * DevOps Tools : Docker, GitLab CI/CD, Git, Linux
  * Telemetry    : Prometheus, Grafana telemetry clusters
  * Frameworks   : BRDs/FRDs, Agile, Scrum sprint lifecycle, UAT schemas
    `,
    experience: () => `
<span class="term-cyan">PROFESSIONAL TIMELINE:</span>
  [1] <span class="term-highlight">System Analyst @ Bank OCBC Indonesia (Jun 2023 - Present)</span>
      - Represented ID market in a regional unified loyalty program replatform across SG, MY, HK, ID.
      - Integrated 30+ REST APIs routing 50k requests/hour.
      - Scaled Redis application caching layer, decreasing latency by 60% (300ms ➔ 50ms).
      - Promoted Database High Availability (HA) sync, cutting failover downtime by 50%.
      - Migrated telemetry server stacks from enterprise BTO to Prometheus saving licensing costs.
  [2] <span class="term-highlight">Backend Intern @ Bank OCBC Indonesia (Sep 2022 - May 2023)</span>
      - Coded high-concurrency simulators for deposit products using Golang.
    `,
    projects: () => `
<span class="term-cyan">FEATURED OPEN SOURCE REPOS:</span>
  * <span class="term-highlight">BacktesterApp</span> (Svelte) - Trading simulator dashboard.
  * <span class="term-highlight">TradePilot</span> (JavaScript) - Scraping engine & alerts manager.
  * <span class="term-highlight">ARIMA Forecasting WebApp</span> (Streamlit) - Epidemic trend visualizer.
  * <span class="term-highlight">Hypertension Stacked LSTM</span> (Python) - Medical ML forecasting model.
  * <span class="term-highlight">Food Delivery Simulator</span> (Java) - Concurrent queue allocator.
    `,
    contact: () => `
<span class="term-cyan">SECURE CONTACT CHANNELS:</span>
  * Email    : albertusrowan@gmail.com
  * Phone    : +62 821-1400-3078
  * LinkedIn : linkedin.com/in/albertus-rowan/
  * Location : Jakarta, Indonesia
    `,
    secrets: () => `
<span class="term-error">DECRYPTING DIAGNOSTIC PAYLOAD...</span>
  <span class="term-success">[SUCCESS] decryption keys loaded.</span>
  * Diagnostics: GPA checked: 3.91/4.00 verified.
  * Easter Egg: Rowan once successfully optimized a complex database transaction block 
    in bank core loyalty platform that avoided a major deadlock in production!
  * Did you know: Rowan represented the Indonesian market single-handedly during OCBC's 
    regional loyalty replatform sync!
    `
  };

  function processCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
    
    // Create new elements for history
    const commandLog = document.createElement("p");
    commandLog.innerHTML = `<span class="terminal-prompt">rowan@sys-core:~$</span> ${cmdText}`;
    terminalBody.insertBefore(commandLog, terminalInput.parentNode);

    if (cleanCmd === "") {
      return;
    }

    if (cleanCmd === "clear") {
      // Delete everything except welcome
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

  // Listen for enter key
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = terminalInput.value;
      processCommand(command);
      terminalInput.value = "";
    }
  });

  // Focus input when clicking terminal area
  terminalContainer.addEventListener("click", () => {
    terminalInput.focus();
  });
});
