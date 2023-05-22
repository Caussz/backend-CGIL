const qrcode = require('qrcode-terminal');

const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let wwversion;

const client = new Client({
    authStrategy: new LocalAuth(
        options = {
            dataPath: SESSION_FILE_PATH
        }),
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize().then(
    async () => {
        wwversion = await client.getWWebVersion()
    }).then(() => { console.log(`WhatsApp Web Version: ${wwversion}\nServer time: ${new Date().toISOString()}`) });


    client.on('message', message => {
        console.log(message)
        message.reply(JSON.stringify(message))
        if(message.body === '!ping') {
            message.reply('pong');
        }
    });
     

client.on('disconnected', () => {
    console.log('Disconnected!');
});