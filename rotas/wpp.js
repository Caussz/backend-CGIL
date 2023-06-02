// modulos necessarios 
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
// importacao das informacoes dos alunos
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
// defs do bot
let prefix = [`/`]
let wwversion

async function downloadAndEncodeImage(url) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64String = buffer.toString('base64');
    return base64String;
  }

async function startBOT(client) {

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });
    
    client.on('ready', () => {
        console.log('O bot esta conectado!');
    });
    
    client.initialize().then(
        async () => {
            wwversion = await client.getWWebVersion()
        }).then(() => { console.log(`Versao do WhatsApp Web: ${wwversion}`) });
    
    
        client.on('message', async message => {
            // defs de mensagem 
            const pushname = message._data.notifyName;
            const number = message._data.id.remote
            const numberBot = message._data.to
            const device = message._data.deviceType
            const commandInit = message.body.slice(prefix.length).trim().split(/ +/);
            const command = commandInit.shift().toLowerCase();
            // comandos 
          switch (command) {
            case 'notas':
                let result
                let foto
                let turma
                Object.keys(alunoCreds).forEach((i) => {
                    if (alunoCreds[i].aluno.numeroTel + '@c.us' === number) {
                     result = alunoCreds[i]
                     foto = alunoCreds[i].aluno.printBoletim
                     turma = alunoCreds[i].aluno.turma
                    }
                  })
                  downloadAndEncodeImage(foto)
                  .then(async (base64String) => {
                    const media = new MessageMedia('image/jpeg', base64String);
                    message.react('🤖')
                   await client.sendMessage(number, media, {caption: `_Olá ${pushname}_\n_Segue abaixo, *suas respectivas notas* nas matérias do componente curricular do CURSO ${result.aluno.turma}_\n\n_Equipe CGIL agradece, *dúvidas ou problemas digite /suporte*_`});
                  (turma === "TÉCNICO EM AGROPECUÁRIA INTEGRADO AO ENSINO MÉDIO - C (2023)") ? client.sendMessage(number, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.portLiteratura.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Agronomia I: *${result.nota.agroI.tri1}*_\n_Zootecnia I:*${result.nota.zooI.tri1}*_\n_Desenho Tecnico I: *${result.nota.desenhorTec.tri1}*_\n_Pratica orientada I: *${result.nota.praticaOrientada.tri1}*_\n_Sociologia: *${result.nota.sociologia.tri1}*_\n_Filosofia: *${result.nota.filosofia.tri1}*_`)
                  : (turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - A (2023)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - B (2023)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - B (2023)") ? client.sendMessage(number, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.port.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Intro a Computacao: *${result.nota.introComp.tri1}*_\n_Programacao I: *${result.nota.progI.tri1}*_\n_Projeto Integrador I: *${result.nota.projInt.tri1}*_\n_DevWeb I: *${result.nota.devWeb.tri1}*_`)
                  : (turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - A (2022)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - B (2022)" || turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - C (2022)") ?  client.sendMessage(number, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.port.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Sociologia: *${result.nota.sociologia.tri1}*_\n_Filosofia: *${result.nota.filosofia.tri1}*_\n_Proj de software: *${result.nota.projSoft.tri1}*_\n_Banco de dados I: *${result.nota.banco.tri1}*_\n_Projeto Integrador II: *${result.nota.projIntII.tri1}*_\n_DevWeb II: *${result.nota.devWebII.tri1}*_`)
                  : client.sendMessage(number, '*_Curso indisponivel ou ano indisponivel_*'); 
                 // client.sendMessage(number, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.port.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Intro a Computacao: *${result.nota.introComp.tri1}*_\n_Programacao I:*${result.nota.progI.tri1}*_\n_Projeto Integrador I: *${result.nota.projInt.tri1}*_\n_DevWeb I: *${result.nota.devWeb.tri1}*_`)
                  })
                break
            case 'teste':
                message.reply(message.length)
               message.react('😀')
               message.reply(JSON.stringify(message._data.notifyName))
               message.reply(numberBot)
               message.reply(device)
               message.reply(JSON.stringify(message))
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



