require('dotenv').config();

const QRCode = require('qrcode');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('Bot is online!');
});

let count = 1;
client.on('messageCreate', async message => {
    if (message.content.startsWith('!qrcode')) {
        const text = message.content.split(' ').slice(1).join(' ');
        if (!text) {
            message.reply('Please provide text to generate a QR code.');
            return;
        }

        try {
            const qrCodeImage = await QRCode.toDataURL(text);
            const buffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');
            message.reply({ files: [{ attachment: buffer, name: 'qrcode.png' }] });
            console.log(`QR code ${count} generated successfully.`);
            count++;
        } catch (error) {
            console.error(error);
            message.reply('Failed to generate QR code.');
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
