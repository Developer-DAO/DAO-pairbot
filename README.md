<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contributors-">Contributors</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


## About The Project
The idea behind the bot is to help people collaborate, learn and in the end make new friends. Especially now in the beginning where everything feels chaotic and you don’t know where to begin. The idea is that you can use the bot to see what other people are busy building and if they are available you can join and help build something awesome together.

### Built With
- TypeScript
- Discord.js
- Supabase 
  
## Getting Started
### Prerequisites
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
- [Node.js](https://nodejs.org/en/download/) (16.13.0)
- [Supabase Account](https://app.supabase.io/)

### Installation
  1. Clone the repo
   ```sh
   git clone https://github.com/Developer-DAO/DAO-pairbot.git
   ```
  2. Change directory and install NPM packages
   ```sh
   cd DAO-pairbot && npm install
   ```
  3. Create a new Supabase project. We will need the Superbase Url and Anon Key to put in our .env file later.
  4. Copy the snippet from SQL-snippets and paste in the SQL Editor on Supabase and click run.
  5. Copy .env.example to .env We will fill it in with your details from Supabase details from before and your Discord details in the next few steps.
  5. In the discord desktop app, create your own discord server to use for testing.
  6. Enable Developer mode in your Discord desktop app by going to User Settings > Advanced > Enabled 'Developer Mode'
  7. Right click on the server name and click Copy ID. This is the Guild Id in .env
  8. Right click on the 'general' channel and click Copy ID. This is the Discord channel id in .env
  9. Finally we need to [create a Discord app](https://discord.com/developers/applications) in the Discord developer area. Call it pairapp or something.
  10. Once you have created the app, get the Application Id. This is on the General information tab and can be used as Client ID in .env.
  11. Next, click the Bot tab on the left and add a new bot. In this tab there is a Copy and Regenerate button with a link above them to reveal a bot. Click that link and use the revealed token as DISCORD_TOKEN in .env
  12. Lastly click the OAuth tab and then the sub tab for URL Generator. Select 'bot' and 'application.commands' in the top perms and then a new box will appear, select 'Administrator' in the bottom box. Copy the url into your web browser and then navigate to it, selecting your test Discord server when prompted. This will add the bot to your test server. 
  

## Usage
These are the current commands the bot supports:
- `/add` - Add yourself to the pairing database
- `/edit` - Edit your profile on the pairing database
- `/available` - Set yourself as available
- `/unavailable` - Set yourself as unavailable
- `/developers all` - List all developers in the paring database 
- `/developers available` - List all available developers in the pairing database
- `/invite` - Invite an available developer to pair up with
- `/remove` - Remove yourself from the pairing database

## Roadmap
- [ ] Finish basic features
- [ ] Add Projects
- [ ] Add Website Interface
- [ ] Add User analytics to Website
- [ ] Add Project analytics to Website
## Contributing
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://buxmann.dev"><img src="https://avatars.githubusercontent.com/u/21178318?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin Buxmann</b></sub></a><br /><a href="https://github.com/Developer-DAO/DAO-pairbot/commits?author=mbuxmann" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Calvaz"><img src="https://avatars.githubusercontent.com/u/44518734?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Calvaz</b></sub></a><br /><a href="https://github.com/Developer-DAO/DAO-pairbot/commits?author=Calvaz" title="Code">💻</a></td>
    <td align="center"><a href="https://jimthedev.com"><img src="https://avatars.githubusercontent.com/u/108938?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jim Cummins</b></sub></a><br /><a href="https://github.com/Developer-DAO/DAO-pairbot/commits?author=jimthedev" title="Documentation">📖</a></td>
    <td align="center"><a href="http://cachemon.eth"><img src="https://avatars.githubusercontent.com/u/90769841?v=4?s=100" width="100px;" alt=""/><br /><sub><b>cachemon.eth</b></sub></a><br /><a href="https://github.com/Developer-DAO/DAO-pairbot/commits?author=cachemonet0x0CF6619" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
## License
## Contact
## Acknowledgments
