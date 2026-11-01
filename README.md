# Punch Card

A small time-tracking app for logging your working hours. Start and stop a clock during the day, see how much of your work day is left, and review your history by week and year, including time in lieu.

Everything is stored in your browser's `localStorage`. There is no backend and no account.

## Tech stack

- [Next.js](https://nextjs.org/) (Pages Router) with [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Luxon](https://moment.github.io/luxon/) for date handling
- [Jest](https://jestjs.io/) for unit tests

## Getting started

This project uses Node 24 (the current LTS), pinned in `.nvmrc`. If you use [nvm](https://github.com/nvm-sh/nvm):

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
| `npm test`      | Run the unit tests with Jest                 |

## Project structure

```
components/   React components (Timer, WorkHistory, HistoryEditor)
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
