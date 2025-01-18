const messageData = {
    // MUSIC I/O MESSAGES

    /** Runs as confirmation for when the add command is ran */
    add_confirm: [
        `Bet bet, lemme lock in vro 🤝`,
        `I gotchu lemme rizz up the downloader rq`,
        `GYAAAT!!!! aight aight let me cook`,
        `What the freak is this skibidi ass song 💀 but aight`,
        `Bro wants to add music 😭 alright unc calm down lemme cook`,
        `Aight no glaze but that shit slaps, finna add it rq`,
        `Shouldn't you be working on Departed little bro? 😭 but aight`
    ],

    /** Runs when the add command succesfully added a new song */
    add_success: [
        `I'm so goated, gotta nerf my ass fr.. anyway I finished that shit`,
        `Aight im done, imma go back to gooning`,
        `Done!!!`,
        `Aight bruh, done\nNow let me goon PLEASEEEE`,
        `Stupid ass African thinks he can order me around tho, shit's crazy 😭 do it yourself next time blud`,
        `sigma sigma boy sigma boy sigma boy im done`
    ],

    /** Runs when the adding a new song fails */
    add_fail: [
        `I just got edged, shit failed bro`,
        `Cooked... the download failed lol, good luck fixing that unc\nImma go back to mogging`,
        `Ermmm, it failed lol, bitch ass pussy couldn't even code a working music bot 😭`,
        `it failed little bro`,
        `Negative aura right there, it failed 💀💀💀`
    ],

    /** Runs when the add command is passed with no attachments and no URLs */
    add_no_urls: [
        `tf? add??? add what brother????`
    ],

    /** Runs when the add command is passed invalid URLs */
    add_invalid_urls: [
        `Brother.. you're literally the one who coded me, how tf do you expect me to download a non-mp3 file 😭😭😭😭`
    ],

    //

    /** Runs as confirmation that a song is going to be removed */
    remove_confirm: [
        `Bro just broke my mewing streak to remove his stupid ah song 💀💀💀`,
        `BASED that song sucked lowkey, never add that shit again 😭 unc ass music`,
        `I knew u were tweaking adding that shit 💀 on gyat that shit was ass`,
        `Finally removing that mid ass song huh? Aight lemme cook`
    ],

    /** Runs when song removal succeeds and the song is removed */
    remove_success: [
        `Aight im done`,
        `I cooked, eradicated it`,
        `Done!!!`,
    ],

    /** Runs when removing the song fails, can happen when song is busy or doesn't exist or something */
    remove_fail: [
        `Lowkey.. couldn't delete it lol, guess you're stuck with it now`,
        `it failed blud, whatever just keep it 😭`,
    ],

    /** Runs when the song the user is trying to remove doesn't exist */
    remove_not_exist: [
        "That song ain't in the playlist bro",
    ],

    // GENERAL

    /** Runs when the `ping` command is ran */
    ping: [
        "Whazuuuuuuppppp 😝",
        "Huh?",
        "Leave me alone",
    ],

    /** Runs the `list` command could not find any songs in the playlist */
    nothing_in_playlist: [
        "There aint nutn in the playlist rn",
    ],

    // INTERNAL

    /** Runs when a command failes ungraciously */
    command_failure: [
        `It failed 💀💀💀 Give up bro, go work at McDonalds as a cashier, programming is not for you`,
    ]
}

/** Fetches a random message string of a certain type */
export function getRandomMessage(type: keyof typeof messageData) {
    const messages = messageData[type];
    if (!messages) return "Unknown Message Type";
    return messages[Math.floor(Math.random() * messages.length)];
}