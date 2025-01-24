# README.md

# Discord Music Bot

A simple Discord bot that streams songs from a specified voice channel using MP3 files stored in the `data` folder. The bot allows users to add and remove songs dynamically.

> NOTE: I made this in an hour, the code is not polished and there are a lot of things I'd do differently if I made this for a production environment .

> ANOTHER NOTE: The bot is coded in with a certain.. personality.. if you don't like a brainrotted bratty bot then just change the responses in the `messanger.ts` file.

## Features

- Stream MP3 files in a voice channel.
- Add songs via URL or as attachments.
- Remove songs by name.
- List all available songs.

## Prerequisites

- Node.js
- pnpm (or just npm, but for the setup instructions I used pnpm)
- A Discord account and a server where you can add the bot
- A Discord bot token (you can get one [here](https://discord.com/developers/applications))

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/FraglyG/SimpleDiscordMusicBot
   cd discord-music-bot
   ```

2. **Install dependencies:**
   ```
   pnpm install
   ```

3. **Create a `.env` file:**
   Copy the `.env.example` to `.env` and fill in the required environment variables:
   ```
   BOT_TOKEN=your_bot_token
   CHANNEL_ID=your_voice_channel_id
   ADMIN_ID=bot_admin_ids,seperated_by_comma
   ```

4. **Run the bot:**
   ```
   pnpm start
   ```

## Usage

- To add a song, use the command:
  ```
  @YourBotName add <mp3_url_or_attachment>
  ```

- To remove a song, use the command:
  ```
  @YourBotName remove <mp3_name>
  ```

- To list all songs, use the command:
  ```
  @YourBotName list
  ```

- Other commands available via help command
   ```
   @YourBotName help
   ```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
