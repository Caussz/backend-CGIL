const fetch = require('node-fetch');
const fs = require('fs')
const alunoLogin = JSON.parse(fs.readFileSync('./src/utils/alunoLogin.json'))
let url
let result
const number = '554788958728'


function verifyUser(user, pass,serie) {
  let status = false
  Object.keys(alunoLogin).forEach((i) => {
    if (alunoLogin[i].user === user && alunoLogin[i].pass === pass && alunoLogin[i].serie === serie) {
      status = true
    }
  })
  console.log(status)
}

verifyUser('vcaua', '251006Cc$', '2' )


//console.log(result.aluno)