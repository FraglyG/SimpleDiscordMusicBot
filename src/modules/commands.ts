import { Message } from "discord.js";
import { getRandomMessage } from "./messanger";
import { addFilesFromURL, removeFileFromName } from "./filer";
import { musicPlayer } from "..";
import config from "../config";

type Command = {
    description: string;
    args?: string[];
    run: (message: Message, args: string[]) => any | Promise<any>;
}

const commandDatabase = {
    ping: {
        description: `Pings the bot`,
        run: (message: Message) => message.reply(getRandomMessage("ping")),
    } as Command,

    help: {
        description: `Lists all commands`,

        run: (message: Message) => {
            const commands = Object.entries(commandDatabase);
            const commandList = commands.map(([command, { description, args }]) => {
                return `- ${command}${args ? ` ${args.join(" ")}` : ""}\n  - ${description}`;
            }).join("\n");

            message.reply(`Commands:\n${commandList}`);
        }
    } as Command,

    add: {
        description: `Adds a song to the playlist`,
        args: ["url | attachments"],
        run: async (message: Message, args: string[]) => {
            if (message.attachments.size > 0) {
                message.reply(getRandomMessage("add_confirm"));

                const urls = message.attachments.map(a => a.url);
                const statuses = await addFilesFromURL(urls);

                if (statuses.every(s => s)) message.reply(getRandomMessage("add_success"));
                else message.reply(getRandomMessage("add_fail") + `\n\nFailed:\n- ${statuses.map((s, i) => s ? undefined : `<${urls[i]}>`).filter(e => e).join("\n- ")}`);
            } else {
                // Check for URLs
                const validURLs = args.map(a => a.trim()).filter(a => a.startsWith("http"));
                if (validURLs.length == 0) return message.reply(getRandomMessage("add_no_urls"));

                const invalidURLs = validURLs.filter(a => !a.includes(".mp3"));
                if (invalidURLs.length > 0) return message.reply(getRandomMessage("add_invalid_urls"));

                message.reply(getRandomMessage("add_confirm"));

                const statuses = await addFilesFromURL(validURLs);
                if (statuses.every(s => s)) message.reply(getRandomMessage("add_success"));
                else message.reply(getRandomMessage("add_fail") + `\n\nFailed:\n- ${statuses.map((s, i) => s ? undefined : `- <${validURLs[i]}>`).filter(e => e).join("\n")}`);
            }
        }
    } as Command,

    remove: {
        description: `Removes a song from the playlist`,
        args: ["name"],
        run: async (message: Message, args: string[]) => {
            const name = args[0] ? args[0].trim() : undefined;
            if (!name) return message.reply("Remove what bro??");

            // exists?
            const playlist = await musicPlayer.getPlaylist({ getNames: true });
            if (!playlist.find(p => p == name || p == `${name}.mp3`)) return message.reply(getRandomMessage("remove_not_exist"));

            // remove
            await message.reply(getRandomMessage("remove_confirm"));

            const fileRemovedSuccess = await removeFileFromName(name);
            if (fileRemovedSuccess) {
                await musicPlayer.updatePlaylist();
                await message.reply(getRandomMessage("remove_success"));
            } else return message.reply(getRandomMessage("remove_fail"));
        }
    } as Command,

    list: {
        description: `Lists all songs in the playlist`,
        run: async (message: Message) => {
            const playlist = await musicPlayer.getPlaylist({ getNames: true });
            if (playlist.length == 0) return message.reply(getRandomMessage("nothing_in_playlist"));
            return message.reply(`Playlist:\n${playlist.map(p => `- ${p}`).join("\n")}`);
        }
    } as Command,

    skip: {
        description: `Skips the current song`,
        run: (message: Message) => {
            message.react("👌");
            musicPlayer.play();
        }
    } as Command,

    stop: {
        description: `Stops the current song`,
        run: (message: Message) => {
            message.react("👌");
            musicPlayer.stop();
        }
    } as Command,

    join: {
        description: `Joins a voice channel`,
        args: ["channelId?"],
        run: async (message: Message, args: string[]) => {
            const channelId = args[0] ? args[0].trim() : undefined;
            let joinResult: { success: boolean, error?: string };
            if (!channelId) joinResult = await musicPlayer.join(config.CHANNEL_ID);
            else joinResult = await musicPlayer.join(channelId);
            if (!joinResult.success) return message.reply(joinResult.error || "Unknown Error");
        }
    } as Command,

    leave: {
        description: `Leaves the voice channel`,
        run: (message: Message) => {
            message.react("👌");
            musicPlayer.leave();
        }
    } as Command,
}

export function getCommand(name: keyof typeof commandDatabase) {
    if (!name) return;
    return commandDatabase[name] as Command | undefined;
}