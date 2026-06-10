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
  // 4. ENTERPRISE PROGRAM EXPLORER
  // ----------------------------------------------------
  const explorerTabs = document.querySelectorAll(".explorer-tab");
  const progName = document.getElementById("prog-name");
  const progDesc = document.getElementById("prog-desc");
  const progTimeline = document.getElementById("prog-timeline");
  const progTeam = document.getElementById("prog-team");
  const progGov = document.getElementById("prog-gov");
  const progCompliance = document.getElementById("prog-compliance");
  const roadmapPct = document.getElementById("roadmap-pct");
  const roadmapBar = document.getElementById("roadmap-bar");
  const featuresList = document.getElementById("features-list");
  
  const btnPlayFlow = document.getElementById("btn-play-flow");
  const stepBadge = document.getElementById("step-badge");
  const stepTitle = document.getElementById("step-title");
  const stepDesc = document.getElementById("step-desc");

  // Dynamic nodes elements
  const nodeWrappers = {
    node1: document.querySelector('[data-node="node1"]'),
    node2: document.querySelector('[data-node="node2"]'),
    node3: document.querySelector('[data-node="node3"]'),
    node4: document.querySelector('[data-node="node4"]'),
    node5: document.querySelector('[data-node="node5"]'),
    node6: document.querySelector('[data-node="node6"]')
  };

  const nodeIcons = {
    node1: document.getElementById("node1-icon"),
    node2: document.getElementById("node2-icon"),
    node3: document.getElementById("node3-icon"),
    node4: document.getElementById("node4-icon"),
    node5: document.getElementById("node5-icon"),
    node6: document.getElementById("node6-icon")
  };

  const nodeLabels = {
    node1: document.getElementById("node1-label"),
    node2: document.getElementById("node2-label"),
    node3: document.getElementById("node3-label"),
    node4: document.getElementById("node4-label"),
    node5: document.getElementById("node5-label"),
    node6: document.getElementById("node6-label")
  };

  const connectorLines = {
    line12: document.getElementById("path-1-2"),
    line23: document.getElementById("path-2-3"),
    line24: document.getElementById("path-2-4"),
    line25: document.getElementById("path-2-5"),
    line56: document.getElementById("path-5-6")
  };

  // Projects Program Database
  const projectsData = {
    replatform: {
      name: "Regional Reward System Replatform",
      desc: "Migrating core loyalty reward services to a unified multi-country architecture (Singapore, Malaysia, Hong Kong, Indonesia) under strict OJK data-residency compliance.",
      timeline: "Aug 2025 - Nov 2025",
      team: "14 Engineers (4 FE, 6 BE, 4 QA)",
      gov: "10+ Vendors, 4 Country Reps",
      compliance: "OJK Data Residency",
      pct: "100%",
      features: [
        "Partner redemptions integration (TADA, Dinomarket, Blibli, Traveloka)",
        "Digital wallet top-ups (OVO, IRIS Gopay/Midtrans)",
        "Real-time QRIS point offsets & General Ledger automated postings",
        "Secure OAuth 2.0 / JWT rate-limited API Gateway rules"
      ],
      nodes: [
        { label: "Client App", icon: "smartphone" },
        { label: "API Gateway", icon: "shield-check" },
        { label: "Redis Cache", icon: "layers" },
        { label: "Loyalty Core", icon: "server" },
        { label: "Kafka Broker", icon: "message-square" },
        { label: "Partner APIs", icon: "external-link" }
      ],
      steps: [
        { title: "Client Initiates Redemption", desc: "User requests product redemption in the mobile loyalty app. Traffic: 20k/month." },
        { title: "API Gateway Authentication", desc: "Gateway inspects regional OAuth 2.0 signatures and switches via ISO 8583-aligned paths." },
        { title: "Core Validation & Cache Lookup", desc: "Loyalty Core queries Redis. Cache HIT cuts database read latency by 70%." },
        { title: "Publish Event to Kafka", desc: "Core publishes point-deducted-pending event to topic 'redemption-events' for asynchronously buffering." },
        { title: "Webhook Partner API Callback", desc: "Replatform worker makes secure REST call to Traveloka API. Traveloka logs booking and returns 200 OK." }
      ],
      paths: [
        { line: "line12", pulse: "signal-pulse-1", duration: 800, delay: 0, node: "node1", color: "#00F2FE" },
        { line: "line23", pulse: "signal-pulse-2", duration: 600, delay: 800, node: "node2", color: "#7F00FF" },
        { line: "line24", pulse: "signal-pulse-1", duration: 600, delay: 1400, node: "node3", color: "#00F2FE" },
        { line: "line25", pulse: "signal-pulse-1", duration: 800, delay: 2000, node: "node4", color: "#00F2FE" },
        { line: "line56", pulse: "signal-pulse-1", duration: 800, delay: 2800, node: "node5", color: "#00F2FE" }
      ]
    },
    access: {
      name: "Internal Access Management Tooling",
      desc: "Launched an automated compliance tool for managing, monitoring, and auto-expiring employee production access requests dynamically.",
      timeline: "Mar 2024 - Jul 2024",
      team: "5 Engineers (2 BE, 2 QA, 1 DevOps)",
      gov: "SecOps & Infra Teams",
      compliance: "Internal Audit Rules",
      pct: "100%",
      features: [
        "Self-service access request dashboard",
        "Company core router firewall integration",
        "Profile-group network classification sync",
        "Automated grant/revert access triggers"
      ],
      nodes: [
        { label: "Employee App", icon: "user-check" },
        { label: "Approvals Engine", icon: "check-square" },
        { label: "Active Directory", icon: "key" },
        { label: "Core Router", icon: "git-commit" },
        { label: "Firewall Node", icon: "lock" },
        { label: "Production Net", icon: "server" }
      ],
      steps: [
        { title: "Employee Files Access Request", desc: "Request details target profile group and specific virtual environment." },
        { title: "Approvals Engine State Evaluation", desc: "Manager reviews request. Auto-approves if standard role matches, otherwise triggers escalations." },
        { title: "Active Directory Group Sync", desc: "Engine syncs Transient profile-group membership updates to AD clusters." },
        { title: "Router ACL Re-generation", desc: "Access controller signals router to regenerate Access Control Lists (ACLs) dynamically." },
        { title: "Production Net Unlocked", desc: "Firewall rules updated to allow client network block. Expiration timer scheduled." }
      ],
      paths: [
        { line: "line12", pulse: "signal-pulse-1", duration: 800, delay: 0, node: "node1", color: "#00F2FE" },
        { line: "line23", pulse: "signal-pulse-2", duration: 600, delay: 800, node: "node2", color: "#7F00FF" },
        { line: "line24", pulse: "signal-pulse-1", duration: 600, delay: 1400, node: "node3", color: "#00F2FE" },
        { line: "line25", pulse: "signal-pulse-1", duration: 800, delay: 2000, node: "node4", color: "#00F2FE" },
        { line: "line56", pulse: "signal-pulse-1", duration: 800, delay: 2800, node: "node5", color: "#00F2FE" }
      ]
    },
    telemetry: {
      name: "HA Database & Telemetry Migration",
      desc: "Migrated database clusters from traditional Active-Passive configurations to High Availability (HA) Active-Active. Consolidated observability via Prometheus/Grafana.",
      timeline: "Jan 2025 - May 2025",
      team: "8 Engineers (4 DevOps, 3 DBAs, 1 PM)",
      gov: "1,000+ Enterprise Servers",
      compliance: "OJK Resiliency Policy",
      pct: "100%",
      features: [
        "1,000+ server Prometheus exporter standardized",
        "Grafana observability & shift schedulers",
        "Active-Active Database cross-site replication",
        "Auto failover downtime cut from 30s to 12s (-50%)"
      ],
      nodes: [
        { label: "1000+ Servers", icon: "cpu" },
        { label: "Prometheus", icon: "search" },
        { label: "Grafana Alert", icon: "bell" },
        { label: "DB Active-Active", icon: "database" },
        { label: "Standby replica", icon: "refresh-cw" },
        { label: "Ops Telemetry", icon: "monitor" }
      ],
      steps: [
        { title: "Telemetry Collection", desc: "Prometheus collects performance indicators from virtualised cores. Telemetry standardized in Grafana." },
        { title: "Incident Triggered", desc: "Grafana triggers alert payload on primary database heartbeat loss." },
        { title: "Failover Engine Activated", desc: "Replication delta synced. Stands up replica databases as master nodes." },
        { title: "Traffic Switch Re-routing", desc: "Gateway changes DB connection pool pointers. Failover completes in 12s (slashed by 50%)." },
        { title: "Observability Restored", desc: "Operations console dashboard reports system restoration. Write capacity fully operational." }
      ],
      paths: [
        { line: "line12", pulse: "signal-pulse-1", duration: 800, delay: 0, node: "node1", color: "#00F2FE" },
        { line: "line23", pulse: "signal-pulse-2", duration: 600, delay: 800, node: "node2", color: "#7F00FF" },
        { line: "line24", pulse: "signal-pulse-1", duration: 600, delay: 1400, node: "node3", color: "#00F2FE" },
        { line: "line25", pulse: "signal-pulse-1", duration: 800, delay: 2000, node: "node4", color: "#00F2FE" },
        { line: "line56", pulse: "signal-pulse-1", duration: 800, delay: 2800, node: "node5", color: "#00F2FE" }
      ]
    }
  };

  let activeProject = "replatform";
  let activeTimeouts = [];

  function loadProjectBlueprint(projectId) {
    activeProject = projectId;
    const project = projectsData[projectId];
    if (!project) return;

    // Reset timeouts
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];

    // Reset styles
    resetFlowGraphics();

    // Populate stats and descriptions
    progName.textContent = project.name;
    progDesc.textContent = project.desc;
    progTimeline.textContent = project.timeline;
    progTeam.textContent = project.team;
    progGov.textContent = project.gov;
    progCompliance.textContent = project.compliance;
    roadmapPct.textContent = project.pct;
    roadmapBar.style.width = project.pct;

    // Populate key features list
    featuresList.innerHTML = "";
    project.features.forEach(feat => {
      const li = document.createElement("li");
      li.textContent = feat;
      featuresList.appendChild(li);
    });

    // Populate nodes labels & icons
    project.nodes.forEach((node, index) => {
      const nodeKey = `node${index + 1}`;
      nodeLabels[nodeKey].textContent = node.label;
      nodeIcons[nodeKey].innerHTML = `<i data-lucide="${node.icon}"></i>`;
    });

    // Re-trigger Lucide icons in updated HTML nodes
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Reset step box
    stepBadge.textContent = "IDLE";
    stepBadge.classList.remove("active");
    stepTitle.textContent = "Blueprints Explorer Active";
    stepDesc.textContent = "Click 'Play Sequence Flow' to trace UML integrations, or click on nodes to review requirements.";
  }

  function resetFlowGraphics() {
    Object.values(nodeWrappers).forEach(n => n.classList.remove("active", "active-purple"));
    Object.values(connectorLines).forEach(l => {
      l.classList.remove("active", "active-purple");
    });
    const signals = document.querySelectorAll(".pulse-signal");
    signals.forEach(sig => {
      sig.style.display = "none";
      sig.style.animation = "none";
    });
  }

  function playSequenceFlow() {
    resetFlowGraphics();
    const project = projectsData[activeProject];
    if (!project) return;

    stepBadge.classList.add("active");

    // Sequence trigger timelines
    project.paths.forEach((pathObj, stepIndex) => {
      // Step timeout
      const t1 = setTimeout(() => {
        // Highlight active line
        const isPurple = pathObj.color === "#7F00FF";
        const cssClass = isPurple ? "active-purple" : "active";
        connectorLines[pathObj.line].classList.add(cssClass);
        
        // Highlight active node
        const nodeWrapperCss = isPurple ? "active-purple" : "active";
        nodeWrappers[pathObj.node].classList.add(nodeWrapperCss);

        // Update step box details
        stepBadge.textContent = `STEP ${stepIndex + 1}`;
        stepTitle.textContent = project.steps[stepIndex].title;
        stepDesc.textContent = project.steps[stepIndex].desc;

        // Animate pulse
        const signal = document.getElementById(pathObj.pulse);
        const path = connectorLines[pathObj.line];
        if (signal && path) {
          signal.setAttribute("fill", pathObj.color);
          signal.style.display = "block";
          signal.style.offsetPath = `path('${path.getAttribute("d")}')`;
          signal.style.animation = `move-signal ${pathObj.duration}ms forwards linear`;
        }
      }, pathObj.delay);

      activeTimeouts.push(t1);
    });

    // Final Success Callback step timeout
    const finalDelay = project.paths[project.paths.length - 1].delay + 1000;
    const tFinal = setTimeout(() => {
      // Highlight final node
      nodeWrappers["node6"].classList.add("active");
      stepBadge.textContent = "SUCCESS";
      stepTitle.textContent = "Sequence Completed";
      stepDesc.textContent = "All integration checkpoints verified. Target system transactions committed.";
    }, finalDelay);
    
    activeTimeouts.push(tFinal);
  }

  // Bind tabs clicks
  explorerTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      explorerTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const projectId = tab.getAttribute("data-project");
      loadProjectBlueprint(projectId);
    });
  });

  // Bind play button
  btnPlayFlow.addEventListener("click", playSequenceFlow);

  // Bind Node clicks to show specific requirements
  Object.keys(nodeWrappers).forEach((nodeKey, index) => {
    nodeWrappers[nodeKey].addEventListener("click", () => {
      const project = projectsData[activeProject];
      if (!project) return;

      const nodeData = project.nodes[index];
      let reqText = "";
      
      // Customize requirements text dynamically for a realistic spec view
      if (nodeKey === "node1") {
        reqText = `Client Interface requirements: Strict rate-limiting on user retries, encrypted offline SQLite telemetry storage sync.`;
      } else if (nodeKey === "node2") {
        reqText = `Gateway specs: OAuth 2.0 JWT parsing, CORS validation policy, network router ACL translation.`;
      } else if (nodeKey === "node3") {
        reqText = `Caching policy: Redis clustered database. Target TTL: 12 hours. Expected hit latency: <3ms.`;
      } else if (nodeKey === "node4") {
        reqText = `Ledger compliance: ACID transactional safety, double-entry general ledger schemas, OJK compliance sync.`;
      } else if (nodeKey === "node5") {
        reqText = `Queue broker: Kafka consumer configuration. Topic partition: 3 partitions for regional replication.`;
      } else if (nodeKey === "node6") {
        reqText = `Partner connectivity: HTTPS TLS 1.3 webhook endpoints, mutual authentication keys, switching fallbacks.`;
      }

      stepBadge.classList.add("active");
      stepBadge.textContent = "SPEC";
      stepTitle.textContent = `${nodeData.label} Technical Constraint`;
      stepDesc.textContent = reqText;
    });
  });

  // Load default blueprint
  loadProjectBlueprint("replatform");

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
