# Anika Kapasi Portfolio

A dependency-free static portfolio site. GitHub Pages serves `index.html` as the
entry point and deploys directly from the `main` branch.

## Local preview

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/` in a browser.

## GitHub Pages

After pushing this folder to a GitHub repository, enable **Settings → Pages →
Build and deployment → Source: Deploy from a branch**, then choose **main** and
**/(root)**. `CNAME` is already configured for `anikakapasi.com`; add its DNS
record after the first successful deployment.
