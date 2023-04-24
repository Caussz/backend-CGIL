const color = require('colors');
const express = require('express')
const mainrouter = require('./rotas/api');
const app = express()
const port = 3000

color.setTheme({ // setagem das cores
    info: 'green',
    susa: 'blue',
    erro: 'red',
    atencao: 'yellow'
});

app.use('/api', mainrouter); // rota das apis

app.listen(process.env.PORT || port, () => { 
    console.clear();
    console.log(`Seu site de apis esta rodando na porta: ${port}`.atencao);
    console.log(`~~~>>> localhost:${port}`.info);
  })