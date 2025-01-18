import { Client, GatewayIntentBits } from "discord.js";
import config from "./config";
import { MusicPlayer } from "./modules/player";
import { getRandomMessage } from "./modules/messanger";
import { getCommand } from "./modules/commands";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

export const musicPlayer = new MusicPlayer({});

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    const channel = oldState.channelId == config.CHANNEL_ID
        ? oldState.channel
        : (newState.channelId == config.CHANNEL_ID ? newState.channel : null);

    if (!channel) return;

    // No one's in the channel other than the bot, so leave
    if (channel.members.size <= 1 && musicPlayer.joined) return musicPlayer.leave();

    // Someone's in the channel (who isn't the bot) so join and start jamming
    if (channel.members.size >= 1 && !musicPlayer.joined) {
        try {
            await musicPlayer.join(config.CHANNEL_ID);
            musicPlayer.play();
        } catch (error) {
            console.error(`Error joining channel after user joined: ${error}`);
        }
    }
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    const admins = (config.ADMIN_ID as string).split(",").map(id => id.trim());
    if (!admins.includes(message.author.id)) return;
    if (!message.content.startsWith(`<@${client.user?.id}>`)) return;

    const args = message.content.split(" ").filter(t => t.trim().length > 0);
    const commandName = args[1] ? args[1].trim() : undefined;
    const command = getCommand(commandName as any);

    if (!command) return;

    const passableArgs = args.slice(2);
    try {
        await command.run(message, passableArgs);
    } catch (error) {
        console.error("Error running command", error);
        message.reply(getRandomMessage("command_failure") + "\n\n Error: " + error);
    }
});

client.login(config.BOT_TOKEN);
