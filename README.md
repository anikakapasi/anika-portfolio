# Anika Kapasi Portfolio

A dependency-free static portfolio site. GitHub Pages serves `index.html` as the
entry point and deploys every push to the `main` branch through the included
GitHub Actions workflow.

## Local preview

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/` in a browser.

## GitHub Pages

After pushing this folder to a GitHub repository, enable **Settings → Pages →
Build and deployment → Source: GitHub Actions**. The workflow in
`.github/workflows/deploy-pages.yml` publishes the static files. `CNAME` is
already configured for `anikakapasi.com`; add its DNS record after the first
successful deployment.
