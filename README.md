# Enabled Talent Career Centre Dashboard (Frontend)

Frontend-stack for dashboard has been implemented.
Built with **React (w/typescirpt) + Vite + Tailwind CSS (v4)**. This implementation will be focused first on doing the front-end side of the dashboard.

---

# Tech Stack

- **React + typescirpt** (UI)
- **Vite** (dev server + build)
- **Tailwind CSS v4** (styling)
- **lucide-react** (icons)
- (Planned) **Recharts** (charts)

---

# Prerequisites

Install the following:

- **Node.js (LTS recommended)**  
  Verify:

  ```bash
  node -v
  npm -v

  After that, use cd enabled-talent-dashboard to install the following:
    npm install - For node modules
    npm i -D tailwindcss autoprefixer - installing tailwindcss
  ```

To verify the installation of Tailwind, run this:
- npm ls tailwindcss

# (Backend)

Backend-stack for dashboard has been implemented.
Built with **Node.js + Express + TypeScript.** This implementation will focus on handling server-side logic, API routes, and future database integration.

---


# Tech Stack

- **Node.js** (runtime)
- **Express** (API framework)
- **TypeScript** (type safety)
- **dotenv** (environment variables)
- **cors** (cross-origin requests support)
- (Planned) Database Integration

 ---
 
# Prerequisites

  Install the following:
  **Node.js** (LTS recommended)
  ```bash
  Verify:
  node -v
  npm -v
```

Use cd Backend to install the following:
 ```bash
  npm init -y - initialize backend project
  npm i express cors dotenv - install runtime dependencies
  npm i -D typescript ts-node-dev @types/node @types/express - install dev dependencies
  npx tsc --init - initialize TypeScript configuration
   ```

To run the backend in development mode, run this:
- npm run dev
