const color = require('colors');
const express = require('express')
const mainrouter = require('./rotas/api');
const wpprouter = require('./rotas/wpp');
const startBOT = require('./rotas/wpp')
const alunoNota = require('./src/utils/alunoTotal.json')
const fs = require('fs')
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
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

app.get('/uiui', async (req, res) => {
    const media = MessageMedia.fromFilePath('./src/image/boletim.jpg');
    res.send('oi')
   // await startBOT(client)
    client.sendMessage('554792091566@c.us', media, {caption: `${JSON.stringify(alunoNota)}`})
    //console.log(client)

})
app.listen(process.env.PORT || port, () => { 
    console.clear();
    console.log(`Seu site de apis esta rodando na porta: ${port}`.atencao);
    console.log(`~~~>>> localhost:${port}`.info);
  })

module.exports = { client }