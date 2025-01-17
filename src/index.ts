import { Client, GatewayIntentBits } from "discord.js";
import config from "./config";
import { MusicPlayer } from "./modules/player";
import { addFileFromURL, removeFileFromName } from "./modules/filer";
import path from "path";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const possibleAddConfirmations = [
    `Bet bet, lemme lock in vro 🤝`,
    `I gotchu lemme rizz up the downloader rq`,
    `GYAAAT!!!! aight aight let me cook`,
    `What the freak is this skibidi ass song 💀 but aight`,
    `Bro wants to add music 😭 alright unc calm down lemme cook`,
    `Aight no glaze but that shit slaps, finna add it rq`,
    `Shouldn't you be working on Departed little bro? 😭 but aight`
]

const possibleAddSuccess = [
    `I'm so goated, gotta nerf my ass fr.. anyway I finished that shit`,
    `Aight im done, imma go back to gooning`,
    `Done!!!`,
    `Aight bruh, done\nNow let me goon PLEASEEEE`,
    `Stupid ass African thinks he can order me around tho, shit's crazy 😭 do it yourself next time blud`,
    `sigma sigma boy sigma boy sigma boy im done`
]

const possibleAddFailures = [
    `I just got edged, shit failed bro`,
    `Cooked... the download failed lol, good luck fixing that unc\nImma go back to mogging`,
    `Ermmm, it failed lol, bitch ass pussy couldn't even code a working music bot 😭`,
    `it failed little bro`,
    `Negative aura right there, it failed 💀💀💀`
]

// REMOVE SONGS

const possibleRemoveConfiramtions = [
    `Bro just broke my mewing streak to remove his stupid ah song 💀💀💀`,
    `BASED that song sucked lowkey, never add that shit again 😭 unc ass music`,
    `I knew u were tweaking adding that shit 💀 on gyat that shit was ass`,
    `Finally removing that mid ass song huh? Aight lemme cook`
]

const possibleRemoveSuccess = [
    `Aight im done`,
    `I cooked, eradicated it`,
    `Done!!!`,
]

const possibleRemoveFailures = [
    `Lowkey.. couldn't delete it lol, guess you're stuck with it now`,
    `it failed blud, whatever just keep it 😭`,
]


export const musicPlayer = new MusicPlayer({});

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);

    // try {
    //     musicPlayer.join(config.CHANNEL_ID);
    // } catch (error) {
    //     console.error(error);
    // }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    const channel = oldState.channelId == config.CHANNEL_ID
        ? oldState.channel
        : (newState.channelId == config.CHANNEL_ID ? newState.channel : null);

    if (!channel) return;
    // if (channel.members.size <= 1 && !musicPlayer.paused) musicPlayer.pause();
    // if (channel.members.size > 1 && (musicPlayer.paused || musicPlayer.stopped)) musicPlayer.play();
    if (channel.members.size <= 1) musicPlayer.leave();
    if (channel.members.size > 1 && !musicPlayer.joined) {
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
    if (message.author.id !== config.OWNER_ID) return;
    if (!message.content.startsWith(`<@${client.user?.id}>`)) return;

    const args = message.content.split(" ").filter(t => t.trim().length > 0);
    const command = args[1] ? args[1].trim() : undefined;

    if (!command) return;
    if (command == "ping") return message.reply("What's ahh baby girl?");
    if (command == "help") return message.reply(`Commands:\n- ping\n- add [url | attachments]\n- list\n- remove [name]\n- skip\n- join [channelId?]\n- leave`);

    if (command == "leave") return musicPlayer.leave();
    if (command == "join") {
        try {
            const channelId = args[2] ? args[2].trim() : undefined;
            if (!channelId) musicPlayer.join(config.CHANNEL_ID);
            else musicPlayer.join(channelId);
        } catch (error) {
            message.reply((error as any).message || "Unknown error");
        }
    }

    if (command == "list") {
        const playlist = await musicPlayer.getPlaylist({ getNames: true });
        if (playlist.length == 0) return message.reply("There aint nutn in the playlist rn");
        return message.reply(`Playlist:\n${playlist.map((p, i) => `- ${p}`).join("\n")}`);
    }

    if (command == "add") {
        const confirmation = possibleAddConfirmations[Math.floor(Math.random() * possibleAddConfirmations.length)];
        const success = possibleAddSuccess[Math.floor(Math.random() * possibleAddSuccess.length)];
        const failure = possibleAddFailures[Math.floor(Math.random() * possibleAddFailures.length)];

        if (message.attachments.size > 0) {
            message.reply(confirmation);

            const statuses = await Promise.all(message.attachments.map(async (attachment) => await addFileFromURL(attachment.url)));
            if (statuses.every(s => s)) message.reply(success);
            else message.reply(failure + `\n\nFailed:\n- ${statuses.map((s, i) => s ? undefined : `<${Array.from(message.attachments)[i][1].url}>`).filter(e => e).join("\n- ")}`);
        } else {
            // Check for URLs
            const validURLs = args.slice(2).map(a => a.trim()).filter(a => a.startsWith("http"));
            if (validURLs.length == 0) return message.reply(`tf? add??? add what nigga????`);

            const invalidURLs = validURLs.filter(a => !a.includes(".mp3"));
            if (invalidURLs.length > 0) return message.reply(`Nigga.. you're literally the one who coded me, how tf do you expect me to download a non-mp3 file 😭😭😭😭`);

            message.reply(confirmation);

            const statuses = await Promise.all(validURLs.map(addFileFromURL));
            if (statuses.every(s => s)) message.reply(success);
            else message.reply(failure + `\n\nFailed:\n- ${statuses.map((s, i) => s ? undefined : `<${validURLs[i]}>`).filter(e => e).join("\n- ")}`);
        }
    }

    if (command == "skip") {
        message.react("👌");
        musicPlayer.play();
    }

    if (command == "remove") {
        const name = args[2] ? args[2].trim() : undefined;
        if (!name) return message.reply("Remove what bro??");

        // exists?
        const playlist = await musicPlayer.getPlaylist({ getNames: true });
        if (!playlist.find(p => p == name || p == `${name}.mp3`)) return message.reply("That song ain't in the playlist bro");

        const confirmation = possibleRemoveConfiramtions[Math.floor(Math.random() * possibleRemoveConfiramtions.length)];
        const success = possibleRemoveSuccess[Math.floor(Math.random() * possibleRemoveSuccess.length)];
        const failure = possibleRemoveFailures[Math.floor(Math.random() * possibleRemoveFailures.length)];

        await message.reply(confirmation);

        const fileRemovedSuccess = await removeFileFromName(name);
        if (fileRemovedSuccess) {
            await musicPlayer.updatePlaylist();
            await message.reply(success);
        } else return message.reply(failure);
    }
});

client.login(config.BOT_TOKEN);
