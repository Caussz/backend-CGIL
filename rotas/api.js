const cheerio = require(`cheerio`);
const puppeteer = require(`puppeteer`);
const express = require("express");
const app = express.Router(); // start das rotas

let url = "https://sig.ifc.edu.br/sigaa/mobile/touch/login.jsf";
let url2 =
  "https://sig.ifc.edu.br/sigaa/ensino/tecnico_integrado/boletim/selecao.jsf";
// Segue o exemplo de como ficaria a url:
// --> http://localhost:3000/api/sigaa?user=SeuUsuario&pass=SuaSenha
app.get("/sigaa", async (req, res) => {
  const user = req.query.user;
  const pass = req.query.pass;
  if (!user || !pass) {
    res.json({
      status: false,
      mensagem: 'Coloque o parametro "usuario" e "pass"',
    });
  } else {
    let obj = {
      aluno: {
        nome: '',
        turma: '',
        situacao: '',
        matricula: '',
        ano: ''
      },
      nota: {
        artes: 0,
        biologia: 0,
        edf: 0,
        fisica: 0,
        geo: 0,
        hist: 0,
        math: 0,
        port: 0,
        quimi: 0,
        instroComp:0,
        progI: 0,
        projInt: 0
      }
      
    };
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    });
    await page.type('input[type="text"]', user, { delay: 100 });
    await page.type('input[type="password"]', pass, { delay: 100 });
    await page.click('input[type="submit"]');
    setTimeout(async function () {
      const elementosRepetidos = await page.$$(".ui-link-inherit");
      const elementoDesejado = elementosRepetidos[1];
      await elementoDesejado.click();
    }, 4000);
    setTimeout(async function () {
       const pageData = await page.evaluate(() => {return {html: document.documentElement.innerHTML,};});
       let $ = await cheerio.load(pageData.html);
       console.log(pageData)
       const totalTD = await page.$$('.nota')
       console.log(totalTD.length)
       console.log(obj)
       res.json(obj)
     },3000)
  }
});

module.exports = app;
