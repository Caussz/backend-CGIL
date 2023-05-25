const express = require("express");
const app = express.Router(); // start das rotas
const fs = require('fs');
//const { client } = require('../index')
const alunoNota = JSON.parse(fs.readFileSync('./src/utils/alunoTotal.json'))
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
const alunoInfo = require('../src/utils/alunoInfo')
const alunoLogin = require('../src/utils/alunoLogin.json')
const alunoNumero = alunoInfo.numeroTel;
const { client } = require('../index')

app.get('/', async (req, res) => {
    res.send('oi')
   // await startBOT(client)
    //client.sendMessage(alunoNumero, `${JSON.stringify(alunoNota)}`)
    console.log(client)

})
module.exports = app