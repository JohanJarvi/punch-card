# Punch Card

A small time-tracking app for logging your working hours. Start and stop a clock during the day, see how much of your work day is left, and review your history by week and year, including time in lieu.

You can export total hours per financial year (July to June, e.g. `Jul25-Jun26`) as a CSV.

Everything is stored in your browser's `localStorage`. There is no backend and no account.

Each day's total seconds are stored under an ISO day key for the **local** date (e.g. `2026-11-02`), so the stored data does not depend on the browser's locale or timezone. Dates are formatted for display in the user's locale. Data written by older versions under locale-formatted keys (e.g. `2/11/2026`) is migrated automatically on load, and a copy of the original values is kept under `punch-card:backup:legacy-day-keys`.

## Tech stack

- [Next.js](https://nextjs.org/) (Pages Router) with [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Luxon](https://moment.github.io/luxon/) for date handling
- [Jest](https://jestjs.io/) for unit tests

## Getting started

This project uses Node 24 (the current LTS), pinned in `.nvmrc` and in `engines` in `package.json` (which is what Vercel uses to pick the Node version). If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page reloads as you edit files.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the development server                 |
| `npm run build` | Create an optimised production build         |
| `npm start`     | Serve the production build (run `build` first) |
| `npm run lint`  | Lint the project with ESLint                 |
| `npm run typecheck` | Type-check with TypeScript               |
| `npm test`      | Run the unit tests with Jest                 |

## Dependencies and security

- CI (GitHub Actions) runs typecheck, lint, tests and a production build on every PR and on pushes to `main`.
- A separate GitHub Action runs `npm audit --omit=dev` on every PR, on pushes to `main` and weekly, and fails if a dependency that ships in the app has a known vulnerability.
- Dev-only tooling (ESLint, Jest) is excluded on purpose: findings there are not reachable from the deployed app, and some have no upstream fix yet. Do not run `npm audit fix --force` to clear them, as it suggests downgrading ESLint and Jest.
- Dependabot opens weekly PRs for dependency and GitHub Actions updates, with minor and patch bumps grouped into one PR.

## Project structure

```
components/   React components (Timer, WorkHistory, HistoryEditor, Export)
models/       Shared TypeScript types
pages/        Next.js pages (index, _app, _document)
styles/       Global styles and Tailwind directives
utils/        Date and time helpers, with their tests
```

The `@/` import alias resolves to the project root.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
- [Luxon documentation](https://moment.github.io/luxon/#/)
