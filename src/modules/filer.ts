import path from "path";
import fs from "fs/promises";
import { Downloader } from "nodejs-file-downloader";
import { musicPlayer } from "..";

const dataPath = path.join(process.cwd(), "data");

export async function addFileFromURL(url: string) {
    // Download the file
    const downloader = new Downloader({
        url,
        directory: dataPath,
    });

    try {
        const { filePath, downloadStatus } = await downloader.download();
        musicPlayer.updatePlaylist().catch(console.error);
        return true;
    } catch (error) {
        console.error("Failed to download file", error);
        return false;
    }
}

export async function removeFileFromName(name: string) {
    if (!name.includes(".mp3")) name += ".mp3";

    const filePath = path.join(dataPath, name);

    const currentPlaylist = await musicPlayer.getPlaylist();
    const currentlyPlaying = musicPlayer.getCurrentPlaying();

    if (currentPlaylist.length == 1) {
        // there is only one song in the playlist (this song) so stop playback
        console.log("Stopping playback since only playing song is being removed");
        musicPlayer.stop();
    } else if (currentPlaylist.length > 1 && filePath == currentlyPlaying) {
        // there is more than 1 song here, so just play the next song
        console.log("Skipping song since current song is being removed");
        musicPlayer.play();
    }

    await new Promise(r => setTimeout(r, 1000));

    try {
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        console.error("Failed to remove file", error);
        return false;
    }
}