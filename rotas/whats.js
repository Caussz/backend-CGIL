const express = require("express");
const app = express.Router(); // start das rotas
const fs = require('fs');
//const { client } = require('../index')
const alunoNota = JSON.parse(fs.readFileSync('./src/utils/alunoTotal.json'))
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
const alunoInfo = require('../src/utils/alunoInfo')
const alunoLogin = require('../src/utils/alunoLogin.json')
const alunoNumero = alunoInfo.numeroTel;

const startBOT = require('./wpp')

const { Client, LocalAuth } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
const client = new Client({
    authStrategy: new LocalAuth(
        options = {
            dataPath: SESSION_FILE_PATH
        }),
});

app.get('/', async (req, res) => {
    res.send('oi')
    await startBOT(client)
    client.sendMessage(alunoNumero, `${JSON.stringify(alunoNota)}`)

})
module.exports = app