const fetch = require('node-fetch');
const fs = require('fs')
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
let url
let result
const number = '554792091566'


async function downloadAndEncodeImage(url) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64String = buffer.toString('base64');
    return base64String;
  }


Object.keys(alunoCreds).forEach((i) => {
    if (alunoCreds[i].aluno.numeroTel === number) {
     result = alunoCreds[i]
     url = alunoCreds[i].aluno.printBoletim
    }
})

downloadAndEncodeImage(url)
.then(async (base64String) => {
    console.log(base64String)
  //const media = new MessageMedia('image/jpeg', base64String);
  //await client.sendMessage(`${number + '@c.us'}`, media, {caption: `_Olá ${result.aluno.nome}_\n_Segue abaixo, *suas respectivas notas* nas matérias do componente curricular do CURSO ${result.aluno.turma}_\n\n_Equipe CGIL agradece, *dúvidas ou problemas digite /suporte*_`})
 // client.sendMessage(`${number + '@c.us'}`, `_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia: *${result.nota.biologia.tri1}*_\n_Ed Fisica: *${result.nota.edf.tri1}*_\n_Fisica: *${result.nota.fisica.tri1}*_\n_Geografia: *${result.nota.geo.tri1}*_\n_Historia: *${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues: *${result.nota.port.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Intro a Computacao: *${result.nota.introComp.tri1}*_\n_Programacao I:*${result.nota.progI.tri1}*_\n_Projeto Integrador I: *${result.nota.projInt.tri1}*_\n_DevWeb I: *${result.nota.devWeb.tri1}*_`)
})

console.log(url)