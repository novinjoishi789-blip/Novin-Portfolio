export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  client: string;
  role: string;
  description: string;
  longDescription: string;
  highlights: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  accentColor: string;
  metrics: { label: string; value: string }[];
  architectureNotes: string;
}

export interface TechNode {
  id: string;
  name: string;
  category: "frontend" | "graphics" | "backend" | "systems";
  level: number; // 1-100
  connections: string[];
  description: string;
  projectsUsedIn: string[];
}

export interface Experiment {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  tech: string[];
  shaderType: "particles" | "fluid" | "raymarching" | "mesh-distortion";
}

export const PERSONAL_INFO = {
  name: "NOVIN JOISHI",
  title: "CREATIVE DEVELOPER",
  secondaryPositioning: "Full-Stack Developer · Interactive Experiences · Digital Systems",
  tagline: "I build digital experiences, interfaces and systems where engineering meets design.",
  location: "India // Remote Worldwide",
  availability: "AVAILABLE FOR SELECT CONTRACTS & ROLES",
  email: "novinjoishi789@gmail.com",
  github: "https://github.com/novinjoishi",
  linkedin: "https://linkedin.com/in/novinjoishi",
  instagram: "https://instagram.com/novinjoishi",
  bio: [
    "I operate at the convergence of software engineering, interaction design, and real-time computer graphics.",
    "Rather than treating engineering and aesthetics as separate disciplines, I design systems from the ground up where high-performance code drives immersive visual narrative.",
    "From low-level data structures and robust distributed backends to custom GLSL shaders and smooth 60fps microinteractions, every layer is crafted with extreme precision."
  ],
  stats: [
    { label: "Production Deployments", value: "24+" },
    { label: "WebGL & 3D Systems", value: "18+" },
    { label: "Code Craft & Rigor", value: "100%" },
    { label: "Frame Budget", value: "16.6ms" }
  ]
};

