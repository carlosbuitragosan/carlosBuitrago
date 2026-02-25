![Deploy](https://github.com/carlosbuitragosan/carlosBuitrago/actions/workflows/deploy.yml/badge.svg)


### 🚀 Deployment Workflow

This project uses continuous deployment via GitHub Actions and Hostinger FTP.

### 🔧 How It Works

- Develop locally using XAMPP (htdocs/ is symlinked to the local repo).
- On every push to the main branch:
- The showcase/ folder is deployed to public_html/ on Hostinger.
- The project1/ and project2/ folders are deployed to public_html/project1/ and public_html/project2/, respectively.
- Deployment is automated via GitHub Actions using a custom fork of ftp-deploy-action