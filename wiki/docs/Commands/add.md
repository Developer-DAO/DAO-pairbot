---
title: Add
sidebar_position: 1
---

import TOCInline from '@theme/TOCInline';
import useBaseUrl from '@docusaurus/useBaseUrl';

To run Pairbot or contribute you will need to fill out a few environment variables. We have included an example which contains all the variables needed. Duplicate  `.env.example` and rename it to `.env` to get started.

```bash title=".env"
CLIENT_ID=
DISCORD_TOKEN=
GUILD_ID=
DISCORD_CHANNEL_ID=
SUPABASE_ANON_KEY=
SUPABASE_URL=
```
## What goes into a `.env`?
To get Pairbot up and running it requires Discord configuration and Supabase configuration.
<TOCInline toc={toc[0].children} />

### Discord configurations
In this section we will need to create a Discord bot account and configure the following environment variables.

```bash title=".env"
CLIENT_ID=
DISCORD_TOKEN=
GUILD_ID=
DISCORD_CHANNEL_ID=
....
```

Head over to the [Developers Portal](https://discord.com/developers/applications) and click on the New Application button.
Enter a name you would like to give to your Pairbot and press create. Under settings (on the left hand side) click on the Bot tab.

<div align="center">
    <img src={useBaseUrl("/img/configuration/bot-tab.png")} alt="Bot tab image" />
</div>
<br/>

To the right you should click on the `Add Bot` button. Read the modal carefully and click on the `Yes, do it!` button if you agree. Congratualtions you have created an account for your Pairbot! Switch the `PUBLIC BOT` option to off. This will prevent other people from adding the bot to their own servers. This is important since you can't pair accross servers and will end up breaking things.

We will now need to give the Pairbot the right permissions and add it to our server. Click on the OAuth2 tab on the left hand side, under settings. After it has expanded click on the URL Generator tab.

<div align="center">
    <img src={useBaseUrl("/img/configuration/url-generator.png")} alt="Bot url generator image" />
</div>
<br/>

Select the following:

<div align="center">
    <img src={useBaseUrl("/img/configuration/bot-permissions.png")} alt="Bot permissions image" />
</div>
<br/>

Underneath you will see a generated url, click on the copy button and paste it into your preferred browser. You should see the following modal appear, when you are logged in.

<div align="center">
    <img src={useBaseUrl("/img/configuration/invite-modal.png")} alt="Bot Invite Modal" />
</div>
<br/>

Pick the server you would like to add the Pairbot to and click on `Continue`. Make sure to read all permissions that the Pairbot requires and click on `Authorize`. Congratulations you have added the bot to your own server!

We will now need to configure the Discord environment variables that we need for our Pairbot to run. To get these variables we will need to head back to the [Discord Developer Portal](https://discord.com/developers/applications). Click on the bot account you have just created and select the `OAuth2` tab on the right hand side under settings. This will automatically select the `General` tab underneath it.

<div align="center">
    <img src={useBaseUrl("/img/configuration/general-tab.png")} alt="Bot general tab" />
</div>
<br/>

Under `Client Information` you will see that the `CLIENT ID` variable can be copied. Click the copy button and paste it into your `.env` file.

```bash title=".env"
CLIENT_ID=934429555521108111
DISCORD_TOKEN=
GUILD_ID=
DISCORD_CHANNEL_ID=
....
```

Click on the Bot tab again, which can be found on the left hand side under settings. Click on the copy button underneath the `TOKEN` section and paste it into your `.env` file. 

```bash title=".env"
CLIENT_ID=934429555521108111
DISCORD_TOKEN=OTM0NDZZZZZZ4NzU2.Yev9Vg.nc0cXuWS1a8EK3duI-sfVvb6Xlk
GUILD_ID=
DISCORD_CHANNEL_ID=
....
```

We will now head over to our Discord server to find the last two variables we need. Right click on the server's icon and click on `Copy ID`. This is our Guild ID variable. 

<div align="center">
    <img src={useBaseUrl("/img/configuration/guildid.png")} alt="Bot Guild ID Variable" />
</div>
<br/>

```bash title=".env"
CLIENT_ID=934429555521108111
DISCORD_TOKEN=OTM0NDZZZZZZ4NzU2.Yev9Vg.nc0cXuWS1a8EK3duI-sfVvb6Xlk
GUILD_ID=883478451850473411
DISCORD_CHANNEL_ID=
....
```

Select your server and then right click on the channel you would like the bot to add threads to after people have succesfully been paired up. Choose again `Copy ID` and paste it into the `.env` file.

```bash title=".env"
CLIENT_ID=934429555521108111
DISCORD_TOKEN=OTM0NDZZZZZZ4NzU2.Yev9Vg.nc0cXuWS1a8EK3duI-sfVvb6Xlk
GUILD_ID=883478451850473411
DISCORD_CHANNEL_ID=908751196028801111
....
```

Congratulations on finishing the first part of the configration phase! 

### Supabase configurations
In this section we will need to configure the following environment variables.

```bash title=".env"
....
SUPABASE_ANON_KEY=
SUPABASE_URL=
```

Head over to [Supabase](https://supabase.com) and login / signup. Click on the `New Project` button and fill out the details and Click on `Create new projec button`. The free tier should be fine. 

On the right handside you should see an `anon` `public` section. Click on the `Copy` button right next to it and paste it in your `.env` file.

```bash title=".env"
....
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQyODYxMTEwLCJleHAiOjE5NTg0MzcxMTB9.vGhguKgBy-00rgygLtKiXGozCcPAisZV6odh-ZZZZ
SUPABASE_URL=
```

Scroll down to `Project Configuration` and copy the Supabase URL and paste it in the `.env` file.

```
....
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQyODYxMTEwLCJleHAiOjE5NTg0MzcxMTB9.vGhguKgBy-00rgygLtKiXGozCcPAisZV6odh-ZZZZ
SUPABASE_URL=https://edvrdZZZrkcbedqsuvur.supabase.co
```


## Setting up the Database

For our Pairbot to work we will need to add the right tables and relationships. Luckily for us it is as easy as copy, paste and run! In your DAO-pairbot directory you should see a database folder, inside there is a schema.sql. We will need to copy the content and paste it into our SQL Editor on [Supabase](https://supabase.com). Select the SQL Editor on the left hand side and then click on `New query` above the search box. Copy the contents of the schema.sql file and paste it into the editor and click on the `RUN` button middle right. Congratulations you have completelty setup the database's tables and relationships!

```sql title="schema.sql (might be outdated)"
create table public.developers (
  id bigint generated by default as identity primary key,
  discord text NOT NULL,
  discord_id text UNIQUE NOT NULL,
  skills varchar(300) NOT NULL,
  desired_skills varchar(300) NOT NULL,
  timezone varchar(15) NOT NULL,
  twitter varchar(15) NOT NULL,
  github varchar(39) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT FALSE,
  goal varchar (200) DEFAULT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

create table public.invites (
  id bigint generated by default as identity primary key,
  message_id text NOT NULL,
  sender_discord_id text NOT NULL,
  receiver_discord_id text NOT NULL,
  created_at timestamp NOT NULL,
  unique (sender_discord_id, receiver_discord_id),
  constraint fk_sender_discord_id
    foreign key (sender_discord_id)
      references developers(discord_id) on delete cascade,
  constraint fk_receiver_discord_id
    foreign key (receiver_discord_id) 
      references developers(discord_id) on delete cascade
)
```

## Problems? 

Ask for help on our [GitHub repository](https://github.com/developer-dao/DAO-pairbot)