export const PROJECTS: Project[] = [
  {
    id: "np-fast-food",
    number: "01",
    title: "NP FAST FOOD",
    subtitle: "High-throughput restaurant ordering & immersive digital storefront",
    year: "2024",
    category: "Full-Stack Web App · E-Commerce",
    client: "NP Hospitality Group",
    role: "Lead Full-Stack & Interaction Architect",
    description: "A frictionless, high-throughput food ordering ecosystem featuring a real-time culinary customizer, dynamic cart orchestration, and an ultra-fast checkout pipeline.",
    longDescription: "NP Fast Food was engineered to bridge physical dining speed with a fluid, digital-first ordering journey. Built with Next.js App Router and PostgreSQL, it features an interactive 3D burger/meal configurator, sub-second item caching, real-time kitchen display sync via WebSockets, and a streamlined payment flow that reduced order drop-off by 38%.",
    highlights: [
      "Sub-50ms optimistic UI updates for instant cart manipulation",
      "Interactive 3D real-time meal customizer with dynamic price calculation",
      "Automated kitchen ticket dispatching system powered by WebSockets",
      "PWA offline resilience for unstable mobile network connectivity"
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Three.js", "WebSockets", "Stripe API"],
    liveUrl: "https://npfastfood.co.in",
    githubUrl: "https://github.com/novinjoishi/np-fast-food",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    accentColor: "#F59E0B",
    metrics: [
      { label: "Lighthouse Performance", value: "99/100" },
      { label: "Order Conversion Surge", value: "+38%" },
      { label: "Average Checkout Time", value: "18.4s" }
    ],
    architectureNotes: "Server components for zero-JS initial payload; edge middleware for geo-distributed menu pricing; Redis caching layer for menu inventory validation under burst traffic."
  },
  {
    id: "haflong",
    number: "02",
    title: "HAFLONG",
    subtitle: "Cinematic eco-tourism and hill-station travel booking engine",
    year: "2024",
    category: "Travel & Hospitality · WebGL Exploration",
    client: "Assam Tourism & Cultural Initiative",
    role: "Creative Technologist & UI Engineer",
    description: "An evocative digital gateway to Haflong — the enchanted hill station of Assam. Combines topographic 3D maps, immersive spatial audio, and an integrated reservation engine.",
    longDescription: "Haflong transforms traditional travel booking into an atmospheric visual voyage. Visitors explore 3D elevation terrain maps of North Cachar hills, preview hiking trails with interactive elevation profiles, and book boutique homestays with real-time room availability and weather integration.",
    highlights: [
      "Custom 3D heightmap terrain renderer in Three.js with atmospheric fog",
      "Spatial audio engine reproducing ambient mountain weather and bird calls",
      "Interactive trail guide with interactive waypoints and GPS coordinate exports",
      "Multi-currency homestay reservation and payment gateway"
    ],
    technologies: ["Three.js", "WebGL", "GLSL Shaders", "React", "TypeScript", "Next.js", "Tailwind CSS", "PostgreSQL", "Web Audio API"],
    liveUrl: "https://haflong.netlify.app",
    githubUrl: "https://github.com/novinjoishi/haflong-travel",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    accentColor: "#10B981",
    metrics: [
      { label: "Interactive Session Duration", value: "4m 12s" },
      { label: "Direct Booking Volume", value: "+54%" },
      { label: "Terrain Render Target", value: "60 FPS" }
    ],
    architectureNotes: "Procedural terrain chunking with Level of Detail (LOD) mesh decimation; dynamic normal map calculation in fragment shaders for photorealistic morning and sunset lighting."
  },
  {
    id: "bankshield",
    number: "03",
    title: "BANKSHIELD",
    subtitle: "Next-generation financial fraud detection & risk telemetry system",
    year: "2023",
    category: "Fintech · Enterprise Security · Data Systems",
    client: "ShieldFin Technologies",
    role: "Core Systems & Frontend Architect",
    description: "Real-time anomaly detection and visual transaction graph telemetry platform safeguarding multi-million dollar high-frequency financial channels.",
    longDescription: "BankShield is an enterprise-grade defense platform built for compliance analysts and risk officers. It ingests thousands of transactions per second, scoring them through ML risk models and presenting a real-time WebGL node graph of suspicious account clusters and money laundering rings.",
    highlights: [
      "High-performance WebGL transaction graph visualizing 10,000+ nodes at 60 FPS",
      "Sub-second alert notification stream using Redis Pub/Sub and SSE",
      "Role-based audit logging with cryptographic tamper verification",
      "Interactive time-travel replay for investigating forensic transaction cascades"
    ],
    technologies: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Redis", "WebGL", "D3.js / PixiJS", "Docker", "REST / gRPC"],
    liveUrl: "https://bankshield.example.com",
    githubUrl: "https://github.com/novinjoishi/bankshield-security",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    accentColor: "#3B82F6",
    metrics: [
      { label: "Detection Latency", value: "<12ms" },
      { label: "Graph Node Capacity", value: "25,000+" },
      { label: "False Positive Reduction", value: "-42%" }
    ],
    architectureNotes: "Custom canvas/WebGL instanced rendering for nodes; buffered binary stream pipelines for continuous telemetry without garbage collection spikes."
  },
  {
    id: "school",
    number: "04",
    title: "SCHOOL EDTECH",
    subtitle: "Unified institutional learning management & collaborative classroom portal",
    year: "2023",
    category: "EdTech · Collaborative Platform",
    client: "Heritage International Academy",
    role: "Lead Full-Stack Developer",
    description: "A centralized, intuitive institutional platform unifying curriculum authoring, real-time live assessments, grading automation, and interactive student engagement.",
    longDescription: "School EdTech reimagines administrative and instructional workflows for modern educational institutions. Features include live interactive whiteboard sessions, automated quiz grading with instant feedback, parent-teacher telemetry portals, and structured assignment pipelines with zero friction.",
    highlights: [
      "Multi-user collaborative canvas with real-time vector synchronization",
      "Automated analytics tracking student comprehension and attendance milestones",
      "Encrypted gradebook with automated report card generation in PDF",
      "Comprehensive permission matrix for administrators, faculty, students, and guardians"
    ],
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "MySQL", "Socket.io", "Tailwind CSS", "Canvas API", "Prisma ORM"],
    liveUrl: "https://school-portal.example.com",
    githubUrl: "https://github.com/novinjoishi/school-platform",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    accentColor: "#8B5CF6",
    metrics: [
      { label: "Daily Active Students", value: "4,200+" },
      { label: "Grading Turnaround", value: "-65%" },
      { label: "Uptime Reliability", value: "99.98%" }
    ],
    architectureNotes: "Optimized relational database schema in MySQL with indexed query plans; operational transformation (OT) algorithms for conflict-free collaborative whiteboard drawing."
  },
  {
    id: "experiments",
    number: "05",
    title: "WEBGL & INTERACTION LAB",
    subtitle: "Creative coding research, generative shaders, and physical simulations",
    year: "2024",
    category: "R&D · Shaders · Creative Computation",
    client: "Personal Exploration",
    role: "Creative Developer & Shader Artist",
    description: "An ongoing repository of real-time GPU experiments, raymarched fractals, physical particle collisions, fluid simulations, and kinetic typography systems.",
    longDescription: "The interaction lab represents Novin's playground for pushing browser graphical limits. Each experiment investigates a specific mathematical or rendering problem: signed distance field raymarching, curl noise particle vectors, audio-reactive vertex displacement, and kinetic typography deforming under virtual gravity.",
    highlights: [
      "Custom GLSL Signed Distance Field (SDF) raymarcher running at 60 FPS",
      "100,000 GPU particle simulation using Transform Feedback and Instancing",
      "Audio-reactive vertex displacement mesh synchronized to frequencies",
      "Kinetic layout engine with spring-mass physical damping"
    ],
    technologies: ["Three.js", "GLSL Shaders", "WebGL 2.0", "Web Audio API", "GSAP", "TypeScript", "React Three Fiber"],
    liveUrl: "https://lab.novinjoishi.com",
    githubUrl: "https://github.com/novinjoishi/creative-experiments",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    accentColor: "#EC4899",
    metrics: [
      { label: "Interactive Prototypes", value: "16" },
      { label: "GPU Particle Count", value: "100k+" },
      { label: "Custom GLSL Shaders", value: "30+" }
    ],
    architectureNotes: "Zero-dependency raw WebGL wrappers for peak performance; compute-like GPU particle integration using framebuffers and ping-pong textures."
  }
];

