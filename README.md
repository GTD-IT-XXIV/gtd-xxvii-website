# GTD XXVII Website

## Table of Content

- [Project Setup](#project-setup)
  - [Prerequisites](#prerequisites)
  - [Setting Up](#setting-up)
  - [Additional Tools](#additional-tools)
    - [Prisma Studio](#prisma-studio)
- [Workflow](#workflow)
  - [Git & GitHub](#git--github)
  - [Style Guide](#style-guide)
- [Troubleshooting](#troubleshooting)
  - [Merge conflicts in `pnpm-lock.yaml`](#merge-conflicts-in-pnpm-lockyaml)
  - [Error running development server or husky](#error-running-development-server-or-husky)
  - [Database errors](#database-errors)
  - [Save storage space](#save-storage-space)
- [Learn More](#learn-more)

## Project Setup

### Prerequisites

1. Install Node Version Manager (NVM). Installation: [macOS/Linux](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating), [Windows](https://github.com/coreybutler/nvm-windows?tab=readme-ov-file#overview).
2. Install Node.js Iron (LTS):

```bash
# For macOS/Linux
nvm install --lts=iron
nvm use --lts=iron
```

```pwsh
# For Windows
nvm install lts
nvm use lts
```

3. Install pnpm using Corepack (or alternatively, [using npm](https://pnpm.io/installation#using-npm)):

```bash
corepack enable pnpm
```

4. Install Docker. Installation: [macOS](https://docs.docker.com/desktop/install/mac-install/), [Linux](https://docs.docker.com/desktop/install/linux-install/), [Windows](https://docs.docker.com/desktop/install/windows-install/).

### Setting Up

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` contents to `.env` and fill the environment variables

```bash
# For macOS/Linux
cp .env.example .env.development.local
```

```pwsh
# For Windows
copy .env.example .env.development.local
```

3. Start the development database:

```bash
docker compose up
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Additional Tools

#### Prisma Studio

See development database contents:

```bash
pnpx prisma studio
```

## Workflow

### Git & GitHub

1. Create new feature branch with the following format `name/feature` and push the new branch to remote (this repository):

```bash
git checkout -b alice/homepage
git push -u origin alice/homepage
```

2. Stage changes, commit on your feature branch, and push to remote (note: do not commit on `main` branch):

```bash
git add .
git commit -m "feat: add homepage"
git push
```

### Style Guide

- Use kebab case to name files, e.g., `leaderboard-router.ts`
- Use kebab case + full component name for component files, e.g., `button-group-card.tsx` for `<ButtonGroupCard />`
- Use import aliases instead of relative paths for package imports, e.g. `import { Button } from "@/components/ui/button";`
- Git commits style guide: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- Use TypeScript types instead of interfaces unless necessary ([_why?_](https://youtu.be/zM9UPcIyyhQ?si=TI7vrg4OZAOpBd1x))
- Use [`function` declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) for React components and event handlers
  - Learn more: [`function` declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting) vs [`function` expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function) vs [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

## Troubleshooting

### Merge conflicts in `pnpm-lock.yaml`

1. pnpm can automatically resolve lockfile conflicts. Run:

```bash
pnpm install
```

2. Stage and commit the lockfile:

```bash
git add pnpm-lock.yaml
git commit -m "chore: resolve lockfile conflict"
```

### Error running development server or husky

1. Remove the `.next` folder:

```bash
rm -rf .next
```

2. Retry.

### Database errors

1. Reset the development database by first removing the image

2. Restart the development database:

```bash
docker compose up
```

### Save storage space

1. Remove unused packages:

```bash
pnpm prune
```

2. Remove unused and dangling Docker containers and images:

```bash
docker system prune
```

## Learn More

- Learning resources: [github.com/GTD-IT-XXIV/gtd-xxvi-learning-resources](https://github.com/GTD-IT-XXIV/gtd-xxvi-learning-resources)
- Learning articles:
  - [Making Sense of React Server Components](https://www.joshwcomeau.com/react/server-components/)
  - [Server and Client Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- Official documentation: [Tailwind CSS](https://tailwindcss.com/docs/utility-first), [shadcn/ui](https://ui.shadcn.com/docs/cli), [Next.js](https://nextjs.org/docs), [Prisma](https://www.prisma.io/docs/orm)
