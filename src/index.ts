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

// TODO: assign classes (can't cause I have node_modules deleted and idrc to install them rn just to find the class names)
async function checkState(oldState: any, newState: any) {
    const channel = oldState.channelId == config.CHANNEL_ID
        ? oldState.channel
        : (newState.channelId == config.CHANNEL_ID ? newState.channel : null);

    if (!channel) return;

    // No one's in the channel other than the bot, so leave
    if (channel.members.size <= 1 && (musicPlayer.joined || musicPlayer.joining)) {
        if (musicPlayer.joined) return musicPlayer.leave();
        if (!musicPlayer.joining) return; // this would probs never happen

        // Currently joining, wait until done and then leave if joined
        await musicPlayer.waitUntil(() => !musicPlayer.joining).catch(console.warn);
        if (musicPlayer.joined) checkState(oldState, newState);
        else if (musicPlayer.joining) console.warn(`Music player might be stuck on joining state`);
        return;
    }

    // Someone's in the channel (who isn't the bot) so join and start jamming
    if (channel.members.size >= 1 && !musicPlayer.joined && !musicPlayer.joining) {
        try {
            await musicPlayer.join(config.CHANNEL_ID);
            musicPlayer.play();
        } catch (error) {
            console.error(`Error joining channel after user joined: ${error}`);
        }
        return;
    }
}

client.on("voiceStateUpdate", checkState)

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(`<@${client.user?.id}>`)) return;

    const admins = (config.ADMIN_ID as string).split(",").map(id => id.trim());
    if (!admins.includes(message.author.id)) return;

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