export const TECH_NODES: TechNode[] = [
  {
    id: "webgl",
    name: "WEBGL / GLSL",
    category: "graphics",
    level: 94,
    connections: ["threejs", "typescript"],
    description: "Custom vertex/fragment shaders, raymarching, post-processing pipelines, GPU compute passes, and hardware-accelerated 3D mathematics.",
    projectsUsedIn: ["Haflong", "BankShield", "Experiments"]
  },
  {
    id: "threejs",
    name: "THREE.JS / R3F",
    category: "graphics",
    level: 96,
    connections: ["webgl", "react", "typescript"],
    description: "Scene graphing, PBR lighting, procedural geometry generation, GLTF asset pipelines, skeletal animation, and camera choreographies.",
    projectsUsedIn: ["NP Fast Food", "Haflong", "Studio Portfolio", "Experiments"]
  },
  {
    id: "typescript",
    name: "TYPESCRIPT",
    category: "frontend",
    level: 98,
    connections: ["react", "nextjs", "node", "webgl"],
    description: "Strict static typing, generic type programming, AST transformations, and enterprise-grade modular architectural patterns.",
    projectsUsedIn: ["All Projects"]
  },
  {
    id: "react",
    name: "REACT",
    category: "frontend",
    level: 98,
    connections: ["typescript", "nextjs", "threejs", "tailwind"],
    description: "Concurrent rendering, custom hooks architecture, reconciliation optimization, Context/Zustand state patterns, and micro-frontend design.",
    projectsUsedIn: ["All Projects"]
  },
  {
    id: "nextjs",
    name: "NEXT.JS",
    category: "frontend",
    level: 95,
    connections: ["react", "typescript", "node", "postgres"],
    description: "App Router, Server Components, Streaming SSR, Edge Middleware, Static Site Generation, and incremental ISR caching architectures.",
    projectsUsedIn: ["NP Fast Food", "Haflong", "BankShield", "Portfolio"]
  },
  {
    id: "node",
    name: "NODE.JS",
    category: "backend",
    level: 92,
    connections: ["typescript", "postgres", "mysql", "redis"],
    description: "Event-loop performance tuning, asynchronous stream processing, RESTful and gRPC microservices, WebSocket engines, and CLI tools.",
    projectsUsedIn: ["NP Fast Food", "BankShield", "School"]
  },
  {
    id: "postgres",
    name: "POSTGRESQL",
    category: "backend",
    level: 90,
    connections: ["node", "nextjs", "redis"],
    description: "Relational modeling, complex window queries, indexing optimization (B-tree, GIN), JSONB operations, and ACID transaction isolation.",
    projectsUsedIn: ["NP Fast Food", "Haflong", "BankShield"]
  },
  {
    id: "mysql",
    name: "MYSQL",
    category: "backend",
    level: 88,
    connections: ["node", "postgres"],
    description: "Schema normalization, InnoDB storage engine tuning, replication, partitioning, and automated migration management.",
    projectsUsedIn: ["School EdTech"]
  },
  {
    id: "java",
    name: "JAVA",
    category: "systems",
    level: 86,
    connections: ["dsa", "cpp"],
    description: "Object-oriented design patterns, concurrency (Threads, Virtual Threads), JVM memory model, garbage collection profiling, and Spring services.",
    projectsUsedIn: ["Systems Engineering", "Enterprise Labs"]
  },
  {
    id: "cpp",
    name: "C / C++",
    category: "systems",
    level: 85,
    connections: ["dsa", "java", "webgl"],
    description: "Manual memory allocation, pointer manipulation, cache locality optimization, RAII, computational geometry algorithms, and WebAssembly compilation.",
    projectsUsedIn: ["Performance Algorithms", "Graphic Engines"]
  },
  {
    id: "dsa",
    name: "DATA STRUCTURES & ALGORITHMS",
    category: "systems",
    level: 95,
    connections: ["cpp", "java", "typescript"],
    description: "Advanced graph theory (Dijkstra, A*, BFS/DFS), dynamic programming, spatial trees (BVH, Octrees, Quadtrees), Trie dictionaries, and computational complexity optimization.",
    projectsUsedIn: ["BankShield Risk Graph", "Spatial 3D Audio", "LOD Chunking"]
  },
  {
    id: "tailwind",
    name: "TAILWIND CSS",
    category: "frontend",
    level: 97,
    connections: ["react", "nextjs"],
    description: "Design tokens, bespoke typography hierarchies, fluid CSS grid layouts, container queries, and atomic styling systems.",
    projectsUsedIn: ["All Projects"]
  },
  {
    id: "redis",
    name: "REDIS",
    category: "backend",
    level: 89,
    connections: ["node", "postgres"],
    description: "In-memory caching, Pub/Sub channels, distributed rate-limiting locks, sorted sets for leaderboards, and session clustering.",
    projectsUsedIn: ["BankShield", "NP Fast Food"]
  },
  {
    id: "gsap",
    name: "GSAP & LENIS",
    category: "graphics",
    level: 96,
    connections: ["threejs", "react"],
    description: "Choreographed timeline sequences, ScrollTrigger integrations, physics-based inertial scrolling, and smooth interpolation matrixes.",
    projectsUsedIn: ["Portfolio Studio", "Haflong", "Interactive Showcases"]
  }
];

