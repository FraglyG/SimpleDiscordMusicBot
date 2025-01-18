import { ChannelType } from "discord.js";
import { joinVoiceChannel, VoiceConnection, createAudioPlayer, AudioPlayerStatus, AudioPlayer, AudioResource, createAudioResource } from "@discordjs/voice";
import { client } from "..";
import fs from "fs/promises";
import path from "path";

export type MusicPlayerConfig = {
};

export class MusicPlayer {
    private config: MusicPlayerConfig;
    paused = false;
    stopped = true;
    joined = false;

    private player: AudioPlayer;
    private playlist: string[] = [];
    private currentPlaylistIndex = 0;

    private joinedConfig: {
        channelId: string;
        connection: VoiceConnection;
    } | null = null;

    constructor(config: MusicPlayerConfig) {
        this.config = config;

        // Create Audio Player
        this.player = createAudioPlayer();
        this.player.on("stateChange", (oldState, newState) => {
            if (newState.status == AudioPlayerStatus.Idle) {
                if (this.joinedConfig && !this.paused && !this.stopped) this.playNext();
            }
        })
    }

    /** Make the bot join the Voice Channel */
    async join(channelId: string) {
        const channel = await client.channels.fetch(channelId).catch(e => { return { error: (e.message || "Unknown Discord Error") as string } });

        // Error Handling
        if (!channel) throw new Error("Channel not found");
        if ("error" in channel) throw new Error(channel.error);
        if (channel.type !== ChannelType.GuildVoice) throw new Error("Channel is not a voice channel");
        if (!channel.joinable) throw new Error("Channel is not joinable");

        // Join Discord channel
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        connection.subscribe(this.player);

        // Save the channel ID
        this.joinedConfig = { channelId: channel.id, connection };
        this.joined = true;
    }

    /** Leaves the voice chat and stops playing music */
    async leave() {
        if (!this.joinedConfig) return;

        this.stop();
        this.joinedConfig.connection.destroy();
        this.joinedConfig = null;
        this.joined = false;
    }

    /** Make the bot play audio data from /data in loop */
    async play() {
        if (!this.joinedConfig) throw new Error("Bot is not in a voice channel");
        if (this.stopped) this.playNext();

        if (this.paused) {
            console.log("Resuming playback")
            this.paused = false;
            this.player.unpause();
            return;
        }

        this.playNext();
    }

    /** Pause the playback */
    async pause() {
        if (this.stopped) return; // we dont have to pause if there's nothing playing lol
        console.log("Pausing playback");
        this.paused = true;
        this.player.pause();
    }

    /** Stops the playback */
    async stop() {
        console.log("Stopping playback")
        this.stopped = true;
        if (this.player.state.status == AudioPlayerStatus.Playing) this.player.stop(true);
    }

    /** Internal command for playing the next song, used to start playback as well */
    private async playNext() {
        if (!this.joinedConfig) return false;
        await this.updatePlaylist();

        this.currentPlaylistIndex++;
        if (this.currentPlaylistIndex >= this.playlist.length) this.currentPlaylistIndex = 0;

        const currentSongLocation = this.playlist[this.currentPlaylistIndex];
        if (!currentSongLocation) return this.stop();

        console.log("Playing", currentSongLocation);

        const audioResource = createAudioResource(currentSongLocation);
        this.paused = false;

        this.stopped = true;
        if (this.player.state.status == AudioPlayerStatus.Playing) this.player.stop(true);
        this.player.play(audioResource);
        this.stopped = false;
    }

    /** Update the playlist by looking at songs in the data folder */
    async updatePlaylist() {
        // go through /data and gather all audio files
        const oldPlaylist = JSON.parse(JSON.stringify(this.playlist)) as string[];
        this.playlist = [];

        // Gather files from data
        const dataFolderLocation = path.join(process.cwd(), "data");
        const files = await fs.readdir(dataFolderLocation);
        for (const file of files) {
            const fileLocation = path.join(dataFolderLocation, file);
            const fileStat = await fs.stat(fileLocation);
            const isAudioFile = fileStat.isFile() && file.endsWith(".mp3");
            if (isAudioFile) this.playlist.push(fileLocation);
        }

        // Calculate Difference
        const additionDifference = this.playlist.filter(p => !oldPlaylist.includes(p));
        const removalDifference = oldPlaylist.filter(p => !this.playlist.includes(p));
        const totalDifference = [...additionDifference, ...removalDifference];

        // Shuffle the playlist
        if (totalDifference.length > 0) {
            console.log("Shuffling playlist");
            this.playlist.sort(() => Math.random() - 0.5);
        }
    }

    /** Fetches the current loaded playlist */
    async getPlaylist(config?: { getNames?: boolean }) {
        await this.updatePlaylist();
        let playlist = this.playlist;
        if (config?.getNames) playlist = playlist.map(p => path.normalize(p).split("/").pop() || path.normalize(p).split("\\").pop() || path.normalize(p));
        return playlist;
    }

    /** Returns the path of the currently playing song */
    getCurrentPlaying() {
        if (this.stopped) return undefined;
        return this.playlist[this.currentPlaylistIndex];
    }
}
