const cheerio = require(`cheerio`)
const puppeteer = require(`puppeteer`)
const express = require("express");
const app = express.Router(); // start das rotas

let url = 'https://sig.ifc.edu.br/sigaa/verTelaLogin.do'
// Segue o exemplo de como ficaria a url:
// --> http://localhost:3000/api/sigaa?user=SeuUsuario&pass=SuaSenha
app.get('/sigaa', async (req, res) => {
    const user = req.query.user
    const pass = req.query.pass
    if(!user || !pass) {
        res.json({
            status: false,
            mensagem: 'Coloque o parametro "usuario" e "pass"',
          });
    } else {
        let obj = {}
        const browser = await puppeteer.launch({ headless: false});
        const page = await browser.newPage();
        await page.goto(url, {
       waitUntil: "load",
       timeout: 0
     })
     await page.type('input[type="text"]', user, {delay: 100})
     await page.type('input[type="password"]', pass, {delay: 100})
     await page.click('input[type="submit"]')
   
     setTimeout(async function () {
       const pageData = await page.evaluate(() => {return {html: document.documentElement.innerHTML,};});
       let $ = await cheerio.load(pageData.html);
       obj.nome = await $('.usuario').text().replace('\n\t\t\n\t\t\t\n\t\t\t\t', '').replace('\n\t\t\t\n\t\t\t\n\t\t\t\n\t\t\n\t\t', '')
       obj.ano = await $('.periodo-atual').text().replace('\n\t\t\t\n\t\t\t\t', '').replace('\t\t\t\n\t\t\t\n\t\t\t\n\t\t\t\n\t\t', '')
       obj.unidade = await $('.unidade').text().replace('\n\t\t\t', '').replace('\n\t\t\t (11.01.02)\n\t\t\t\n\t\t', '')
       console.log(obj)
       res.json(obj)
     },5000)
    }
    
  })
  

module.exports = app