// modulos necessarios para a aplicaçao
const cheerio = require(`cheerio`);
const puppeteer = require(`puppeteer`);
const express = require("express");
const app = express.Router(); // start das rotas
const fs = require('fs');
// importacao dos objetos
const alunoNota = JSON.parse(fs.readFileSync('./src/utils/alunoTotal.json'))
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
const alunoLogin = JSON.parse(fs.readFileSync('./src/utils/alunoLogin.json'))
// ../src/utils/alunoLogin.json
const aluno = require('../src/utils/alunoInfo')
const nota = require('../src/utils/alunoNota')
// importacao da função para tranformar a imagem em link
const TelegraPh = require('../src/utils/telegraph')

// defs das urls necessarias
const URL_LOGIN = "https://sig.ifc.edu.br/sigaa/mobile/touch/login.jsf";
const URL_MENU = "https://sig.ifc.edu.br/sigaa/mobile/touch/menu.jsf";
// Segue o exemplo de como ficaria a url:
// --> http://localhost:3000/api/sigaa?user=SeuUsuario&pass=SuaSenha&number=SeuNumero

app.get("/sigaa", async (req, res) => {
   // Pega as info do usuário a partir dos parâmetros 
  const user = req.query.user;
  const pass = req.query.pass;
  const number = req.query.number;
  // verifica se as info foram fornecidas
  aluno.numeroTel = number
  if (!user || !pass || !number) {
    res.json({
      status: false,
      mensagem: 'Coloque o parametro "usuario", "pass" e "number"',
    });
    return;
  } 
  function verifyUser(user, pass) {
    let status = false
    Object.keys(alunoLogin).forEach((i) => {
      if (alunoLogin[i].user === user && alunoLogin[i].pass === pass) {
        status = true
      }
    })
    return status
  }
  if(!verifyUser(user, pass)){
     // Inicializa o Puppeteer, cria uma aba no navegador e a selecao de paginas
     const browser = await puppeteer.launch({ headless: false });
     const page = await browser.newPage();
     const pages = await browser.pages();
     await page.goto(URL_LOGIN, {
       waitUntil: "load",
       timeout: 0,
     });
     // Faz o login no SIGAA
     await page.type('input[type="text"]', user, { delay: 100 });
     await page.type('input[type="password"]', pass, { delay: 100 });
     await page.click("button"); // botao de aceitar, pode ter auteracoes
     await page.click('input[type="submit"]');
     // Esperar alguns segundos para aaprecer os seletores
     setTimeout(async function () {
      await page.waitForSelector(".ui-link-inherit");
       const elementosRepetidos = await page.$$(".ui-link-inherit");
       const elementoDesejado = elementosRepetidos[1];
       await elementoDesejado.click();
     }, 4000); 
     // Esperar alguns segundos para carregar totalmente a pagina do boletim
     setTimeout(async function () {
       const targets = await browser.targets();
       const target = targets.find((target) => target.url().includes(URL_MENU));
       const newPage = await target.page();
       const elementosRepetidos = await newPage.$$('a');
       const elementoDesejado = elementosRepetidos[12];
       await newPage.waitForSelector(elementoDesejado)
       if (elementosRepetidos.length === 15) {
          await elementoDesejado.click()
       }
       console.log(elementosRepetidos.length)
       await newPage.screenshot({ path: "./src/image/boletim.jpg" }); // print do boletim
       // iniciaçao do modulo Cheerio
       const html = await newPage.content();
       const $ = cheerio.load(html);
       // Extrai as informações do aluno e das notas do HTML usando o modulo Cheerio
       $("table.listagem td").each((index, element) => {  // each para filtragem das notas por cada td
         const text = $(element).text().trim();
        //console.log(text)
        if(index === 2) aluno.nome = text;
        if(index === 4) aluno.matricula = text;
        if(index === 6) aluno.turma = text;
        if(index === 8) aluno.ano = text;
        if(index === 10) aluno.situacao = text;
        
        if (aluno.turma === "TÉCNICO EM INFORMÁTICA PARA INTERNET INTEGRADO AO ENSINO MÉDIO - A (2023)") {
          
          switch (index) {
             case 13:
                nota.artes.tri1 = text;
               break;
               case 26:
                nota.biologia.tri1 = text;
               break;
               case 39:
                nota.edf.tri1 = text;
               break;
               case 52:
                nota.fisica.tri1 = text;
               break;
               case 65:
                nota.geo.tri1 = text;
               break;
               case 78:
                nota.hist.tri1 = text;
               break;
               case 91:
                nota.math.tri1 = text;
               break;
               case 104:
                nota.port.tri1 = text;
               break;
               case 117:
                nota.quimi.tri1 = text;
               break;
               case 130:
                nota.introComp.tri1 = text;
               break;
               case 143:
                nota.progI.tri1 = text;
               break;
               case 156:
                nota.devWeb.tri1 = text;
               break;
               case 169:
                nota.projInt.tri1 = text;
               break;
               case 186:
                aluno.totalFalta = text;
               break;
          }
          
        } else if (aluno.turma === "TÉCNICO EM AGROPECUÁRIA INTEGRADO AO ENSINO MÉDIO - C (2023)") {
          switch (index) {
              case 13:
                nota.portLiteratura.tri1 = text;
               break;
               case 26:
                nota.artes.tri1 = text;
               break;
               case 39:
                nota.edf.tri1 = text;
               break;
               case 52:
                nota.math.tri1 = text;
               break;

               case 65:
                nota.quimi.tri1 = text;
               break;
               case 78:
                nota.fisica.tri1 = text;
               break;
               case 91:
                nota.biologia.tri1 = text;
               break;
               case 104:
                nota.geo.tri1 = text;
               break;
               case 117:
                nota.hist.tri1 = text;
               break;
               case 130:
                nota.filosofia.tri1 = text;
               break;
               case 143:
                nota.sociologia.tri1 = text;
               break;
               case 156:
                nota.agroI.tri1 = text;
               break;
               case 169:
                nota.desenhorTec.tri1 = text;
               break;
               case 182:
                nota.zooI.tri1 = text;
               break;
               case 195:
                nota.praticaOrientada.tri1 = text;
               break;
               case 208:
                aluno.totalFalta.tri1 = text;
               break;
        }
        }
         
       });
       // Transformar imagem em link
       await TelegraPh('./src/image/boletim.jpg').then(async (result) => aluno.printBoletim = result)
       const login = {
        user,
        pass,
        number,
        name: aluno.nome
       }
       const alunoInt = {
        aluno,
        nota
       }
       //alunoLogin.push(login)
      // alunoCreds.push(alunoInt)
       //fs.writeFileSync('./src/utils/alunoLogin.json', JSON.stringify(alunoLogin));
      // fs.writeFileSync('./src/utils/alunoCreds.json', JSON.stringify(alunoCreds));
       // Retorna o resultado da consulta em formato JSON
      return res.json({ aluno, nota });

     }, 6000);
  
     
  } else {
    let result 
    Object.keys(alunoLogin).forEach((i) => {
      if (alunoLogin[i].name === alunoCreds[i].aluno.nome) {
       result = alunoCreds[i]
      }
    })
    return res.json(result)
  }
 
});

module.exports = app;
