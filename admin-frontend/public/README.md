public/

Static files served as-is, outside of the bundling pipeline.
Examples:

favicon.ico

robots.txt

manifest.json (PWA install settings)

Static logos or images that must be available at a fixed path (/logo.png)

👉 Think: Files the browser can fetch directly by URL without going through React.

🔑 Rule of thumb:

Use public/ for static files that need to keep their filename/path.

Use src/assets/ for assets imported in your code and bundled/optimized.
