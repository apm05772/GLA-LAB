# Publish with GitHub Pages

## 1. Test on your Linux MacBook first

From a terminal:

```bash
cd /path/to/chern-slope-lab-pages
./serve.sh
```

If that gives a permission error:

```bash
chmod +x serve.sh
./serve.sh
```

Then visit:

```text
http://localhost:8000
```

The site itself is local. Sage calculations still require internet access because they run on SageMathCell.

---

## 2. Create the GitHub repository

Recommended during active research: create a **private** repository first, e.g.

```text
chern-slope-research
```

On GitHub.com:

1. Click **New repository**.
2. Enter `chern-slope-research`.
3. Choose **Private** while the result is still under review.
4. Do **not** initialize it with a README, `.gitignore`, or license, because those files are already included here.
5. Create the repository.

GitHub Pages on a GitHub Free personal account normally requires a public repository. You can keep the research repository private now and make it public later, or publish a separate sanitized public Pages repository.

---

## 3. Turn this folder into a Git repository

Inside this project folder:

```bash
git init
git branch -M main
git add .
git commit -m "Initial Chern Slope Research Lab"
```

Set your identity if Git asks:

```bash
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR_GITHUB_EMAIL"
```

Then retry the commit.

---

## 4. Connect the repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/chern-slope-research.git
git push -u origin main
```

GitHub no longer accepts an account password for command-line HTTPS pushes. If your system does not already have GitHub authentication configured, use one of these approaches:

- authenticate with a GitHub Personal Access Token when prompted, or
- configure an SSH key and use the SSH remote shown by GitHub.

A simple alternative for the first upload is GitHub's **Add file → Upload files** interface in the browser.

---

## 5. Publish with GitHub Pages when you are ready

If you use GitHub Free, make the Pages repository public first.

Then on GitHub:

1. Open the repository.
2. Go to **Settings**.
3. Open **Pages** under **Code, planning, and automation**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main`.
6. Select folder `/ (root)`.
7. Click **Save**.

The resulting URL will normally be:

```text
https://YOUR_USERNAME.github.io/chern-slope-research/
```

Every later `git push` to `main` updates the site automatically.

---

## 6. Normal update workflow

After editing files:

```bash
git status
git add .
git commit -m "Describe what changed"
git push
```

For example:

```bash
git add .
git commit -m "Add generalized C2 experiment"
git push
```

---

## Important privacy note

GitHub Pages is a public website. Do not publish private notes, recommendation material, credentials, secrets, API keys, or anything else that should remain confidential.

This static prototype contains only research code and frontend files. It does not contain passwords or server credentials.
