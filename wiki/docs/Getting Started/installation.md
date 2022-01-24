---
title: Installation
sidebar_position: 1
---

# Installation


## Requirements

- [Node.js](https://nodejs.org/en/download/) version >= 16 or above (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed.
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- [Yarn](https://yarnpkg.com/en/) version >= 1.5 (which can be checked by running `yarn --version`). Yarn is a performant package manager for JavaScript and replaces the `npm` client. It is not strictly necessary but highly encouraged.
- [Discord bot](https://discord.com/developers/applications) account.
- [Supabase](https://supabase.com/) account.

## Project structure 

```bash
DAO-PAIRBOT
├── commands
│   ├── add.ts
│   ├── available.ts
│   ├── developers.ts
│   ├── edit.ts
│   ├── index.ts
│   ├── invite.ts
│   ├── invites.ts
│   ├── remove.ts
│   ├── unavailable.ts
│   └── view.ts
├── components
│   ├── developerEmbed.ts
│   ├── developersPaginator.ts
│   ├── inviteDeveloper.ts
│   ├── invitesPaginator.ts
│   └── skills.ts
├── database
│   ├── database.ts
│   ├── index.ts
│   └── schema.sql
├── events
│   ├── index.ts
│   ├── interactionCreate.ts
│   └── ready.ts
├── utils
│   ├── classes.ts
│   ├── githubHandle.ts
│   ├── index.ts
│   ├── scheduledJobs.ts
│   └── twitterHandle.ts
├── wiki
├── .all-contributorsrc
├── .env.example
├── .gitignore
├── index.ts
├── package.json
├── Procfile
├── README.md
├── tsconfig.json
└── yarn.lock
```

### Project structure rundown

- `/commands/` - Contains the commands.
- `/components/` - Contains the custom made components.
- `/database/` - Contains the necessary database files and schema to setup Supabase database.
- `/events/` - Contains the events.
- `/utils/` - Contain helper files.
- `/.env.example` - Example of how the .env files should look like and all variables needed to run Pairbot.
- `/index.ts` - Is the entry file to the Pairbot.
- `/package.json` - Contains all the node modules required to run the pairbot.
- `/Profcfile` - Contains the command that Heroku needs to run the bot.
  
## Install

Pairbot requires a few packges to work. To install these packages:

```bash npm2yarn
npm install
```

## Problems? 

Ask for help on our [GitHub repository](https://github.com/developer-dao/DAO-pairbot)