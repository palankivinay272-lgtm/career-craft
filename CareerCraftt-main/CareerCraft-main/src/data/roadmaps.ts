export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  playlistUrl?: string; // 👈 The magic link field
  resources?: { title: string; url: string }[];
  children?: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  nodes: RoadmapNode[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "web-development",
    name: "Web Development",
    description: "Build modern web applications",
    icon: "Globe",
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    description: "Infrastructure and deployment",
    icon: "Cloud",
  },
  {
    id: "mobile",
    name: "Mobile Development",
    description: "iOS, Android & Cross-platform",
    icon: "Smartphone",
  },
  {
    id: "data-science",
    name: "Data Science & AI",
    description: "Machine learning and analytics",
    icon: "Brain",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Security and ethical hacking",
    icon: "Shield",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    description: "Web3 and decentralized apps",
    icon: "Blocks",
  },
  {
    id: "product-design",
    name: "Product & Design",
    description: "Design and manage digital products",
    icon: "PenTool",
  },
];

export const roadmaps: Roadmap[] = [
  // --- FRONTEND ---
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Learn to build beautiful user interfaces and interactive web experiences",
    icon: "Layout",
    category: "web-development",
    color: "177 70% 50%",
    nodes: [
      {
        id: "html",
        title: "HTML",
        description: "Learn the structure of web pages",
        playlistUrl: "https://youtu.be/qz0aGYrrlhU?si=L2WyTYNl_5ys2RNU",
        children: ["css"],
      },
      {
        id: "css",
        title: "CSS",
        description: "Style your web pages beautifully",
        playlistUrl: "https://youtu.be/wRNinF7YQqQ?si=JE0MxXoXUsxUuhEQ",
        children: ["javascript"],
      },
      {
        id: "javascript",
        title: "JavaScript",
        description: "Add interactivity to your websites",
        playlistUrl: "https://youtu.be/W6NZfCO5SIk?si=aONnVw3KPRLqYl_7",
        children: ["react", "vue", "angular"],
      },
      {
        id: "react",
        title: "React",
        description: "Build component-based UIs",
        playlistUrl: "https://youtu.be/SqcY0GlETPk?si=aZSWdKBKJQ1oLHXr",
        children: ["nextjs", "state-management"],
      },
      {
        id: "vue",
        title: "Vue.js",
        description: "Progressive JavaScript framework",
        playlistUrl: "https://youtu.be/VeNfHj6MhgA?si=3TJmQRVgRaPFmqBV",
        children: ["nuxt"],
      },
      {
        id: "angular",
        title: "Angular",
        description: "Full-featured framework by Google",
        playlistUrl: "https://youtu.be/k5E2AVpwsko?si=yTsavDh3-k4djsHY",
        children: ["rxjs"],
      },
      {
        id: "nextjs",
        title: "Next.js",
        description: "React framework for production",
        playlistUrl: "https://youtu.be/ZVnjOPwW4ZA?si=JOjOccAI7lerYrCs",
        children: ["deployment"],
      },
      {
        id: "state-management",
        title: "State Management",
        description: "Redux, Zustand, Jotai",
        playlistUrl: "https://youtu.be/J5By-Q4ZhZs?si=z8GGeyK8UCWoDylN",
        children: ["testing"],
      },
      {
        id: "nuxt",
        title: "Nuxt.js",
        description: "Vue framework for production",
        playlistUrl: "https://youtu.be/RhZZ0whiuT8?si=ORg67EjPUS3HXTaG",
        children: ["deployment"],
      },
      {
        id: "rxjs",
        title: "RxJS",
        description: "Reactive programming",
        playlistUrl: "https://youtu.be/dqY9bmvRVzc?si=zWAlolYf9BsEXWoS",
        children: ["testing"],
      },
      {
        id: "testing",
        title: "Testing",
        description: "Jest, Cypress, Playwright",
        playlistUrl: "https://youtu.be/JBSUgDxICg8?si=KMqdk9SfeaQ4IomJ",
        children: ["deployment"],
      },
      {
        id: "deployment",
        title: "Deployment",
        description: "Vercel, Netlify, AWS",
        playlistUrl: "https://youtu.be/sPmat30SE4k?si=X19jrWu4zyOUTo5f",
        children: [],
      },
    ],
  },
  // --- BACKEND ---
  {
    id: "backend",
    title: "Backend Developer",
    description: "Master server-side programming and database management",
    icon: "Server",
    category: "web-development",
    color: "262 83% 58%",
    nodes: [
      {
        id: "programming-basics",
        title: "Programming Basics",
        description: "Choose a language: Node.js, Python, Java, Go",
        playlistUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4&list=PLryY1GbNpfqMPIFdeQ1xnevKSDeEyJnZf",
        children: ["nodejs", "python", "java"],
      },
      {
        id: "nodejs",
        title: "Node.js",
        description: "JavaScript runtime for servers",
        playlistUrl: "https://youtu.be/TlB_eWDSMt4?si=A-y4vSiSIycd-fBe",
        children: ["express", "nestjs"],
      },
      {
        id: "python",
        title: "Python",
        description: "Versatile programming language",
        playlistUrl: "https://youtu.be/K5KVEU3aaeQ?si=5LJqUS1NpI67MA7q",
        children: ["django", "fastapi"],
      },
      {
        id: "java",
        title: "Java",
        description: "Enterprise-grade language",
        playlistUrl: "https://youtu.be/eIrMbAQSU34?si=48DvUVJF4I8mR3Cg",
        children: ["spring"],
      },
      {
        id: "express",
        title: "Express.js",
        description: "Minimal Node.js framework",
        playlistUrl: "https://youtu.be/SccSCuHhOw0?si=iF5xI_U6MaZrNRvo",
        children: ["databases"],
      },
      {
        id: "nestjs",
        title: "NestJS",
        description: "Progressive Node.js framework",
        playlistUrl: "https://youtu.be/O-957TuMgJA?si=O42bN8YXtQPGALEA",
        children: ["databases"],
      },
      {
        id: "django",
        title: "Django",
        description: "Python web framework",
        playlistUrl: "https://youtu.be/rHux0gMZ3Eg?si=WybrBUH3AVsqx6T9",
        children: ["databases"],
      },
      {
        id: "fastapi",
        title: "FastAPI",
        description: "Modern Python API framework",
        playlistUrl: "https://youtu.be/Lu8lXXlstvM?si=WfgWqFjcMtvBVNDC",
        children: ["databases"],
      },
      {
        id: "spring",
        title: "Spring Boot",
        description: "Java framework for microservices",
        playlistUrl: "https://youtu.be/gJrjgg1KVL4?si=H_2ByJTP-RZywbHL",
        children: ["databases"],
      },
      {
        id: "databases",
        title: "Databases",
        description: "SQL & NoSQL databases",
        playlistUrl: "https://youtu.be/hlGoQC332VM?si=TP5dxpZy0yalmMyj",
        children: ["apis"],
      },
      {
        id: "apis",
        title: "API Design",
        description: "REST, GraphQL, gRPC",
        playlistUrl: "https://youtu.be/WXsD0ZgxjRw?si=RdPXWou58vFaGEFm",
        children: ["authentication"],
      },
      {
        id: "authentication",
        title: "Authentication",
        description: "JWT, OAuth, Sessions",
        playlistUrl: "https://youtu.be/mbsmsi7l3r4?si=9cvkO-ZhY5NxDF4Z",
        children: ["deployment-backend"],
      },
      {
        id: "deployment-backend",
        title: "Deployment",
        description: "Docker, Kubernetes, CI/CD",
        playlistUrl: "https://youtu.be/7GaJr7frB1o?si=J_bZxNLCC-7CzqQm",
        children: [],
      },
    ],
  },
  // --- FULL STACK ---
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "Become proficient in both frontend and backend development",
    icon: "Layers",
    category: "web-development",
    color: "142 76% 45%",
    nodes: [
      {
        id: "frontend-basics",
        title: "Frontend Fundamentals",
        description: "HTML, CSS, JavaScript",
        playlistUrl: "https://www.youtube.com/watch?v=qz0aGYrrlhU&list=PLryY1GbNpfqNKsCSv8Gmb1_kWtSF6pJHv",
        children: ["frontend-framework"],
      },
      {
        id: "frontend-framework",
        title: "Frontend Framework",
        description: "React, Vue, or Angular",
        playlistUrl: "https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3",
        children: ["backend-basics"],
      },
      {
        id: "backend-basics",
        title: "Backend Language",
        description: "Node.js, Python, or Go",
        playlistUrl: "https://youtu.be/TlB_eWDSMt4?si=DkUTloO95gG7HADo",
        children: ["database-design"],
      },
      {
        id: "database-design",
        title: "Database Design",
        description: "PostgreSQL, MongoDB",
        playlistUrl: "https://www.youtube.com/playlist?list=PL08903FB7ACA1C2FB",
        children: ["api-development"],
      },
      {
        id: "api-development",
        title: "API Development",
        description: "REST APIs & GraphQL",
        playlistUrl: "https://youtu.be/WXsD0ZgxjRw?si=SWB9vfoA52vCx74C",
        children: ["auth-systems"],
      },
      {
        id: "auth-systems",
        title: "Authentication",
        description: "User auth & authorization",
        playlistUrl: "https://youtu.be/mbsmsi7l3r4?si=i7Bt9rYIaCfRfVhF",
        children: ["fullstack-deployment"],
      },
      {
        id: "fullstack-deployment",
        title: "Deployment & DevOps",
        description: "CI/CD, Docker, Cloud",
        playlistUrl: "https://youtu.be/31k6AtW-b3Y?si=afDBgYPbU9JlzVmr",
        children: [],
      },
    ],
  },
  // --- DEVOPS ---
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "Automate and streamline development operations",
    icon: "GitBranch",
    category: "devops",
    color: "25 95% 53%",
    nodes: [
      {
        id: "linux",
        title: "Linux Fundamentals",
        description: "Command line & shell scripting",
        playlistUrl: "https://youtu.be/e01GGTKmtpc?si=0E_IF6pviAc57y4C",
        children: ["networking"],
      },
      {
        id: "networking",
        title: "Networking",
        description: "TCP/IP, DNS, HTTP",
        playlistUrl: "https://youtu.be/IPvYjXCsTg8?si=ICvFjtWAiWCrB8oC",
        children: ["version-control"],
      },
      {
        id: "version-control",
        title: "Version Control",
        description: "Git & GitHub/GitLab",
        playlistUrl: "https://youtu.be/Ez8F0nW6S-w?si=R5x6LbX2jOhig4hz",
        children: ["containers"],
      },
      {
        id: "containers",
        title: "Containers",
        description: "Docker & containerization",
        playlistUrl: "https://youtu.be/exmSJpJvIPs?si=DAInq2G5Ha0Qr5jr",
        children: ["orchestration"],
      },
      {
        id: "orchestration",
        title: "Orchestration",
        description: "Kubernetes & Helm",
        playlistUrl: "https://youtu.be/W04brGNgxN4?si=q8rtNNCQ8UhzeKHo",
        children: ["ci-cd"],
      },
      {
        id: "ci-cd",
        title: "CI/CD",
        description: "Jenkins, GitHub Actions",
        playlistUrl: "https://youtu.be/XaSdKR2fOU4?si=jqursUyb4PuqWKze",
        children: ["infrastructure"],
      },
      {
        id: "infrastructure",
        title: "Infrastructure as Code",
        description: "Terraform, Ansible",
        playlistUrl: "https://youtu.be/S9mohJI_R34?si=RYDB8fB8KwBv8Qgx",
        children: ["monitoring"],
      },
      {
        id: "monitoring",
        title: "Monitoring & Logging",
        description: "Prometheus, Grafana, ELK",
        playlistUrl: "https://youtu.be/ddZjhv66o_o?si=cH5lkgo-kXhcPzJG",
        children: ["cloud-providers"],
      },
      {
        id: "cloud-providers",
        title: "Cloud Providers",
        description: "AWS, GCP, Azure",
        playlistUrl: "https://youtu.be/O61gbmYZJmE?si=mEiCOZZ4fHytw83r",
        children: [],
      },
    ],
  },
  // --- CYBERSECURITY ---
  {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    description: "Protect systems and networks from security threats",
    icon: "Shield",
    category: "cybersecurity",
    color: "0 84% 60%",
    nodes: [
      {
        id: "security-fundamentals",
        title: "Security Fundamentals",
        description: "CIA triad, threats, vulnerabilities",
        playlistUrl: "https://youtu.be/njPY7pQTRWg?si=a1i5ZIFW21TQZ8_P",
        children: ["network-security"],
      },
      {
        id: "network-security",
        title: "Network Security",
        description: "Firewalls, VPNs, IDS/IPS",
        playlistUrl: "https://youtu.be/mERUdj0rDU8?si=UO6uZ8XgHUQkfleT",
        children: ["cryptography"],
      },
      {
        id: "cryptography",
        title: "Cryptography",
        description: "Encryption, hashing, PKI",
        playlistUrl: "https://www.youtube.com/live/C7vmouDOJYM?si=XFZJvgopgcnhLfx3",
        children: ["web-security"],
      },
      {
        id: "web-security",
        title: "Web Security",
        description: "OWASP Top 10, XSS, CSRF",
        playlistUrl: "https://youtu.be/HE244moNuXE?si=bONxuZRLuQRMRkXd",
        children: ["penetration-testing"],
      },
      {
        id: "penetration-testing",
        title: "Penetration Testing",
        description: "Kali Linux, Metasploit",
        playlistUrl: "https://youtu.be/wNA4CLG-OSM?si=TfXWRM-BKFgRFq_Z",
        children: ["incident-response"],
      },
      {
        id: "incident-response",
        title: "Incident Response",
        description: "Forensics & threat hunting",
        playlistUrl: "https://youtu.be/9X069Ez_hFg?si=lZ8vR9dQwDXpAV2_",
        children: ["compliance"],
      },
      {
        id: "compliance",
        title: "Compliance",
        description: "GDPR, HIPAA, SOC2",
        playlistUrl: "https://youtu.be/JswwHeEqBIc?si=QIit_ZbmQVg67k0N",
        children: [],
      },
    ],
  },
  // --- DATA SCIENCE ---
  {
    id: "data-science",
    title: "Data Scientist",
    description: "Extract insights from data using statistics and machine learning",
    icon: "BarChart3",
    category: "data-science",
    color: "199 89% 48%",
    nodes: [
      {
        id: "python-ds",
        title: "Python for Data Science",
        description: "NumPy, Pandas basics",
        playlistUrl: "https://youtu.be/HrRA67O-QXI?si=-TujvhTm9DE2oa9i",
        children: ["statistics"],
      },
      {
        id: "statistics",
        title: "Statistics",
        description: "Probability & statistical analysis",
        playlistUrl: "https://youtu.be/Vfo5le26IhY?si=5xwATuQ0eXez553i",
        children: ["data-visualization"],
      },
      {
        id: "data-visualization",
        title: "Data Visualization",
        description: "Matplotlib, Seaborn, Plotly",
        playlistUrl: "https://youtu.be/xXibS9832FM?si=bZ7CNMiWxMq5_mKe",
        children: ["machine-learning"],
      },
      {
        id: "machine-learning",
        title: "Machine Learning",
        description: "Scikit-learn, algorithms",
        playlistUrl: "https://youtu.be/i_LwzRVP7bg?si=EPZFtB9yuFl8MHV4",
        children: ["deep-learning"],
      },
      {
        id: "deep-learning",
        title: "Deep Learning",
        description: "TensorFlow, PyTorch",
        playlistUrl: "https://youtu.be/VyWAvY2CF9c?si=FWOw3G0dtPJywwyh",
        children: ["nlp", "computer-vision"],
      },
      {
        id: "nlp",
        title: "NLP",
        description: "Natural language processing",
        playlistUrl: "https://www.youtube.com/live/Rj-OtK2n5jU?si=WNEDwnd63b1P8PoB",
        children: ["mlops"],
      },
      {
        id: "computer-vision",
        title: "Computer Vision",
        description: "Image recognition & processing",
        playlistUrl: "https://youtu.be/oXlwWbU8l2o?si=3c7ci_ur7pX0ZXGe",
        children: ["mlops"],
      },
      {
        id: "mlops",
        title: "MLOps",
        description: "Model deployment & monitoring",
        playlistUrl: "https://www.youtube.com/live/7vBbkChN7Wk?si=pVe_nzfrEA4eK18X",
        children: [],
      },
    ],
  },
  // --- MOBILE ---
  {
    id: "mobile-react-native",
    title: "React Native Developer",
    description: "Build cross-platform mobile apps with React Native",
    icon: "Smartphone",
    category: "mobile",
    color: "199 89% 48%",
    nodes: [
      {
        id: "react-basics",
        title: "React Fundamentals",
        description: "Components, props, state",
        playlistUrl: "https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3",
        children: ["rn-setup"],
      },
      {
        id: "rn-setup",
        title: "React Native Setup",
        description: "Expo & React Native CLI",
        playlistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ",
        children: ["rn-components"],
      },
      {
        id: "rn-components",
        title: "Core Components",
        description: "View, Text, Image, ScrollView",
        playlistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ",
        children: ["navigation"],
      },
      {
        id: "navigation",
        title: "Navigation",
        description: "React Navigation library",
        playlistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ",
        children: ["state-rn"],
      },
      {
        id: "state-rn",
        title: "State Management",
        description: "Context, Redux, Zustand",
        playlistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ",
        children: ["native-features"],
      },
      {
        id: "native-features",
        title: "Native Features",
        description: "Camera, location, notifications",
        playlistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ",
        children: ["app-store"],
      },
      {
        id: "app-store",
        title: "App Store Deployment",
        description: "iOS & Android publishing",
        playlistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ",
        children: [],
      },
    ],
  },
  // --- BLOCKCHAIN ---
  {
    id: "blockchain",
    title: "Blockchain Developer",
    description: "Build decentralized applications and smart contracts",
    icon: "Blocks",
    category: "blockchain",
    color: "45 93% 47%",
    nodes: [
      {
        id: "blockchain-basics",
        title: "Blockchain Fundamentals",
        description: "Distributed ledgers, consensus",
        playlistUrl: "https://youtu.be/SyVMma1IkXM?si=YXovJELug3cv11GE",
        children: ["ethereum"],
      },
      {
        id: "ethereum",
        title: "Ethereum",
        description: "EVM, gas, transactions",
        playlistUrl: "https://youtu.be/jxLkbJozKbY?si=dDqhYDhCiNUpLREd",
        children: ["solidity"],
      },
      {
        id: "solidity",
        title: "Solidity",
        description: "Smart contract programming",
        playlistUrl: "https://youtu.be/RQzuQb0dfBM?si=kE9EZ3lD5qoHeXMD",
        children: ["web3"],
      },
      {
        id: "web3",
        title: "Web3.js / Ethers.js",
        description: "Blockchain interaction libraries",
        playlistUrl: "https://youtu.be/hF0sNd66xO4?si=lBRgyZy1nPXwdxIl",
        children: ["defi"],
      },
      {
        id: "defi",
        title: "DeFi Protocols",
        description: "DEXs, lending, staking",
        playlistUrl: "https://youtu.be/eo5227bMuh4?si=0V6mUGtk36S_FjSU",
        children: ["nft"],
      },
      {
        id: "nft",
        title: "NFTs",
        description: "ERC-721, ERC-1155",
        playlistUrl: "https://youtu.be/BG1gQ4Ta79M?si=2wtOV-2d7XFzN3lJ",
        children: ["security-blockchain"],
      },
      {
        id: "security-blockchain",
        title: "Smart Contract Security",
        description: "Auditing & best practices",
        playlistUrl: "https://youtu.be/TzdgwHX2xTs?si=CNU2wssbEmCiVPXq",
        children: [],
      },
    ],
  },
  // --- MACHINE LEARNING ---
  {
    id: "machine-learning",
    title: "Machine Learning Engineer",
    description: "Master the art of building and deploying intelligent systems",
    icon: "BrainCircuit",
    category: "data-science",
    color: "280 80% 60%",
    nodes: [
      {
        id: "math-ml",
        title: "Mathematics for ML",
        description: "Linear Algebra, Calculus, Probability",
        playlistUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
        children: ["python-ml"],
      },
      {
        id: "python-ml",
        title: "Python for ML",
        description: "NumPy, Pandas, Matplotlib",
        playlistUrl: "https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_",
        children: ["ml-algos"],
      },
      {
        id: "ml-algos",
        title: "ML Algorithms",
        description: "Regression, Clustering, Trees",
        playlistUrl: "https://www.youtube.com/playlist?list=PLbD59L949o5XHtD9x7a2iJj6UqG54T7nK",
        children: ["deep-learning-intro"],
      },
      {
        id: "deep-learning-intro",
        title: "Deep Learning",
        description: "Neural Networks, CNNs",
        playlistUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
        children: ["frameworks"],
      },
      {
        id: "frameworks",
        title: "ML Frameworks",
        description: "PyTorch & TensorFlow",
        playlistUrl: "https://www.youtube.com/playlist?list=PLqnslRFeH2UrcDBWF5mfPGpqQDSta6VK4",
        children: ["nlp-cv"],
      },
      {
        id: "nlp-cv",
        title: "NLP & Computer Vision",
        description: "Transformers, Object Detection",
        playlistUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
        children: ["mlops-engineering"],
      },
      {
        id: "mlops-engineering",
        title: "MLOps Engineering",
        description: "Model Deployment, Docker, CI/CD",
        playlistUrl: "https://www.youtube.com/playlist?list=PL3MmuxUbc_hIUISrluw_A7wDS8Lo7Aa66",
        children: [],
      },
    ],
  },
  // --- UI/UX DESIGN ---
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    description: "Design intuitive and beautiful user experiences",
    icon: "PenTool",
    category: "product-design",
    color: "340 82% 52%",
    nodes: [
      {
        id: "design-principles",
        title: "Design Principles",
        description: "Typography, Color Theory, Layout",
        playlistUrl: "https://youtu.be/c9Wg6Cb_YlU",
        children: ["figma"],
      },
      {
        id: "figma",
        title: "Figma Mastery",
        description: "Interface design & prototyping",
        playlistUrl: "https://youtu.be/KbZ-Vas-X14",
        children: ["user-research"],
      },
      {
        id: "user-research",
        title: "User Research",
        description: "Personas, User Journey Maps",
        playlistUrl: "https://youtu.be/3w1y1x2z3A4",
        children: ["wireframing"],
      },
      {
        id: "wireframing",
        title: "Wireframing",
        description: "Low-fidelity structure",
        playlistUrl: "https://youtu.be/4x5y6z7A8B9",
        children: ["design-systems"],
      },
      {
        id: "design-systems",
        title: "Design Systems",
        description: "Scalable UI components",
        playlistUrl: "https://youtu.be/5z6y7x8A9B0",
        children: [],
      },
    ]
  },
  // --- PRODUCT MANAGER ---
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Lead product strategy and execution",
    icon: "Briefcase",
    category: "product-design",
    color: "30 90% 55%",
    nodes: [
      {
        id: "pm-fundamentals",
        title: "PM Fundamentals",
        description: "Role, Lifecycle, Strategy",
        playlistUrl: "https://youtu.be/8y9z0A1B2C3",
        children: ["agile"],
      },
      {
        id: "agile",
        title: "Agile & Scrum",
        description: "Sprints, Kanban, JIRA",
        playlistUrl: "https://youtu.be/9z0A1B2C3D4",
        children: ["user-stories"],
      },
      {
        id: "user-stories",
        title: "User Stories",
        description: "Requirements gathering",
        playlistUrl: "https://youtu.be/0A1B2C3D4E5",
        children: ["analytics"],
      },
      {
        id: "analytics",
        title: "Product Analytics",
        description: "Metrics, KPIs, A/B Testing",
        playlistUrl: "https://youtu.be/1B2C3D4E5F6",
        children: [],
      }
    ]
  },
  // --- AI RESEARCHER ---
  {
    id: "ai-researcher",
    title: "AI Research Scientist",
    description: "Push the boundaries of Artificial Intelligence",
    icon: "Microscope",
    category: "data-science",
    color: "260 100% 65%",
    nodes: [
      {
        id: "advanced-math",
        title: "Advanced Mathematics",
        description: "Optimization, Information Theory",
        playlistUrl: "https://youtu.be/2C3D4E5F6G7",
        children: ["reading-papers"],
      },
      {
        id: "reading-papers",
        title: "Reading Research Papers",
        description: "ArXiv, Conference proceedings",
        playlistUrl: "https://youtu.be/3D4E5F6G7H8",
        children: ["generative-ai"],
      },
      {
        id: "generative-ai",
        title: "Generative AI",
        description: "LLMs, Diffusion Models",
        playlistUrl: "https://youtu.be/4E5F6G7H8I9",
        children: ["reinforcement-learning"],
      },
      {
        id: "reinforcement-learning",
        title: "Reinforcement Learning",
        description: "Agents, Rewards, Policy Gradients",
        playlistUrl: "https://youtu.be/5F6G7H8I9J0",
        children: [],
      }
    ]
  },
];

export const getRoadmapsByCategory = (categoryId: string) => {
  return roadmaps.filter((r) => r.category === categoryId);
};

export const getRoadmapById = (id: string) => {
  return roadmaps.find((r) => r.id === id);
};

export const getCategoryById = (id: string) => {
  return categories.find((c) => c.id === id);
};