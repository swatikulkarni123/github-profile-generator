/**
 * GitHub Public API client.
 * Fetches user profile, repositories, and computes language stats.
 * No authentication required — uses only public endpoints.
 */

const GitHubAPI = (() => {
  const BASE = "https://api.github.com";

  /**
   * Fetch JSON from GitHub API with basic error handling.
   */
  async function fetchJSON(url) {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (res.status === 404) throw new Error("User not found. Check the username and try again.");
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded. Wait a minute and try again.");
    if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
    return res.json();
  }

  /**
   * Get user profile data.
   */
  async function getUser(username) {
    return fetchJSON(`${BASE}/users/${encodeURIComponent(username)}`);
  }

  /**
   * Get all public repos (up to 100, sorted by stars).
   */
  async function getRepos(username) {
    return fetchJSON(
      `${BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&direction=desc`
    );
  }

  /**
   * Aggregate language stats across all repos.
   * Returns sorted array: [{ name, bytes, pct, color }]
   */
  function computeLanguages(repos) {
    const langBytes = {};
    for (const repo of repos) {
      if (repo.language) {
        langBytes[repo.language] = (langBytes[repo.language] || 0) + (repo.size || 1);
      }
    }

    const total = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(langBytes)
      .map(([name, bytes]) => ({
        name,
        bytes,
        pct: ((bytes / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.bytes - a.bytes);

    // Assign colors
    const colors = [
      "#58a6ff", "#3fb950", "#d29922", "#f85149", "#bc8cff",
      "#f778ba", "#79c0ff", "#7ee787", "#e3b341", "#ff7b72",
    ];
    return sorted.map((lang, i) => ({
      ...lang,
      color: LANG_COLORS[lang.name] || colors[i % colors.length],
    }));
  }

  /**
   * Pick top N repos by stargazers_count, then by updated_at.
   */
  function topRepos(repos, n = 6) {
    return [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
      .filter((r) => !r.fork)
      .slice(0, n);
  }

  /**
   * Calculate total stars across all repos.
   */
  function totalStars(repos) {
    return repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  }

  /**
   * Fetch everything needed for README generation.
   */
  async function fetchAll(username) {
    const [user, repos] = await Promise.all([getUser(username), getRepos(username)]);
    const languages = computeLanguages(repos);
    const top = topRepos(repos);
    const stars = totalStars(repos);

    return { user, repos, languages, topRepos: top, totalStars: stars };
  }

  return { fetchAll };
})();

/* ---------- GitHub language colors (common ones) ---------- */
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Lua: "#000080",
  Scala: "#c22d40",
  R: "#198CE7",
  Perl: "#0298c3",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Vim: "#199f4b",
  "Vim Script": "#199f4b",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  SCSS: "#c6538c",
  PowerShell: "#012456",
  Dockerfile: "#384d54",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  Objective: "#438eff",
  "Objective-C": "#438eff",
  Zig: "#ec915c",
  Nim: "#ffc200",
  OCaml: "#3be133",
  Erlang: "#B83998",
  Assembly: "#6E4C13",
};
