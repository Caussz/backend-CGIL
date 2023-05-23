const color = require('colors');
const express = require('express')
const mainrouter = require('./rotas/api');
const wpprouter = require('./rotas/whats');
const startBOT = require('./rotas/wpp')

const { Client, LocalAuth } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
const client = new Client({
    authStrategy: new LocalAuth(
        options = {
            dataPath: SESSION_FILE_PATH
        }),
});


const app = express()
const port = 3000

color.setTheme({ // setagem das cores
    info: 'green',
    susa: 'blue',
    erro: 'red',
    atencao: 'yellow'
});

app.use('/api', mainrouter); // rota das apis
app.use('/wpp', wpprouter); // rota do whatsapp

startBOT(client)

app.listen(process.env.PORT || port, () => { 
    console.clear();
    console.log(`Seu site de apis esta rodando na porta: ${port}`.atencao);
    console.log(`~~~>>> localhost:${port}`.info);
  })

module.exports = { client }