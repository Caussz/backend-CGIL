const express = require("express");
const app = express.Router(); // start das rotas
const qrcode = require('qrcode-terminal');
const alunoInfo = require('../src/utils/alunoInfo')
const alunoLogin = require('../src/utils/alunoLogin.json')
const fs = require('fs')
const alunoNumero = alunoInfo.numeroTel
let wwversion
const alunoNota = JSON.parse(fs.readFileSync('./src/utils/alunoTotal.json'))
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))

const { Client, LocalAuth } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
const client = new Client({
    authStrategy: new LocalAuth(
        options = {
            dataPath: SESSION_FILE_PATH
        }),
});

async function startBOT(client) {


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
        
            const command = message.body
          switch (message.body) {
            case 'teste':
                message.reply(JSON.stringify(message))
                break;
                case 'teste2':
                    console.log(client)
                    client.sendMessage(alunoNumero, `${JSON.stringify(alunoNota)}`)
                    //message.reply(JSON.stringify(client))
                    break;
              
            default:
                break;
          }
        });
         
    
    client.on('disconnected', () => {
        console.log('Disconnected!');
    });

    
}

module.exports = startBOT



