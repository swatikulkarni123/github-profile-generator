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

## How to Create Your GitHub Profile README (Step by Step)

### Step 1 — Generate Your README

1. Open the app: **[Try It Live](https://swatikulkarni123.github.io/github-profile-generator/)**
2. Type your **GitHub username** in the input field
3. Click **Generate README** (or press Enter)
4. The app will fetch your profile, repos, languages, and stars automatically
5. Scroll down to see the **generated README preview**

### Step 2 — Copy or Download

You have two options:

- **Copy** — Click the **Copy** button to copy the raw markdown to your clipboard
- **Download** — Click the **Download README.md** button to save it as a file

### Step 3 — Create Your Profile Repository on GitHub

GitHub shows a special README on your profile page. To set it up:

1. Go to **[github.com/new](https://github.com/new)** to create a new repository
2. Set the **Repository name** to **exactly your GitHub username**
   - Example: if your username is `johndoe`, name the repo `johndoe`
3. Make sure it is set to **Public**
4. Check the box **"Add a README file"**
5. Click **Create repository**

> GitHub will show a message: *"johndoe/johndoe is a special repository — its README.md will appear on your profile!"*

### Step 4 — Paste Your Generated README

1. Open the repository you just created (`github.com/YOUR_USERNAME/YOUR_USERNAME`)
2. Click the **pencil icon** (Edit) on the `README.md` file
3. **Select all** the existing content and **delete it**
4. **Paste** the markdown you copied from the generator (Ctrl+V / Cmd+V)
5. Click **Commit changes**
6. Add a commit message like "Add profile README" and click **Commit changes**

### Step 5 — View Your Profile

1. Go to **github.com/YOUR_USERNAME**
2. Your new profile README is now live!
3. You should see your bio, stats, tech stack, top projects, trophies, and more

### Want to Update It Later?

Just come back to the generator, enter your username again, and repeat Steps 2 and 4. Your stats, repos, and trophies will be refreshed with the latest data.

---

## What Your Generated README Includes

| Section | Description |
|---------|-------------|
| **Header** | Animated wave, your name, and bio |
| **Social Badges** | Followers count, profile views |
| **About Me** | Repos, stars, location, company, blog link |
| **Tech Stack** | Language and framework badges auto-detected from your repos |
| **Top Projects** | Table of your best repos with stars and language |
| **GitHub Stats** | Total stars, repos, followers, and forks (shields.io badges) |
| **Top Languages** | Percentage breakdown with color-coded badges |
| **Streak Stats** | Current streak, longest streak, total contributions |
| **Trophies** | Achievement badges based on your actual stats (stars, repos, followers, languages, forks, account age) |
| **Connect** | Links to your GitHub, Twitter, website, and email |

Everything is generated from your **real GitHub data** — no fake numbers, no manual editing needed.

---

## Example

Enter username `torvalds` and you get a complete profile README with:

- Stats badges showing **228K+ stars**, **8 repos**, **284K+ followers**
- Language badges for **C**, **Shell**, etc.
- Trophy badges like **Star Legend**, **GitHub Celebrity**, **GitHub Pioneer**
- Top projects table with **linux**, **subsurface**, etc.
- And more — all auto-generated

---

## Features

- **No login required** — uses GitHub public API only
- **No dependencies** — runs entirely in the browser
- **Dark theme** with GitHub-inspired design
- **Responsive** — works on mobile, tablet, and desktop
- **Live preview** — see the rendered README before copying
- **One-click copy** or **download** the README.md file
- **Smart detection** — infers frameworks (React, Docker, AWS, etc.) from your repo names and topics
- **Native stats** — uses shields.io badges that always load (no broken images)
- **Achievement trophies** — tiered badges based on your real GitHub milestones
- **Rate limit friendly** — only 2 API calls per generation

---

## API Rate Limits

The GitHub public API allows **60 requests/hour** without authentication. Each generation uses 2 requests (user + repos). If you hit the limit, wait a few minutes.

---

## Deploy to GitHub Pages

If you forked this repo and want to host your own version:

1. Go to your repo on GitHub
2. If the code is on a feature branch, **merge it to `main`** first
3. Go to **Settings > Pages**
4. Under **Source**, select **Deploy from a branch**
5. Pick **`main`** branch, **`/ (root)`** folder, click **Save**
6. Wait ~2 minutes — your site is live

---

## License

MIT License. Free to use, modify, and distribute.
