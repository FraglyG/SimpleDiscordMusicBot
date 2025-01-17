import "dotenv/config";

export default {
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    CHANNEL_ID: process.env.CHANNEL_ID || '',
    OWNER_ID: process.env.OWNER_ID || '',
};