export const EXPERIMENTS_LIST: Experiment[] = [
  {
    id: "exp-01",
    title: "SDF Raymarching Metaspheres",
    category: "GLSL Shader",
    date: "2024.08",
    description: "Real-time signed distance field raymarcher with smooth minimum polynomial blending and subsurface light scattering.",
    tech: ["GLSL", "Three.js", "Fragment Shaders"],
    shaderType: "raymarching"
  },
  {
    id: "exp-02",
    title: "100k Curl Noise Kinetic Particles",
    category: "GPU Simulation",
    date: "2024.06",
    description: "GPGPU simulation evaluating 3D curl noise vector fields over 100,000 instanced glowing points with mouse gravity deflection.",
    tech: ["WebGL", "Three.js", "GPGPU"],
    shaderType: "particles"
  },
  {
    id: "exp-03",
    title: "Viscous Fluid Displacement Canvas",
    category: "Physics Simulation",
    date: "2024.04",
    description: "Navier-Stokes Eulerian fluid simulation computing advection, divergence, and pressure Poisson iterations in WebGL fragment passes.",
    tech: ["GLSL", "Canvas API", "Mathematical Physics"],
    shaderType: "fluid"
  },
  {
    id: "exp-04",
    title: "Kinetic Deformable Typography",
    category: "Interactive Canvas",
    date: "2024.02",
    description: "Vertex-displaced typographic ribbons that bend, stretch, and fold dynamically based on cursor velocity and scroll momentum.",
    tech: ["Three.js", "GSAP", "Custom Shaders"],
    shaderType: "mesh-distortion"
  }
];
