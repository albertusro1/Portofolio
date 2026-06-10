// ROWAN'S PORTFOLIO - CORE JAVASCRIPT ENGINE (TPM & SYSTEMS ALIGNED)

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
    
    const signals = document.querySelectorAll(".pulse-signal");
    signals.forEach(sig => {
      sig.style.display = "none";
      sig.style.animation = "none";
    });

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
    simTerminal.innerHTML = "";
    
    logSim(`SYSTEM: Initiating technical program scenario: ${flowType.toUpperCase()}`, "slate");
    metricStatus.textContent = "Checking...";
    metricStatus.style.color = "var(--primary-color)";
    metricLatency.textContent = "...";
    metricCache.textContent = "...";

    if (flowType === "redemption") {
      const activeNodes = ["app", "gateway", "service", "kafka", "vendor"];
      
      logSim("CLIENT: Mobile Client sends partner redemption request. Vol: 20k/month limit check", "slate");
      document.querySelector('[data-node="app"]').classList.add("active");
      document.getElementById("path-app-gw").classList.add("active");
      animateSignal("signal-pulse-1", "path-app-gw", 800, 0);

      setTimeout(() => {
        document.querySelector('[data-node="gateway"]').classList.add("active");
        logSim("GATEWAY: Authenticating regional OAuth 2.0 API gateway headers. Validating token integrity", "cyan");
        document.getElementById("path-gw-srv").classList.add("active");
        animateSignal("signal-pulse-1", "path-gw-srv", 800, 0);
      }, 800);

      setTimeout(() => {
        document.querySelector('[data-node="service"]').classList.add("active");
        logSim("SERVICE: Loyalty service evaluating user account parameters & points offsets", "cyan");
        document.getElementById("path-srv-redis").classList.add("active-purple");
        document.querySelector('[data-node="redis"]').classList.add("active-purple");
        animateSignal("signal-pulse-2", "path-srv-redis", 600, 0, "#7F00FF");
      }, 1600);

      setTimeout(() => {
        logSim("CACHE: Redis Cache MISS. Loading account parameters from PostgreSQL replication pool", "purple");
        document.getElementById("path-srv-ledger").classList.add("active");
        document.querySelector('[data-node="ledger"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-srv-ledger", 600, 0);
      }, 2200);

      setTimeout(() => {
        logSim("DB: PostgreSQL read replicate returns user status: ACTIVE. Bal: 45,000 pts", "emerald");
        logSim("SERVICE: Publishing point-deduct-pending record to event stream", "cyan");
        document.getElementById("path-srv-kafka").classList.add("active");
        document.querySelector('[data-node="kafka"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-srv-kafka", 800, 0);
      }, 2800);

      setTimeout(() => {
        logSim("BROKER: Kafka broker routing topic 'redemption-events' to consumer worker", "purple");
        document.getElementById("path-kafka-vendor").classList.add("active");
        document.querySelector('[data-node="vendor"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-kafka-vendor", 800, 0);
      }, 3600);

      setTimeout(() => {
        logSim("EXTERNAL: Calling partner Traveloka API endpoint via secure TLS Webhook...", "amber");
        logSim("EXTERNAL: Traveloka API returns 200 OK. Redemption item booked. ID: TRV-890", "emerald");
      }, 4400);

      setTimeout(() => {
        logSim("SUCCESS: Redemption complete! Points updated. Ledger logs posted.", "emerald");
        metricStatus.textContent = "OJK Compliant";
        metricStatus.style.color = "var(--emerald-color)";
        metricLatency.textContent = "65 ms";
        metricCache.textContent = "Miss (Wrote DB)";
      }, 5000);

    } else if (flowType === "qris") {
      // QRIS Payment with ISO 8583-aligned switching flow (Cache Hit)
      
      logSim("CLIENT: User triggers QRIS payment in app, offsetting purchase with loyalty points", "slate");
      document.querySelector('[data-node="app"]').classList.add("active");
      document.getElementById("path-app-gw").classList.add("active");
      animateSignal("signal-pulse-1", "path-app-gw", 800, 0);

      setTimeout(() => {
        document.querySelector('[data-node="gateway"]').classList.add("active");
        logSim("SWITCH: Parsing ISO 8583 card message payload. Extracting transaction fields", "cyan");
        document.getElementById("path-gw-srv").classList.add("active");
        animateSignal("signal-pulse-1", "path-gw-srv", 800, 0);
      }, 800);

      setTimeout(() => {
        document.querySelector('[data-node="service"]').classList.add("active");
        logSim("SERVICE: Fetching user loyalty multipliers and caching headers...", "cyan");
        document.getElementById("path-srv-redis").classList.add("active-purple");
        document.querySelector('[data-node="redis"]').classList.add("active-purple");
        animateSignal("signal-pulse-2", "path-srv-redis", 600, 0, "#7F00FF");
      }, 1600);

      setTimeout(() => {
        logSim("CACHE: Redis Cache HIT! Latency reduced by 70%. Loaded profile details in 2ms.", "emerald");
        logSim("SERVICE: Points offset computed. Requesting ledger settlement post.", "cyan");
        document.getElementById("path-srv-ledger").classList.add("active");
        document.querySelector('[data-node="ledger"]').classList.add("active");
        animateSignal("signal-pulse-1", "path-srv-ledger", 600, 0);
      }, 2200);

      setTimeout(() => {
        logSim("DB: Crediting general ledger entry. Posting automatic financial settlement record.", "emerald");
      }, 2800);

      setTimeout(() => {
        logSim("SUCCESS: ISO 8583 response packet code 00 (Approved) returned to switch.", "emerald");
        metricStatus.textContent = "Approved (00)";
        metricStatus.style.color = "var(--emerald-color)";
        metricLatency.textContent = "8 ms";
        metricCache.textContent = "70% Overhead Cut";
      }, 3400);

    } else if (flowType === "failover") {
      // OJK Data Residency active-active failover
      
      logSim("MONITOR: Prometheus alarms - Primary master database site disconnected (Network partition)", "warn");
      document.querySelector('[data-node="ledger"]').classList.add("active-purple");
      document.getElementById("path-srv-ledger").classList.add("active-purple");
      
      setTimeout(() => {
        logSim("COMPLIANCE: OJK data-residency compliance trigger active. Commencing auto failover.", "warn");
        
        document.getElementById("path-srv-ledger").style.display = "none";
        document.getElementById("path-alert-db").style.display = "block";
        document.getElementById("path-alert-db").classList.add("active");
        
        document.querySelector('[data-node="gateway"]').classList.add("active-purple");
        animateSignal("signal-pulse-2", "path-alert-db", 1000, 0, "#7F00FF");
      }, 1000);

      setTimeout(() => {
        logSim("FAILOVER: Redirecting transaction traffic to Secondary standby replica database site...", "purple");
        logSim("FAILOVER: Secondary database site promoted to Primary Master.", "purple");
      }, 2000);

      setTimeout(() => {
        logSim("SYNC: Replication logs synced. Active-Active DB integrity verified.", "emerald");
        document.querySelector('[data-node="ledger"]').classList.remove("active-purple");
        document.querySelector('[data-node="ledger"]').classList.add("active");
        document.getElementById("path-alert-db").classList.remove("active-purple");
        document.getElementById("path-alert-db").classList.add("active");
        logSim("SYSTEM: Database failover recovery successful! Write capacity fully restored.", "emerald");
      }, 3000);

      setTimeout(() => {
        metricStatus.textContent = "HA Active";
        metricStatus.style.color = "var(--emerald-color)";
        metricLatency.textContent = "12 seconds";
        metricCache.textContent = "Failover -50% DT";
      }, 3600);
    }
  }

  // Bind simulation buttons
  simButtons.forEach(btn => {
    btn.addEventListener("click", () => {
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
  <span class="term-highlight">skills</span>      - Print program & technical skills matrix
  <span class="term-highlight">experience</span>  - List program delivery & analyst history
  <span class="term-highlight">projects</span>    - List featured github projects
  <span class="term-highlight">contact</span>     - View contact phone, email, and social links
  <span class="term-highlight">secrets</span>     - Run decrypted core system diagnostic logs
  <span class="term-highlight">clear</span>       - Clear the console output
    `,
    about: () => `
<span class="term-cyan">TECHNICAL PROGRAM PROFILE LOADED:</span>
  Rowan is a System Analyst & Technical Program Lead at Bank OCBC with 3+ years in banking.
  Specializes in payments, loyalty systems, and large-scale cross-border program execution.
  Led regional unified platform migrations coordinating 14 engineers, 10+ vendors, 
  and 4 country representatives.
  Academic: Bachelor of Computer Science, Brawijaya University (GPA 3.91, Summa Cum Laude).
    `,
    skills: () => `
<span class="term-purple">TPM COMPETENCY DATABASE:</span>
  * Program delivery : Cross-border coordination, vendor management, product roadmap ownership
  * Modeling & Specs : BRDs, FSDs, UML sequence modeling, BPMN flows, use cases
  * Architecture     : Microservices, Event-Driven MQ, ISO 8583 messaging, OJK compliance
  * Tech Stack       : Golang, Java, Kotlin, PostgreSQL, Redis, Kafka, RabbitMQ, Git
  * Observability    : Prometheus monitoring, Grafana dashboards, GitLab CI/CD
    `,
    experience: () => `
<span class="term-cyan">EXPERIENCE TIMELINE:</span>
  [1] <span class="term-highlight">System Analyst / Technical Program Lead @ OCBC Indonesia (Jun 2023 - Present)</span>
      - Governed regional loyalty program migration across SG, MY, HK, ID.
      - Coordinated 14 engineers, 10+ external vendors, and multi-country stakeholders.
      - Integrated 15+ external API partners with ISO 8583 switching logic.
      - Decreased database overhead by 70%+ via application caching layers.
      - Led database HA migration (slashing failover downtime by 50%).
      - Mentored intern squad as acting Product Owner.
  [2] <span class="term-highlight">Backend Developer & QA (Trainee Program) @ OCBC Indonesia (Sep 2022 - May 2023)</span>
      - Built concurrent Golang simulators for savings and deposit calculations.
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
  * Achievements: Handled 50,000+ API requests per hour and 20,000+ partner transactions/month.
  * Easter Egg: Rowan once successfully resolved a high-priority deadlock thread in a core 
    loyalty database cluster, protecting transaction flow for thousands of mobile card accounts!
    `
  };

  function processCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
    
    const commandLog = document.createElement("p");
    commandLog.innerHTML = `<span class="terminal-prompt">rowan@tpm-core:~$</span> ${cmdText}`;
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
});
