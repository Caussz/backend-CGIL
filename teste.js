const fs = require('fs');
const alunoLogin = JSON.parse(fs.readFileSync('./src/utils/alunoLogin.json'))
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))

const number = `554792091566`
let result
let foto
Object.keys(alunoCreds).forEach((i) => {
    if (alunoCreds[i].aluno.numeroTel === number) {
     result = alunoCreds[i]
     foto = alunoCreds[i].aluno.printBoletim
   
    }
  })
console.log(result.nota.artes.tri1)
console.log(`_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Artes: *${result.nota.artes.tri1}*_\n_Biologia:*${result.nota.biologia.tri1}*_\n_Ed Fisica:*${result.nota.edf.tri1}*_\n_Fisica:*${result.nota.fisica.tri1}*_\n_Geografia:*${result.nota.geo.tri1}*_\n_Historia:*${result.nota.hist.tri1}*_\n_Matematica:*${result.nota.math.tri1}*_\n_Portugues:*${result.nota.port.tri1}*_\n_Quimica:*${result.nota.quimi.tri1}*_\n_Intro a Computacao:*${result.nota.introComp.tri1}*_\n_Programacao I:*${result.nota.progI.tri1}*_\n_Projeto Integrador I:*${result.nota.projInt.tri1}*_\n_`)

 //console.log(`_*Notas encontradas no numero de matricula ${result.aluno.matricula}*_\n\n_Biologia:*${result.nota.biologia.tri1}*_`)