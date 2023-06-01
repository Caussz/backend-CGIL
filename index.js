const color = require('colors');
const express = require('express')
const mainrouter = require('./rotas/api');
const fetch = require('node-fetch')
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const startBOT = require('./rotas/wpp')
const fs = require('fs');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
const SESSION_FILE_PATH = './session.json';
const app = express();
const port = 3080;

const client = new Client({
    authStrategy: new LocalAuth(
        options = {
            dataPath: SESSION_FILE_PATH
        }),
});

color.setTheme({ // setagem das cores
    info: 'green',
    susa: 'blue',
    erro: 'red',
    atencao: 'yellow'
});

app.use('/api', mainrouter); // rota das apis

async function downloadAndEncodeImage(url) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64String = buffer.toString('base64');
    return base64String;
  }

app.get('/wpp', async (req, res) => {
    const number = req.query.number
    let result
    let foto
    let turma 
    Object.keys(alunoCreds).forEach((i) => {
        if (alunoCreds[i].aluno.numeroTel === number) {
         result = alunoCreds[i]
         foto = alunoCreds[i].aluno.printBoletim
         turma = alunoCreds[i].aluno.turma
        }
      })
      
  downloadAndEncodeImage(foto)
  .then(async (base64String) => {
    const media = new MessageMedia('image/jpeg', base64String);
    await client.sendMessage(`${number + '@c.us'}`, media, {caption: `_Olá ${result.aluno.nome}_\n_Segue abaixo, *suas respectivas notas* nas matérias do componente curricular do CURSO ${result.aluno.turma}_\n\n_Equipe CGIL agradece, *dúvidas ou problemas digite /suporte*_`});
    (turma === "TÉCNICO EM AGROPECUÁRIA INTEGRADO AO ENSINO MÉDIO - C (2023)") ? client.sendMessage(`${number + '@c.us'}`, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.portLiteratura.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Agronomia I: *${result.nota.agroI.tri1}*_\n_Zootecnia I:*${result.nota.zooI.tri1}*_\n_Desenho Tecnico I: *${result.nota.desenhorTec.tri1}*_\n_Pratica orientada I: *${result.nota.praticaOrientada.tri1}*_\n_Sociologia: *${result.nota.sociologia.tri1}*_\n_Filosofia: *${result.nota.filosofia.tri1}*_`)
    : (turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - A (2023)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - B (2023)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - B (2023)") ? client.sendMessage(`${number + '@c.us'}`, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.port.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Intro a Computacao: *${result.nota.introComp.tri1}*_\n_Programacao I: *${result.nota.progI.tri1}*_\n_Projeto Integrador I: *${result.nota.projInt.tri1}*_\n_DevWeb I: *${result.nota.devWeb.tri1}*_`)
    : (turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - A (2022)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - B (2022)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - C (2022)") ?  client.sendMessage(`${number + '@c.us'}`, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.port.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Sociologia: *${result.nota.sociologia.tri1}*_\n_Filosofia: *${result.nota.filosofia.tri1}*_\n_Proj de software: *${result.nota.introComp.tri1}*_\n_Banco de dados I: *${result.nota.banco.tri1}*_\n_Projeto Integrador II: *${result.nota.projIntII.tri1}*_\n_DevWeb II: *${result.nota.devWebII.tri1}*_`)
    : client.sendMessage(`${number + '@c.us'}`, 'Curso indisponivel.');
}) 

    res.json({status: true, msg: `Notas enviadas para o numero ${number}`})
})

app.listen(process.env.PORT || port, async () => { 
    console.clear();
    await startBOT(client)  
    console.log(`Seu site de apis esta rodando na porta: ${port}`.atencao);
    console.log(`~~~>>> localhost:${port}`.info);
  })


module.exports = {app, client}