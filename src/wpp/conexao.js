const {default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const P = require('pino')


async function conectar() {
    //const { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('./assets/auth/bbyyt')
    
    const bot = makeWASocket({
        //version,  
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['Causs BOT', 'Chrome', '3.0'],
        auth: await state,
        defaultQueryTimeoutMs: undefined
    });

    bot.ev.on('connection.update', (update) =>{
        const {connection, lastDisconnect} = update

        if(connection == 'close'){
            const reconect = lastDisconnect.error?.output?.statuscode != DisconnectReason.loggedOut

            if(reconect){
                conectar()
            }
        }

    })


    bot.ev.on('creds.update', saveCreds)
    return bot
}

module.exports = conectar