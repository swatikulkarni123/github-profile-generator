/**
 * Main application controller.
 * Wires up UI events, orchestrates API calls and README generation.
 */

(function () {
  "use strict";

  // ---- DOM refs ----
  const usernameInput = document.getElementById("username-input");
  const generateBtn = document.getElementById("generate-btn");
  const btnText = generateBtn.querySelector(".btn-text");
  const btnLoader = generateBtn.querySelector(".btn-loader");
  const errorMsg = document.getElementById("error-msg");
  const resultsSection = document.getElementById("results");

  // Profile card
  const avatarImg = document.getElementById("avatar");
  const profileName = document.getElementById("profile-name");
  const profileBio = document.getElementById("profile-bio");
  const statRepos = document.getElementById("stat-repos");
  const statStars = document.getElementById("stat-stars");
  const statFollowers = document.getElementById("stat-followers");
  const statFollowing = document.getElementById("stat-following");

  // Charts / repos
  const languagesChart = document.getElementById("languages-chart");
  const topReposContainer = document.getElementById("top-repos");

  // README
  const readmePreview = document.getElementById("readme-preview");
  const readmeRaw = document.getElementById("readme-raw");
  const copyBtn = document.getElementById("copy-btn");
  const downloadBtn = document.getElementById("download-btn");

  // Tabs
  const tabs = document.querySelectorAll(".tab");
  const tabContents = {
    preview: document.getElementById("tab-preview"),
    raw: document.getElementById("tab-raw"),
  };

  let currentMarkdown = "";

  // ---- Auto-focus input on page load ----
  usernameInput.focus();

  // ---- Event listeners ----
  generateBtn.addEventListener("click", handleGenerate);
  usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleGenerate();
  });
  // Clear error state when user starts typing
  usernameInput.addEventListener("input", () => {
    hideError();
    usernameInput.closest(".input-wrapper").classList.remove("input-error");
  });
  copyBtn.addEventListener("click", handleCopy);
  downloadBtn.addEventListener("click", handleDownload);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      Object.values(tabContents).forEach((tc) => tc.classList.remove("active"));
      tab.classList.add("active");
      tabContents[tab.dataset.tab].classList.add("active");
    });
  });

  // ---- Main handler ----
  async function handleGenerate() {
    const username = usernameInput.value.trim();
    if (!username) {
      showError("Please enter a GitHub username to generate a profile README.");
      return;
    }

    // Basic validation
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
      showError('Invalid username "' + username + '". GitHub usernames can only contain letters, numbers, and hyphens.');
      return;
    }

    setLoading(true);
    hideError();
    resultsSection.hidden = true;

    try {
      const data = await GitHubAPI.fetchAll(username);
      renderProfile(data);
      renderLanguages(data.languages);
      renderTopRepos(data.topRepos);

      // Generate README
      currentMarkdown = ReadmeGenerator.generate(data);
      renderReadme(currentMarkdown);

      resultsSection.hidden = false;
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ---- Renderers ----
  function renderProfile(data) {
    const { user, totalStars } = data;
    avatarImg.src = user.avatar_url;
    avatarImg.alt = `${user.login}'s avatar`;
    profileName.textContent = user.name || user.login;
    profileBio.textContent = user.bio || "No bio provided.";
    statRepos.textContent = user.public_repos;
    statStars.textContent = formatNumber(totalStars);
    statFollowers.textContent = formatNumber(user.followers);
    statFollowing.textContent = formatNumber(user.following);
  }

  function renderLanguages(languages) {
    languagesChart.innerHTML = "";
    const top = languages.slice(0, 8);
    if (!top.length) {
      languagesChart.innerHTML = '<p style="color:var(--text-muted)">No language data found.</p>';
      return;
    }

    for (const lang of top) {
      const row = document.createElement("div");
      row.className = "lang-row";
      row.innerHTML = `
        <span class="lang-name">${lang.name}</span>
        <div class="lang-bar-bg">
          <div class="lang-bar" style="width:0%;background:${lang.color}"></div>
        </div>
        <span class="lang-pct">${lang.pct}%</span>
      `;
      languagesChart.appendChild(row);

      // Animate bar after append
      requestAnimationFrame(() => {
        row.querySelector(".lang-bar").style.width = `${lang.pct}%`;
      });
    }
  }

  function renderTopRepos(repos) {
    topReposContainer.innerHTML = "";
    if (!repos.length) {
      topReposContainer.innerHTML = '<p style="color:var(--text-muted)">No repositories found.</p>';
      return;
    }

    for (const repo of repos) {
      const card = document.createElement("div");
      card.className = "repo-card";
      card.innerHTML = `
        <div class="repo-name">
          <a href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener">${escapeHTML(repo.name)}</a>
        </div>
        <div class="repo-desc">${escapeHTML(repo.description || "No description")}</div>
        <div class="repo-meta">
          ${repo.language ? `<span><span style="color:${LANG_COLORS[repo.language] || 'var(--text-muted)'}">●</span> ${escapeHTML(repo.language)}</span>` : ""}
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      `;
      topReposContainer.appendChild(card);
    }
  }

  function renderReadme(markdown) {
    // Preview (rendered HTML)
    if (typeof marked !== "undefined") {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      readmePreview.innerHTML = marked.parse(markdown);
    } else {
      readmePreview.textContent = markdown;
    }
    // Raw
    readmeRaw.textContent = markdown;
  }

  // ---- Actions ----
  async function handleCopy() {
    if (!currentMarkdown) return;
    try {
      await navigator.clipboard.writeText(currentMarkdown);
      showToast("Copied to clipboard!");
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = currentMarkdown;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Copied to clipboard!");
    }
  }

  function handleDownload() {
    if (!currentMarkdown) return;
    const blob = new Blob([currentMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("README.md downloaded!");
  }

  // ---- Helpers ----
  function setLoading(loading) {
    generateBtn.disabled = loading;
    btnText.hidden = loading;
    btnLoader.hidden = !loading;
  }

  function showError(msg) {
    errorMsg.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' +
      '<span>' + escapeHTML(msg) + '</span>';
    errorMsg.hidden = false;
    usernameInput.closest(".input-wrapper").classList.add("input-error");
    usernameInput.focus();
    usernameInput.select();
  }

  function hideError() {
    errorMsg.hidden = true;
    usernameInput.closest(".input-wrapper").classList.remove("input-error");
  }

  function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(n);
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
})();
