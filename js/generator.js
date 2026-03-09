/**
 * README Markdown Generator.
 * Takes GitHub data and produces a complete profile README.
 * Supports multiple styles and custom section ordering.
 */

const ReadmeGenerator = (() => {
  const SKILL_MAP = {
    JavaScript:  { badge: "JavaScript-F7DF1E?logo=javascript&logoColor=black", category: "language" },
    TypeScript:  { badge: "TypeScript-3178C6?logo=typescript&logoColor=white", category: "language" },
    Python:      { badge: "Python-3776AB?logo=python&logoColor=white", category: "language" },
    Java:        { badge: "Java-ED8B00?logo=openjdk&logoColor=white", category: "language" },
    "C++":       { badge: "C++-00599C?logo=cplusplus&logoColor=white", category: "language" },
    C:           { badge: "C-A8B9CC?logo=c&logoColor=black", category: "language" },
    "C#":        { badge: "C%23-239120?logo=csharp&logoColor=white", category: "language" },
    Go:          { badge: "Go-00ADD8?logo=go&logoColor=white", category: "language" },
    Rust:        { badge: "Rust-000000?logo=rust&logoColor=white", category: "language" },
    Ruby:        { badge: "Ruby-CC342D?logo=ruby&logoColor=white", category: "language" },
    PHP:         { badge: "PHP-777BB4?logo=php&logoColor=white", category: "language" },
    Swift:       { badge: "Swift-F05138?logo=swift&logoColor=white", category: "language" },
    Kotlin:      { badge: "Kotlin-7F52FF?logo=kotlin&logoColor=white", category: "language" },
    Dart:        { badge: "Dart-0175C2?logo=dart&logoColor=white", category: "language" },
    Scala:       { badge: "Scala-DC322F?logo=scala&logoColor=white", category: "language" },
    R:           { badge: "R-276DC3?logo=r&logoColor=white", category: "language" },
    Perl:        { badge: "Perl-39457E?logo=perl&logoColor=white", category: "language" },
    Haskell:     { badge: "Haskell-5D4F85?logo=haskell&logoColor=white", category: "language" },
    Elixir:      { badge: "Elixir-4B275F?logo=elixir&logoColor=white", category: "language" },
    Shell:       { badge: "Shell-4EAA25?logo=gnubash&logoColor=white", category: "language" },
    Lua:         { badge: "Lua-2C2D72?logo=lua&logoColor=white", category: "language" },
    Zig:         { badge: "Zig-F7A41D?logo=zig&logoColor=black", category: "language" },
    Nim:         { badge: "Nim-FFE953?logo=nim&logoColor=black", category: "language" },
    HTML:        { badge: "HTML5-E34F26?logo=html5&logoColor=white", category: "frontend" },
    CSS:         { badge: "CSS3-1572B6?logo=css3&logoColor=white", category: "frontend" },
    SCSS:        { badge: "Sass-CC6699?logo=sass&logoColor=white", category: "frontend" },
    Vue:         { badge: "Vue.js-4FC08D?logo=vuedotjs&logoColor=white", category: "frontend" },
    Svelte:      { badge: "Svelte-FF3E00?logo=svelte&logoColor=white", category: "frontend" },
    "Jupyter Notebook": { badge: "Jupyter-F37626?logo=jupyter&logoColor=white", category: "data" },
    Jupyter:     { badge: "Jupyter-F37626?logo=jupyter&logoColor=white", category: "data" },
    Dockerfile:  { badge: "Docker-2496ED?logo=docker&logoColor=white", category: "devops" },
    HCL:         { badge: "Terraform-7B42BC?logo=terraform&logoColor=white", category: "devops" },
    Nix:         { badge: "Nix-5277C3?logo=nixos&logoColor=white", category: "devops" },
    PowerShell:  { badge: "PowerShell-5391FE?logo=powershell&logoColor=white", category: "devops" },
  };

  function inferTools(repos) {
    const tools = new Set();
    const allText = repos
      .map((r) => `${r.name} ${r.description || ""} ${(r.topics || []).join(" ")}`)
      .join(" ")
      .toLowerCase();
    const toolPatterns = [
      { pattern: /react/,        badge: "React-61DAFB?logo=react&logoColor=black" },
      { pattern: /next\.?js|nextjs/, badge: "Next.js-000000?logo=nextdotjs&logoColor=white" },
      { pattern: /angular/,      badge: "Angular-DD0031?logo=angular&logoColor=white" },
      { pattern: /vue/,          badge: "Vue.js-4FC08D?logo=vuedotjs&logoColor=white" },
      { pattern: /svelte/,       badge: "Svelte-FF3E00?logo=svelte&logoColor=white" },
      { pattern: /node/,         badge: "Node.js-339933?logo=nodedotjs&logoColor=white" },
      { pattern: /express/,      badge: "Express-000000?logo=express&logoColor=white" },
      { pattern: /django/,       badge: "Django-092E20?logo=django&logoColor=white" },
      { pattern: /flask/,        badge: "Flask-000000?logo=flask&logoColor=white" },
      { pattern: /fastapi/,      badge: "FastAPI-009688?logo=fastapi&logoColor=white" },
      { pattern: /spring/,       badge: "Spring-6DB33F?logo=spring&logoColor=white" },
      { pattern: /rails/,        badge: "Rails-CC0000?logo=rubyonrails&logoColor=white" },
      { pattern: /docker/,       badge: "Docker-2496ED?logo=docker&logoColor=white" },
      { pattern: /kubernetes|k8s/, badge: "Kubernetes-326CE5?logo=kubernetes&logoColor=white" },
      { pattern: /terraform/,    badge: "Terraform-7B42BC?logo=terraform&logoColor=white" },
      { pattern: /aws/,          badge: "AWS-232F3E?logo=amazonwebservices&logoColor=white" },
      { pattern: /gcp|google.cloud/, badge: "GCP-4285F4?logo=googlecloud&logoColor=white" },
      { pattern: /azure/,        badge: "Azure-0078D4?logo=microsoftazure&logoColor=white" },
      { pattern: /firebase/,     badge: "Firebase-FFCA28?logo=firebase&logoColor=black" },
      { pattern: /mongo/,        badge: "MongoDB-47A248?logo=mongodb&logoColor=white" },
      { pattern: /postgres/,     badge: "PostgreSQL-4169E1?logo=postgresql&logoColor=white" },
      { pattern: /mysql/,        badge: "MySQL-4479A1?logo=mysql&logoColor=white" },
      { pattern: /redis/,        badge: "Redis-DC382D?logo=redis&logoColor=white" },
      { pattern: /graphql/,      badge: "GraphQL-E10098?logo=graphql&logoColor=white" },
      { pattern: /tailwind/,     badge: "Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" },
      { pattern: /bootstrap/,    badge: "Bootstrap-7952B3?logo=bootstrap&logoColor=white" },
      { pattern: /tensorflow|tf/, badge: "TensorFlow-FF6F00?logo=tensorflow&logoColor=white" },
      { pattern: /pytorch/,      badge: "PyTorch-EE4C2C?logo=pytorch&logoColor=white" },
      { pattern: /flutter/,      badge: "Flutter-02569B?logo=flutter&logoColor=white" },
      { pattern: /electron/,     badge: "Electron-47848F?logo=electron&logoColor=white" },
      { pattern: /git(?!hub)/,   badge: "Git-F05032?logo=git&logoColor=white" },
      { pattern: /linux/,        badge: "Linux-FCC624?logo=linux&logoColor=black" },
    ];
    for (const { pattern, badge } of toolPatterns) {
      if (pattern.test(allText)) tools.add(badge);
    }
    return [...tools];
  }

  // ---- Badge helpers ----

  function badge(b, style) {
    const cfg = getConfig(style);
    return `![](https://img.shields.io/badge/${b}&style=${cfg.badgeStyle})`;
  }

  function staticBadge(label, value, color, opts, style) {
    const esc = (s) => String(s).replace(/-/g, "--").replace(/_/g, "__").replace(/ /g, "_");
    const cfg = getConfig(style);
    let url = `https://img.shields.io/badge/${esc(label)}-${esc(value)}-${color}?style=${cfg.badgeStyle}`;
    if (opts && opts.logo) url += `&logo=${opts.logo}&logoColor=white`;
    return url;
  }

  function computeExtraStats(repos) {
    let totalForks = 0, totalIssues = 0, originalRepos = 0;
    for (const r of repos) {
      totalForks += r.forks_count || 0;
      totalIssues += r.open_issues_count || 0;
      if (!r.fork) originalRepos++;
    }
    return { totalForks, totalIssues, originalRepos };
  }

  function trophyTier(value, thresholds) {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= thresholds[i].min) return thresholds[i];
    }
    return null;
  }

  function generateTrophies(data) {
    const { user, repos, languages, totalStars } = data;
    const extra = computeExtraStats(repos);
    const trophies = [];

    const starTier = trophyTier(totalStars, [
      { min: 1, label: "Star Gazer", icon: "⭐", color: "C0C0C0" },
      { min: 10, label: "Star Collector", icon: "⭐", color: "FFD700" },
      { min: 50, label: "Star Magnet", icon: "🌟", color: "FF8C00" },
      { min: 100, label: "Star Master", icon: "🌟", color: "FF4500" },
      { min: 500, label: "Superstar", icon: "💫", color: "FF0000" },
      { min: 1000, label: "Star Legend", icon: "💫", color: "8B0000" },
    ]);
    if (starTier) trophies.push({ ...starTier, value: `${totalStars} Stars` });

    const repoTier = trophyTier(extra.originalRepos, [
      { min: 1, label: "First Repo", icon: "📦", color: "C0C0C0" },
      { min: 5, label: "Creator", icon: "📦", color: "4169E1" },
      { min: 10, label: "Repository Pro", icon: "📁", color: "3fb950" },
      { min: 30, label: "Prolific Coder", icon: "📁", color: "228B22" },
      { min: 50, label: "Repo Machine", icon: "🗂️", color: "006400" },
      { min: 100, label: "Repo Legend", icon: "🗂️", color: "004d00" },
    ]);
    if (repoTier) trophies.push({ ...repoTier, value: `${extra.originalRepos} Repos` });

    const followerTier = trophyTier(user.followers, [
      { min: 1, label: "Friendly Face", icon: "👥", color: "C0C0C0" },
      { min: 10, label: "Networker", icon: "👥", color: "9370DB" },
      { min: 50, label: "Influencer", icon: "🌐", color: "8A2BE2" },
      { min: 100, label: "Community Star", icon: "🌐", color: "7B1FA2" },
      { min: 500, label: "Thought Leader", icon: "🏛️", color: "6A0DAD" },
      { min: 1000, label: "GitHub Celebrity", icon: "🏛️", color: "4a0080" },
    ]);
    if (followerTier) trophies.push({ ...followerTier, value: `${user.followers} Followers` });

    const langCount = languages.length;
    const langTier = trophyTier(langCount, [
      { min: 1, label: "Coder", icon: "💻", color: "C0C0C0" },
      { min: 3, label: "Multilingual", icon: "💻", color: "1E90FF" },
      { min: 5, label: "Polyglot", icon: "🔤", color: "0077B6" },
      { min: 8, label: "Language Master", icon: "🔤", color: "005f8a" },
      { min: 12, label: "Language Legend", icon: "🗣️", color: "003f5c" },
    ]);
    if (langTier) trophies.push({ ...langTier, value: `${langCount} Languages` });

    const forkTier = trophyTier(extra.totalForks, [
      { min: 1, label: "Forked", icon: "🍴", color: "C0C0C0" },
      { min: 10, label: "Popular Code", icon: "🍴", color: "D29922" },
      { min: 50, label: "Fork Magnet", icon: "🔱", color: "FF8C00" },
      { min: 100, label: "Fork Master", icon: "🔱", color: "FF4500" },
    ]);
    if (forkTier) trophies.push({ ...forkTier, value: `${extra.totalForks} Forks` });

    const createdYear = new Date(user.created_at).getFullYear();
    const yearsActive = new Date().getFullYear() - createdYear;
    const ageTier = trophyTier(yearsActive, [
      { min: 1, label: "GitHub Member", icon: "📅", color: "C0C0C0" },
      { min: 2, label: "Dedicated", icon: "📅", color: "20B2AA" },
      { min: 5, label: "Veteran", icon: "🎖️", color: "2E8B57" },
      { min: 8, label: "OG Developer", icon: "🎖️", color: "006400" },
      { min: 10, label: "GitHub Pioneer", icon: "🏅", color: "8B4513" },
    ]);
    if (ageTier) trophies.push({ ...ageTier, value: `Since ${createdYear}` });

    return trophies;
  }

  // ==================================================================
  //  Style Configuration — config-driven approach for all 20 styles
  // ==================================================================

  const STYLE_CONFIG = {
    classic:     { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "wave",    sectionTag: "h2", streakTheme: "github-dark-blue" },
    minimal:     { badgeStyle: "flat-square",   centered: false, emoji: false, dividers: false, headerType: "text",    sectionTag: "h2", streakTheme: null },
    hacker:      { badgeStyle: "for-the-badge", centered: false, emoji: false, dividers: false, headerType: "ascii",   sectionTag: "terminal", streakTheme: "dark" },
    elegant:     { badgeStyle: "for-the-badge", centered: true,  emoji: false, dividers: true,  headerType: "capsule", sectionTag: "h2-center", streakTheme: "github-dark-blue" },
    portfolio:   { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "capsule-portfolio", sectionTag: "h2", streakTheme: "tokyonight" },
    futuristic:  { badgeStyle: "flat-square",   centered: true,  emoji: false, dividers: true,  headerType: "capsule-neon", sectionTag: "h2-center", streakTheme: "highcontrast" },
    resume:      { badgeStyle: "flat-square",   centered: false, emoji: false, dividers: true,  headerType: "resume",  sectionTag: "h2", streakTheme: null },
    gradient:    { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "capsule-gradient", sectionTag: "h2-center", streakTheme: "radical" },
    opensource:  { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "wave-green", sectionTag: "h2", streakTheme: "merko" },
    compact:     { badgeStyle: "flat-square",   centered: false, emoji: false, dividers: false, headerType: "text",    sectionTag: "h3", streakTheme: null },
    animated:    { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "typing",  sectionTag: "h2-center", streakTheme: "fire" },
    startup:     { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "capsule-startup", sectionTag: "h2", streakTheme: "react" },
    devops:      { badgeStyle: "flat",          centered: true,  emoji: true,  dividers: true,  headerType: "capsule-devops", sectionTag: "h2", streakTheme: "algolia" },
    mobile:      { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "capsule-mobile", sectionTag: "h2", streakTheme: "vue" },
    aiml:        { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "capsule-ai", sectionTag: "h2-center", streakTheme: "cobalt" },
    pastel:      { badgeStyle: "flat-square",   centered: true,  emoji: true,  dividers: true,  headerType: "capsule-pastel", sectionTag: "h2-center", streakTheme: "buefy" },
    monochrome:  { badgeStyle: "flat-square",   centered: true,  emoji: false, dividers: true,  headerType: "text-mono", sectionTag: "h2-center", streakTheme: "dark" },
    timeline:    { badgeStyle: "flat-square",   centered: false, emoji: true,  dividers: true,  headerType: "wave",    sectionTag: "h2", streakTheme: "github-dark-blue" },
    badges:      { badgeStyle: "for-the-badge", centered: true,  emoji: true,  dividers: true,  headerType: "wave-badge", sectionTag: "h2", streakTheme: "gruvbox" },
    premium:     { badgeStyle: "for-the-badge", centered: true,  emoji: false, dividers: true,  headerType: "capsule-premium", sectionTag: "h2-center", streakTheme: "onedark" },
  };

  function getConfig(style) {
    return STYLE_CONFIG[style] || STYLE_CONFIG.classic;
  }

  function sectionHeading(title, emoji, style) {
    const cfg = getConfig(style);
    const prefix = cfg.emoji && emoji ? emoji + " " : "";
    if (style === "hacker") return `# > ${title}`;
    if (cfg.sectionTag === "h2-center") return `<h2 align="center">${prefix}${title}</h2>`;
    if (cfg.sectionTag === "h3") return `### ${prefix}${title}`;
    return `## ${prefix}${title}`;
  }

  function sectionStart(style) {
    const cfg = getConfig(style);
    const lines = [];
    if (cfg.dividers && style !== "hacker") { lines.push(`---`); lines.push(``); }
    return lines;
  }

  // ==================================================================
  //  Section Builders — each returns an array of markdown lines.
  //  Signature: build(data, style) => string[]
  // ==================================================================

  const SECTION_BUILDERS = {

    header(data, style) {
      const { user, totalStars } = data;
      const cfg = getConfig(style);
      const username = user.login;
      const displayName = user.name || username;
      const bio = user.bio || "Passionate developer building awesome things.";
      const twitter = user.twitter_username || "";
      const lines = [];

      const headerType = cfg.headerType;

      if (headerType === "ascii") {
        lines.push(`\`\`\``, `     ___  _ _   _  _       _    `);
        lines.push(`    / __|| |_| || |_ _  _| |__  `);
        lines.push(`   | (_ || |  _||   | || | '_ \\ `);
        lines.push(`    \\___||_|\\__||_|_|\\_,_|_.__/ `);
        lines.push(`\`\`\``);
        lines.push(``);
        lines.push(`# > whoami`);
        lines.push(`## ${displayName} \`@${username}\``);
        lines.push(``);
        lines.push(`> ${bio}`);
      } else if (headerType === "text") {
        lines.push(`# ${displayName}`);
        lines.push(``);
        lines.push(`${bio}`);
        lines.push(``);
        if (style === "minimal") {
          lines.push(`[![GitHub](https://img.shields.io/badge/-${username}-181717?style=flat-square&logo=github)](https://github.com/${username})`);
        } else if (style === "compact") {
          lines.push(`**@${username}** · ${user.public_repos} repos · ${totalStars} stars · ${user.followers} followers`);
        }
      } else if (headerType === "text-mono") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`# ${displayName}`);
        lines.push(``);
        lines.push(`*${bio}*`);
        lines.push(``);
        lines.push(`[![GitHub](https://img.shields.io/badge/GitHub-${username}-181717?style=flat-square&logo=github)](https://github.com/${username})`);
        lines.push(``);
      } else if (headerType === "resume") {
        lines.push(`# ${displayName}`);
        lines.push(`**@${username}** ${user.location ? "· " + user.location : ""} ${user.company ? "· " + user.company : ""}`);
        lines.push(``);
        lines.push(`${bio}`);
        lines.push(``);
        const links = [`[GitHub](https://github.com/${username})`];
        if (user.blog) links.push(`[Website](https://${user.blog.replace(/^https?:\/\//, "")})`);
        if (twitter) links.push(`[Twitter](https://twitter.com/${twitter})`);
        if (user.email) links.push(`[${user.email}](mailto:${user.email})`);
        lines.push(links.join(" · "));
      } else if (headerType === "typing") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&pause=1000&color=F75C7E&center=true&vCenter=true&random=false&width=600&lines=${encodeURIComponent("Hi, I'm " + displayName + " 👋")};${encodeURIComponent(bio)};${encodeURIComponent("Welcome to my GitHub!")}" alt="Typing SVG" />`);
        lines.push(``);
      } else if (headerType === "capsule") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,19,24&height=180&section=header&text=${encodeURIComponent(displayName)}&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=32&desc=${encodeURIComponent(bio)}&descSize=16&descAlignY=52" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-portfolio") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=slice&color=gradient&customColorList=2,3,12&height=200&section=header&text=${encodeURIComponent(displayName)}&fontSize=44&fontColor=fff&animation=twinkling&fontAlignY=32&desc=${encodeURIComponent("Developer Portfolio")}&descSize=18&descAlignY=55" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-neon") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=${encodeURIComponent(displayName)}&fontSize=44&fontColor=00ff41&animation=fadeIn&fontAlignY=35&desc=${encodeURIComponent("// " + bio)}&descSize=14&descAlignY=58" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-gradient") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,25,26,27&height=200&section=header&text=${encodeURIComponent(displayName)}&fontSize=44&fontColor=fff&animation=twinkling&fontAlignY=32&desc=${encodeURIComponent(bio)}&descSize=16&descAlignY=55" width="100%" />`);
        lines.push(``);
      } else if (headerType === "wave-green") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=14,15,16&height=180&section=header&text=${encodeURIComponent("🌍 " + displayName)}&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=32&desc=${encodeURIComponent("Open Source Contributor")}&descSize=16&descAlignY=52" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-startup") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=rounded&color=gradient&customColorList=29,30,31&height=180&section=header&text=${encodeURIComponent("🚀 " + displayName)}&fontSize=42&fontColor=333&animation=fadeIn&fontAlignY=35&desc=${encodeURIComponent(bio)}&descSize=15&descAlignY=55" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-devops") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,3&height=180&section=header&text=${encodeURIComponent("☁️ " + displayName)}&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=32&desc=${encodeURIComponent("DevOps & Cloud Engineer")}&descSize=16&descAlignY=52" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-mobile") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=17,18,19&height=180&section=header&text=${encodeURIComponent("📱 " + displayName)}&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=32&desc=${encodeURIComponent("Mobile Developer")}&descSize=16&descAlignY=52" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-ai") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=20,21,22&height=180&section=header&text=${encodeURIComponent("🤖 " + displayName)}&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=32&desc=${encodeURIComponent("AI/ML Engineer")}&descSize=16&descAlignY=52" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-pastel") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=soft&color=gradient&customColorList=29,30,31&height=180&section=header&text=${encodeURIComponent("✨ " + displayName + " ✨")}&fontSize=40&fontColor=555&animation=fadeIn&fontAlignY=35&desc=${encodeURIComponent(bio)}&descSize=15&descAlignY=55" width="100%" />`);
        lines.push(``);
      } else if (headerType === "capsule-premium") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,25,26&height=200&section=header&text=${encodeURIComponent(displayName)}&fontSize=46&fontColor=fff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent("★ " + bio + " ★")}&descSize=16&descAlignY=52" width="100%" />`);
        lines.push(``);
      } else if (headerType === "wave-badge") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`# 🏅 ${displayName} 🏅`);
        lines.push(``);
        lines.push(`### ${bio}`);
        lines.push(``);
      } else {
        // classic / wave / default
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`# Hi there, I'm ${displayName} <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="30px" />`);
        lines.push(``);
        lines.push(`### ${bio}`);
        lines.push(``);
      }

      // Social badges
      if (cfg.centered && headerType !== "ascii" && headerType !== "text" && headerType !== "resume") {
        const socialBadges = [];
        socialBadges.push(`[![GitHub followers](https://img.shields.io/github/followers/${username}?label=Follow&style=social)](https://github.com/${username})`);
        if (twitter) socialBadges.push(`[![Twitter Follow](https://img.shields.io/twitter/follow/${twitter}?style=social)](https://twitter.com/${twitter})`);
        socialBadges.push(`![Profile Views](https://komarev.com/ghpvc/?username=${username}&color=58a6ff&style=flat-square)`);
        lines.push(socialBadges.join(" &nbsp; "));
        lines.push(``);
        lines.push(`</div>`);
      } else if (headerType === "ascii") {
        lines.push(``);
        lines.push(`![Profile Views](https://komarev.com/ghpvc/?username=${username}&color=3fb950&style=flat-square&label=visitors)`);
      }

      lines.push(``);
      return lines;
    },

    about(data, style) {
      const { user, repos, totalStars } = data;
      const cfg = getConfig(style);
      const location = user.location ? ` from ${user.location}` : "";
      const blog = user.blog || "";
      const lines = [];

      lines.push(...sectionStart(style));
      lines.push(sectionHeading("About Me", "🧑‍💻", style));
      lines.push(``);

      const items = [];
      if (style === "hacker") {
        items.push(`\`${repos.length}\` public repositories`);
        if (location) items.push(`Based${location}`);
        items.push(`\`${totalStars}\` total stars earned`);
        items.push(`\`${user.followers}\` followers · \`${user.following}\` following`);
        if (user.company) items.push(`Working at **${user.company}**`);
        if (blog) items.push(`Blog: [${blog}](https://${blog.replace(/^https?:\/\//, "")})`);
      } else if (style === "resume") {
        if (location) items.push(`Location:${location}`);
        items.push(`Public Repositories: **${repos.length}**`);
        items.push(`Total Stars: **${totalStars}**`);
        items.push(`Followers: **${user.followers}** · Following: **${user.following}**`);
        if (user.company) items.push(`Company: **${user.company}**`);
        if (blog) items.push(`Website: [${blog}](https://${blog.replace(/^https?:\/\//, "")})`);
      } else if (style === "compact") {
        lines.pop(); // remove empty line
        lines.push(`> ${repos.length} repos · ${totalStars} stars · ${user.followers} followers${location ? " ·" + location : ""}`);
        lines.push(``);
        return lines;
      } else if (style === "timeline") {
        const year = new Date(user.created_at).getFullYear();
        items.push(`📅 **${year}** — Joined GitHub`);
        items.push(`📦 **${repos.length}** repositories created`);
        items.push(`⭐ **${totalStars}** stars earned`);
        items.push(`👥 **${user.followers}** developers following`);
        if (user.company) items.push(`🏢 Currently at **${user.company}**`);
        if (location) items.push(`🌍 Based${location}`);
      } else {
        const e = cfg.emoji;
        items.push(`${e ? "🔭 " : ""}I have **${repos.length}** public repositories on GitHub`);
        if (location) items.push(`${e ? "🌍 " : ""}Based${location}`);
        items.push(`${e ? "⭐ " : ""}**${totalStars}** total stars earned across my projects`);
        items.push(`${e ? "👥 " : ""}**${user.followers}** followers · **${user.following}** following`);
        if (user.company) items.push(`${e ? "🏢 " : ""}Working at **${user.company}**`);
        if (blog) items.push(`${e ? "📝 " : ""}Blog/portfolio: [${blog}](https://${blog.replace(/^https?:\/\//, "")})`);
        if (user.hireable) items.push(`${e ? "💼 " : ""}Open to new opportunities!`);
      }
      for (const item of items) lines.push(`- ${item}`);
      lines.push(``);
      return lines;
    },

    techStack(data, style) {
      const { repos, languages } = data;
      const cfg = getConfig(style);
      const lines = [];

      lines.push(...sectionStart(style));
      lines.push(sectionHeading(style === "hacker" ? "ls ~/skills" : "Tech Stack", "🛠️", style));
      lines.push(``);

      if (cfg.centered && style !== "hacker") lines.push(`<div align="center">`), lines.push(``);

      const langBadges = languages.slice(0, 12).map((l) => {
        const info = SKILL_MAP[l.name];
        return info ? badge(info.badge, style) : null;
      }).filter(Boolean);

      if (langBadges.length) {
        if (style !== "minimal" && style !== "hacker" && style !== "compact") lines.push(`### Languages`);
        lines.push(langBadges.join(" "));
        lines.push(``);
      }

      const toolBadges = inferTools(repos);
      if (toolBadges.length) {
        if (style !== "minimal" && style !== "hacker" && style !== "compact") lines.push(`### Frameworks & Tools`);
        lines.push(toolBadges.map((b) => badge(b, style)).join(" "));
        lines.push(``);
      }

      if (cfg.centered && style !== "hacker") lines.push(`</div>`), lines.push(``);
      return lines;
    },

    topProjects(data, style) {
      const { topRepos } = data;
      if (!topRepos.length) return [];
      const cfg = getConfig(style);
      const lines = [];

      lines.push(...sectionStart(style));
      lines.push(sectionHeading(style === "hacker" ? "ls ~/top-projects --sort=stars" : "Top Projects", "🚀", style));
      lines.push(``);

      if (style === "badges") {
        // Badge-heavy: show each project as a badge
        for (const repo of topRepos) {
          const lang = repo.language || "Code";
          const color = (LANG_COLORS[repo.language] || "#8b949e").replace("#", "");
          lines.push(`[![${repo.name}](https://img.shields.io/badge/${encodeURIComponent(repo.name)}-⭐_${repo.stargazers_count}-${color}?style=for-the-badge&logo=github)](${repo.html_url})`);
        }
        lines.push(``);
      } else {
        lines.push(`| Project | Description | Stars | Language |`);
        lines.push(`|---------|-------------|-------|----------|`);
        for (const repo of topRepos) {
          const desc = (repo.description || "—").replace(/\|/g, "\\|");
          const lang = repo.language || "—";
          lines.push(`| [**${repo.name}**](${repo.html_url}) | ${desc} | ⭐ ${repo.stargazers_count} | ${lang} |`);
        }
        lines.push(``);
      }
      return lines;
    },

    stats(data, style) {
      const { user, repos, totalStars } = data;
      const cfg = getConfig(style);
      const extra = computeExtraStats(repos);
      const lines = [];

      if (style === "hacker") {
        lines.push(`# > neofetch --github`);
        lines.push(``);
        lines.push(`| Stat | Value |`);
        lines.push(`|------|-------|`);
        lines.push(`| Repositories | \`${extra.originalRepos}\` |`);
        lines.push(`| Total Stars | \`${totalStars}\` |`);
        lines.push(`| Followers | \`${user.followers}\` |`);
        lines.push(`| Total Forks | \`${extra.totalForks}\` |`);
        lines.push(``);
      } else if (style === "minimal" || style === "compact") {
        lines.push(sectionHeading("Stats", "📊", style));
        lines.push(``);
        lines.push(`**${totalStars}** stars · **${extra.originalRepos}** repos · **${user.followers}** followers · **${extra.totalForks}** forks`);
        lines.push(``);
      } else {
        lines.push(...sectionStart(style));
        lines.push(sectionHeading("GitHub Stats", "📊", style));
        lines.push(``);
        if (cfg.centered) lines.push(`<div align="center">`), lines.push(``);
        lines.push(
          `![](${staticBadge("Total Stars", totalStars, "58a6ff", { logo: "github" }, style)}) ` +
          `![](${staticBadge("Repositories", extra.originalRepos, "3fb950", { logo: "bookmarks" }, style)}) ` +
          `![](${staticBadge("Followers", user.followers, "bc8cff", { logo: "people" }, style)}) ` +
          `![](${staticBadge("Forks", extra.totalForks, "d29922", { logo: "git" }, style)})`
        );
        lines.push(``);
        if (cfg.centered) lines.push(`</div>`), lines.push(``);
      }
      return lines;
    },

    languages(data, style) {
      const topLangs = data.languages.slice(0, 8);
      if (!topLangs.length) return [];
      const cfg = getConfig(style);
      const lines = [];

      if (style === "hacker") {
        lines.push(`# > wc -l ~/code/**/* | sort -rn | head`);
        lines.push(``);
        for (const l of topLangs) {
          const bar = "█".repeat(Math.max(1, Math.round(l.pct / 5))) + "░".repeat(Math.max(0, 20 - Math.round(l.pct / 5)));
          lines.push(`\`${l.name.padEnd(14)} ${bar} ${l.pct}%\``);
        }
        lines.push(``);
      } else if (style === "minimal" || style === "compact") {
        return [];
      } else {
        lines.push(...sectionStart(style));
        lines.push(sectionHeading("Top Languages", "💬", style));
        lines.push(``);
        if (cfg.centered) lines.push(`<div align="center">`), lines.push(``);
        lines.push(topLangs.map((l) => {
          const c = (LANG_COLORS[l.name] || "#8b949e").replace("#", "");
          return `![](${staticBadge(l.name, l.pct + "%", c, null, style)})`;
        }).join(" "));
        lines.push(``);
        if (cfg.centered) lines.push(`</div>`), lines.push(``);
      }
      return lines;
    },

    streak(data, style) {
      const username = data.user.login;
      const cfg = getConfig(style);
      const lines = [];

      if (!cfg.streakTheme) return [];

      if (cfg.centered && style !== "hacker") {
        lines.push(`<div align="center">`);
        lines.push(``);
      }

      lines.push(`<img src="https://streak-stats.demolab.com/?user=${username}&theme=${cfg.streakTheme}&hide_border=true" alt="GitHub Streak" />`);
      lines.push(``);

      if (cfg.centered && style !== "hacker") {
        lines.push(`</div>`);
        lines.push(``);
      }
      return lines;
    },

    trophies(data, style) {
      const trophies = generateTrophies(data);
      if (!trophies.length) return [];
      const cfg = getConfig(style);
      const lines = [];

      if (style === "minimal" || style === "compact") return [];

      lines.push(...sectionStart(style));
      if (style === "hacker") {
        lines.push(`# > cat ~/.achievements`);
      } else {
        lines.push(sectionHeading("GitHub Trophies", "🏆", style));
      }
      lines.push(``);

      if (style === "hacker") {
        for (const t of trophies) {
          lines.push(`- ${t.icon} **${t.label}** — \`${t.value}\``);
        }
        lines.push(``);
      } else {
        if (cfg.centered) lines.push(`<div align="center">`), lines.push(``);
        lines.push(trophies.map((t) =>
          `![](${staticBadge(t.icon + " " + t.label, t.value, t.color, null, style)})`
        ).join(" "));
        lines.push(``);
        if (cfg.centered) lines.push(`</div>`), lines.push(``);
      }
      return lines;
    },

    connect(data, style) {
      const { user } = data;
      const cfg = getConfig(style);
      const username = user.login;
      const twitter = user.twitter_username || "";
      const blog = user.blog || "";
      const lines = [];

      if (style === "hacker") {
        lines.push(`# > cat ~/.contact`);
        lines.push(``);
        lines.push(`- GitHub: [\`@${username}\`](https://github.com/${username})`);
        if (twitter) lines.push(`- Twitter: [\`@${twitter}\`](https://twitter.com/${twitter})`);
        if (blog) lines.push(`- Web: [${blog}](https://${blog.replace(/^https?:\/\//, "")})`);
        if (user.email) lines.push(`- Email: [\`${user.email}\`](mailto:${user.email})`);
        lines.push(``);
      } else {
        lines.push(...sectionStart(style));
        lines.push(sectionHeading("Connect with Me", "📫", style));
        lines.push(``);

        if (cfg.centered) lines.push(`<div align="center">`), lines.push(``);
        const connectBadges = [];
        connectBadges.push(`[![GitHub](https://img.shields.io/badge/GitHub-181717?style=${cfg.badgeStyle}&logo=github&logoColor=white)](https://github.com/${username})`);
        if (twitter) connectBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=${cfg.badgeStyle}&logo=twitter&logoColor=white)](https://twitter.com/${twitter})`);
        if (blog) connectBadges.push(`[![Website](https://img.shields.io/badge/Website-4285F4?style=${cfg.badgeStyle}&logo=googlechrome&logoColor=white)](https://${blog.replace(/^https?:\/\//, "")})`);
        if (user.email) connectBadges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=${cfg.badgeStyle}&logo=gmail&logoColor=white)](mailto:${user.email})`);
        lines.push(connectBadges.join(" "));
        lines.push(``);
        if (cfg.centered) lines.push(`</div>`), lines.push(``);
      }
      return lines;
    },

    footer(data, style) {
      const cfg = getConfig(style);
      const lines = [];
      lines.push(`---`);
      lines.push(``);

      if (style === "hacker") {
        lines.push(`\`\`\``);
        lines.push(`$ echo "Thanks for visiting! Star my repos if you find them useful."`);
        lines.push(`\`\`\``);
      } else if (style === "minimal" || style === "compact") {
        lines.push(`*Star my repos if you find them useful!*`);
      } else if (style === "resume") {
        lines.push(`*References and additional details available upon request.*`);
      } else if (style === "pastel") {
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`*Thank you for visiting! Have a wonderful day!* ✨🌸`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=soft&color=gradient&customColorList=29,30,31&height=80&section=footer" width="100%" />`);
        lines.push(``);
        lines.push(`</div>`);
      } else if (cfg.centered) {
        const footerColors = {
          classic: "6,12,19", elegant: "12,19,24", portfolio: "2,3,12", futuristic: "0,1,2",
          gradient: "24,25,26", opensource: "14,15,16", animated: "8,9,10", startup: "29,30,31",
          devops: "0,2,3", mobile: "17,18,19", aiml: "20,21,22", monochrome: "0,1,2",
          timeline: "6,12,19", badges: "8,9,10", premium: "24,25,26",
        };
        const colorList = footerColors[style] || "6,12,19";
        lines.push(`<div align="center">`);
        lines.push(``);
        lines.push(`**${cfg.emoji ? "⭐ " : ""}Star my repos if you find them useful!${cfg.emoji ? " ⭐" : ""}**`);
        lines.push(``);
        lines.push(`<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=${colorList}&height=80&section=footer" width="100%" />`);
        lines.push(``);
        lines.push(`</div>`);
      } else {
        lines.push(`*Star my repos if you find them useful!*`);
      }
      return lines;
    },
  };

  // ---- Default section order ----
  const DEFAULT_ORDER = [
    "header", "about", "techStack", "topProjects",
    "stats", "languages", "streak", "trophies", "connect", "footer",
  ];

  /**
   * Generate complete README markdown.
   * @param {object} data - GitHub data from API
   * @param {object} [options] - { style: string, sectionOrder: string[] }
   */
  function generate(data, options) {
    const style = (options && options.style) || "classic";
    const order = (options && options.sectionOrder) || DEFAULT_ORDER;
    const allLines = [];

    for (const sectionId of order) {
      const builder = SECTION_BUILDERS[sectionId];
      if (builder) {
        const sectionLines = builder(data, style);
        allLines.push(...sectionLines);
      }
    }

    return allLines.join("\n");
  }

  return { generate, DEFAULT_ORDER };
})();
