import "dotenv/config";

export default {
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    CHANNEL_ID: process.env.CHANNEL_ID || '',
    ADMIN_ID: process.env.ADMIN_ID || '',
};