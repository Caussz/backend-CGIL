const color = require('colors');
const express = require('express')
const mainrouter = require('./rotas/api');
//const wpprouter = require('./src/wpp/middle');
const conectar = require('./src/wpp/conexao');
const { middle, out } = require('./src/wpp/middle');
const fs = require('fs');

const app = express();
const port = 3000;

color.setTheme({ // setagem das cores
    info: 'green',
    susa: 'blue',
    erro: 'red',
    atencao: 'yellow'
});

app.use('/api', mainrouter); // rota das apis
app.use('/wpp', out); // caminho rotas wpp


async function start() {
    const bot = await conectar();
    await middle(bot) 
    console.log(`logado no zap`)
}

app.listen(process.env.PORT || port, () => { 
    console.clear();
    console.log(`Seu site de apis esta rodando na porta: ${port}`.atencao);
    console.log(`~~~>>> localhost:${port}`.info);
    start()
  })

module.exports = app