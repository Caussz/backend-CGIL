// modulos necessarios para a aplicaçao
const cheerio = require(`cheerio`);
const puppeteer = require(`puppeteer`);
const express = require("express");
const app = express.Router(); // start das rotas
const fs = require('fs');

// importacao dos objetos
const aluno = require('../src/utils/alunoInfo')
const nota = require('../src/utils/alunoNota')
const alunoNota = JSON.parse(fs.readFileSync('./src/utils/alunoTotal.json'))
const alunoCreds = JSON.parse(fs.readFileSync('./src/utils/alunoCreds.json'))
// importacao da função para tranformar a imagem em link
const TelegraPh = require('../src/utils/telegraph')
// defs das urls necessarias
const URL_LOGIN = "https://sig.ifc.edu.br/sigaa/mobile/touch/login.jsf";
const URL_MENU = "https://sig.ifc.edu.br/sigaa/mobile/touch/menu.jsf";
// Segue o exemplo de como ficaria a url:
// --> http://localhost:3000/api/sigaa?user=SeuUsuario&pass=SuaSenha

app.get("/sigaa", async (req, res) => {
   // Pega as info do usuário a partir dos parâmetros 
  const user = req.query.user;
  const pass = req.query.pass;
  // verifica se as info foram fornecidas
  if (!user || !pass) {
    res.json({
      status: false,
      mensagem: 'Coloque o parametro "usuario" e "pass"',
    });
    return;
  } 

  if(fs.existsSync('./src/utils/alunoLogin.json')){
    // verifica se o arquivo alunoLogin.json existe
    res.json({alunoCreds, alunoNota})
  } else {

  

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
      const elementosRepetidos = await page.$$(".ui-link-inherit");
      const elementoDesejado = elementosRepetidos[1];
      await elementoDesejado.click();
    }, 4000);
    // Esperar alguns segundos para carregar totalmente a pagina do boletim
    setTimeout(async function () {
      const targets = await browser.targets();
      const target = targets.find((target) => target.url().includes(URL_MENU));
      const newPage = await target.page();
      await newPage.screenshot({ path: "./src/image/boletim.jpg" }); // print do boletim
      // iniciaçao do modulo Cheerio
      const html = await newPage.content();
      const $ = cheerio.load(html);
      // Extrai as informações do aluno e das notas do HTML usando o modulo Cheerio
      $("table.listagem td").each((index, element) => {  // each para filtragem das notas por cada td
        const text = $(element).text().trim();
        console.log(text)
        switch (index) {
          case 2:
            aluno.nome = text;
            break;
          case 6:
            aluno.turma = text;
            break;
          case 10:
            aluno.situacao = text;
            break;
          case 4:
            aluno.matricula = text;
            break;
          case 8:
            aluno.ano = text;
            break;
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
      });
      // Transformar imagem em link
      await TelegraPh('./src/image/boletim.jpg').then(async (result) => aluno.printBoletim = result)
      // Retorna o resultado da consulta em formato JSON
      await fs.writeFileSync('./src/utils/alunoTotal.json', JSON.stringify(nota))
      await fs.writeFileSync('./src/utils/alunoLogin.json', JSON.stringify(aluno))
      await fs.writeFileSync('./src/utils/alunoCreds.json', JSON.stringify(aluno))

     res.json({ alunoCreds, alunoNota});
    }, 6000); 
  }
  
});

module.exports = app;
