assets/

Project assets that will be processed by the bundler (Vite).
Examples:

Images used inside components (logo.svg, background.png)

Icons or SVGs imported in React code

Fonts loaded with CSS (/fonts/...)

Small JSON or data files imported by code

👉 Think: Assets you import into React/TypeScript, which get optimized (hashed filenames, compressed) when building.

🔑 Rule of thumb:

Use public/ for static files that need to keep their filename/path.

Use src/assets/ for assets imported in your code and bundled/optimized.
