const fs = require('fs');
const alunoLogin = JSON.parse(fs.readFileSync('./src/utils/alunoLogin.json'))
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))

//console.log(alunoCreds[0].nome)
Object.keys(alunoLogin).forEach((i) => {    
    //console.log(i)
   if (alunoLogin[i].name === alunoCreds[i].nome) {
     console.log(alunoCreds[i])
   }
  })
