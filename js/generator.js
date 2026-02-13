/**
 * README Markdown Generator.
 * Takes GitHub data and produces a complete profile README.
 */

const ReadmeGenerator = (() => {
  /**
   * Map programming languages to skill categories with badge info.
   */
  const SKILL_MAP = {
    // Languages
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

    // Frontend
    HTML:        { badge: "HTML5-E34F26?logo=html5&logoColor=white", category: "frontend" },
    CSS:         { badge: "CSS3-1572B6?logo=css3&logoColor=white", category: "frontend" },
    SCSS:        { badge: "Sass-CC6699?logo=sass&logoColor=white", category: "frontend" },
    Vue:         { badge: "Vue.js-4FC08D?logo=vuedotjs&logoColor=white", category: "frontend" },
    Svelte:      { badge: "Svelte-FF3E00?logo=svelte&logoColor=white", category: "frontend" },

    // Data / ML
    "Jupyter Notebook": { badge: "Jupyter-F37626?logo=jupyter&logoColor=white", category: "data" },
    Jupyter:     { badge: "Jupyter-F37626?logo=jupyter&logoColor=white", category: "data" },

    // DevOps
    Dockerfile:  { badge: "Docker-2496ED?logo=docker&logoColor=white", category: "devops" },
    HCL:         { badge: "Terraform-7B42BC?logo=terraform&logoColor=white", category: "devops" },
    Nix:         { badge: "Nix-5277C3?logo=nixos&logoColor=white", category: "devops" },
    PowerShell:  { badge: "PowerShell-5391FE?logo=powershell&logoColor=white", category: "devops" },
  };

  /**
   * Infer additional tools/frameworks from repo topics and names.
   */
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
      if (pattern.test(allText)) {
        tools.add(badge);
      }
    }

    return [...tools];
  }

  /**
   * Build the shield.io badge markdown for a given badge string.
   */
  function badge(b) {
    return `![](https://img.shields.io/badge/${b}&style=for-the-badge)`;
  }

  /**
   * Generate complete README markdown from fetched data.
   */
  function generate(data) {
    const { user, repos, languages, topRepos, totalStars } = data;
    const username = user.login;
    const displayName = user.name || username;
    const bio = user.bio || "Passionate developer building awesome things.";
    const location = user.location ? ` from ${user.location}` : "";
    const blog = user.blog || "";
    const twitter = user.twitter_username || "";

    const lines = [];

    // ---- Header with wave ----
    lines.push(`<div align="center">`);
    lines.push(``);
    lines.push(`# Hi there, I'm ${displayName} <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="30px" />`);
    lines.push(``);
    lines.push(`### ${bio}`);
    lines.push(``);

    // Visitor badge + social badges
    const socialBadges = [];
    socialBadges.push(
      `[![GitHub followers](https://img.shields.io/github/followers/${username}?label=Follow&style=social)](https://github.com/${username})`
    );
    if (twitter) {
      socialBadges.push(
        `[![Twitter Follow](https://img.shields.io/twitter/follow/${twitter}?style=social)](https://twitter.com/${twitter})`
      );
    }
    socialBadges.push(
      `![Profile Views](https://komarev.com/ghpvc/?username=${username}&color=58a6ff&style=flat-square)`
    );
    lines.push(socialBadges.join(" &nbsp; "));
    lines.push(``);
    lines.push(`</div>`);
    lines.push(``);

    // ---- About Me ----
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 🧑‍💻 About Me`);
    lines.push(``);

    const aboutItems = [];
    aboutItems.push(`🔭 I have **${repos.length}** public repositories on GitHub`);
    if (location) aboutItems.push(`🌍 Based${location}`);
    aboutItems.push(`⭐ **${totalStars}** total stars earned across my projects`);
    aboutItems.push(`👥 **${user.followers}** followers · **${user.following}** following`);
    if (user.company) aboutItems.push(`🏢 Working at **${user.company}**`);
    if (blog) aboutItems.push(`📝 Check out my blog/portfolio: [${blog}](https://${blog.replace(/^https?:\/\//, "")})`);
    if (user.hireable) aboutItems.push(`💼 Open to new opportunities!`);

    for (const item of aboutItems) {
      lines.push(`- ${item}`);
    }
    lines.push(``);

    // ---- Tech Stack ----
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 🛠️ Tech Stack`);
    lines.push(``);

    // Language badges from actual repos
    const langBadges = languages
      .slice(0, 12)
      .map((l) => {
        const info = SKILL_MAP[l.name];
        return info ? badge(info.badge) : null;
      })
      .filter(Boolean);

    if (langBadges.length) {
      lines.push(`### Languages`);
      lines.push(langBadges.join(" "));
      lines.push(``);
    }

    // Tools & frameworks inferred from repos
    const toolBadges = inferTools(repos);
    if (toolBadges.length) {
      lines.push(`### Frameworks & Tools`);
      lines.push(toolBadges.map(badge).join(" "));
      lines.push(``);
    }

    // ---- Top Projects ----
    if (topRepos.length) {
      lines.push(`---`);
      lines.push(``);
      lines.push(`## 🚀 Top Projects`);
      lines.push(``);
      lines.push(`| Project | Description | Stars | Language |`);
      lines.push(`|---------|-------------|-------|----------|`);

      for (const repo of topRepos) {
        const desc = (repo.description || "—").replace(/\|/g, "\\|");
        const lang = repo.language || "—";
        lines.push(
          `| [**${repo.name}**](${repo.html_url}) | ${desc} | ⭐ ${repo.stargazers_count} | ${lang} |`
        );
      }
      lines.push(``);
    }

    // ---- GitHub Stats ----
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 📊 GitHub Stats`);
    lines.push(``);
    lines.push(`<div align="center">`);
    lines.push(``);
    lines.push(
      `<img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=github_dark&hide_border=true&count_private=true" alt="GitHub Stats" height="170" />`
    );
    lines.push(
      `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=github_dark&hide_border=true" alt="Top Languages" height="170" />`
    );
    lines.push(``);
    lines.push(`</div>`);
    lines.push(``);

    // ---- Streak Stats ----
    lines.push(`<div align="center">`);
    lines.push(``);
    lines.push(
      `<img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=github-dark-blue&hide_border=true" alt="GitHub Streak" />`
    );
    lines.push(``);
    lines.push(`</div>`);
    lines.push(``);

    // ---- Activity Graph ----
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 📈 Contribution Graph`);
    lines.push(``);
    lines.push(
      `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=github-compact&hide_border=true&area=true" width="100%" alt="Activity Graph" />`
    );
    lines.push(``);

    // ---- Trophies ----
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 🏆 GitHub Trophies`);
    lines.push(``);
    lines.push(`<div align="center">`);
    lines.push(``);
    lines.push(
      `<img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=darkhub&no-frame=true&margin-w=10&column=7" alt="Trophies" />`
    );
    lines.push(``);
    lines.push(`</div>`);
    lines.push(``);

    // ---- Connect ----
    lines.push(`---`);
    lines.push(``);
    lines.push(`## 📫 Connect with Me`);
    lines.push(``);

    const connectBadges = [];
    connectBadges.push(
      `[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${username})`
    );
    if (twitter) {
      connectBadges.push(
        `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${twitter})`
      );
    }
    if (blog) {
      connectBadges.push(
        `[![Website](https://img.shields.io/badge/Website-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://${blog.replace(/^https?:\/\//, "")})`
      );
    }
    if (user.email) {
      connectBadges.push(
        `[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${user.email})`
      );
    }

    lines.push(connectBadges.join(" "));
    lines.push(``);

    // ---- Footer ----
    lines.push(`---`);
    lines.push(``);
    lines.push(`<div align="center">`);
    lines.push(``);
    lines.push(`**⭐ Star my repos if you find them useful!**`);
    lines.push(``);
    lines.push(
      `<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,19&height=80&section=footer" width="100%" />`
    );
    lines.push(``);
    lines.push(`</div>`);

    return lines.join("\n");
  }

  return { generate };
})();
