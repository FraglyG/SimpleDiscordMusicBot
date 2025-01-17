# README.md

# Discord Music Bot

A simple Discord bot that streams songs from a specified voice channel using MP3 files stored in the `data` folder. The bot allows users to add and remove songs dynamically.

> NOTE: I made this in an hour, the code is not polished and there are a lot of things I'd do differently if I made this for a production environment 

## Features

- Stream MP3 files in a voice channel.
- Add songs via URL or as attachments.
- Remove songs by name.
- List all available songs.

## Prerequisites

- Node.js
- A Discord account and a server where you can add the bot
- A Discord bot token (you can get one [here](https://discord.com/developers/applications))

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd SimpleDiscordMusicBot
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Create a `.env` file:**
   Copy the `.env.example` to `.env` and fill in the required environment variables:
   ```
   BOT_TOKEN=your_bot_token
   CHANNEL_ID=your_voice_channel_id
   OWNER_ID=bot_owner_or_admin_id
   ```

4. **Run the bot:**
   ```
   npm start
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