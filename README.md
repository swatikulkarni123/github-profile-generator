# GitHub Profile README Generator

> Generate a professional GitHub profile README in seconds — just enter a username.

<div align="center">

### [>> Try It Live <<](https://swatikulkarni123.github.io/github-profile-generator/)

**Click above to open the app — enter any GitHub username and get a full profile README instantly.**

</div>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=flat-square)

---

## What It Does

1. Enter any GitHub username
2. The app fetches **all public data** via the GitHub API:
   - Bio, location, company, website
   - All public repositories
   - Languages used across repos
   - Stars, followers, following
3. Analyzes top repositories and tech stack
4. Generates a **complete, professional README.md** with:
   - Animated header with wave emoji
   - Social badges (followers, profile views)
   - About Me section (auto-generated)
   - Tech stack with shields.io badges
   - Top projects table
   - GitHub stats cards (stats, top languages, streak)
   - Contribution activity graph
   - GitHub trophies
   - Contact/connect section
5. Live preview with rendered markdown
6. One-click **copy** or **download README.md**

---

## Live Demo

**[https://swatikulkarni123.github.io/github-profile-generator/](https://swatikulkarni123.github.io/github-profile-generator/)**

The input field auto-focuses on load — just type a GitHub username and press Enter.

> **First-time setup required** — see [Deploy to GitHub Pages](#deploy-to-github-pages) below to activate the live link.

### Deploy to GitHub Pages

1. Go to your repo on GitHub
2. If the code is on a feature branch, **merge it to `main`** first (open a Pull Request and merge)
3. Go to **Settings > Pages**
4. Under **Source**, select **Deploy from a branch**
5. Pick **`main`** branch, **`/ (root)`** folder, click **Save**
6. Wait ~2 minutes — your site is live at the URL above

---

## Setup (Local)

```bash
# Clone the repo
git clone https://github.com/swatikulkarni123/github-profile-generator.git
cd github-profile-generator

# Open in browser — that's it
open index.html
# or on Linux:
xdg-open index.html
```

No `npm install`. No build step. No backend. No API keys.

---

## Project Structure

```
github-profile-generator-ai/
├── index.html              # Single-page application
├── css/
│   └── style.css           # Dark theme with glassmorphism
├── js/
│   ├── app.js              # UI controller & event handling
│   ├── github-api.js       # GitHub API client
│   └── generator.js        # README markdown generator
├── assets/
│   └── favicon.svg         # App icon
└── README.md               # This file
```

---

## Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | HTML5, CSS3, Vanilla JS  |
| API       | GitHub REST API (public) |
| Markdown  | marked.js (CDN)         |
| Badges    | shields.io               |
| Stats     | github-readme-stats      |
| Hosting   | GitHub Pages (free)      |

**Zero dependencies installed.** Everything runs in the browser.

---

## Features

- **Dark theme** with GitHub-inspired design
- **Responsive** — works on mobile, tablet, desktop
- **Animated** language bars and smooth transitions
- **Profile card** with avatar, bio, and stats
- **Language analysis** with color-coded bar chart
- **Top repos grid** with stars and fork counts
- **Smart badge detection** — infers frameworks (React, Docker, etc.) from repo names/topics
- **Tabbed README view** — switch between rendered preview and raw markdown
- **Copy to clipboard** — one click
- **Download README.md** — one click
- **No login required** — uses GitHub public API only
- **Rate limit friendly** — minimal API calls

---

## How the README is Generated

The generator does NOT use any paid AI API. It works by:

1. **Fetching** user profile + all public repos from GitHub API
2. **Analyzing** languages (by repo size), top repos (by stars), and framework usage (by repo names/topics/descriptions)
3. **Mapping** detected languages to shields.io badge definitions
4. **Inferring** frameworks/tools (React, Docker, AWS, etc.) from repository metadata
5. **Assembling** markdown sections using templates with the user's real data
6. **Embedding** dynamic stats cards from github-readme-stats, streak-stats, and trophy services

The output is a complete, ready-to-use `README.md` that can be pasted directly into a GitHub profile repository.

---

## API Rate Limits

The GitHub public API allows **60 requests/hour** without authentication. Each generation uses 2 requests (user + repos). If you hit the limit, wait a few minutes.

To increase the limit to 5,000/hour, you can add a personal access token in the code (optional — not required for normal use).

---

## Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License. Free to use, modify, and distribute.
