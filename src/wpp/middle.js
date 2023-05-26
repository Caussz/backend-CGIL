const express = require("express");
const out = express.Router(); // start das rotas

  async function middle(bot) {
    bot.ev.on("messages.upsert", async (msg) => {
      const baileysMessage = msg.messages[0];
      const quoted = baileysMessage.quoted
        ? baileysMessage.quoted
        : baileysMessage;
      const from = baileysMessage.key.remoteJid;
      if (!baileysMessage.message) return;
  
      const type =
        Object.keys(baileysMessage.message)[0] == "senderKeyDistributionMessage"
          ? Object.keys(baileysMessage.message)[2]
          : Object.keys(baileysMessage.message)[0] == "messageContextInfo"
          ? Object.keys(baileysMessage.message)[1]
          : Object.keys(baileysMessage.message)[0];
  
      const type3 = Object.keys(baileysMessage.message);
      var body =
        type === "conversation"
          ? baileysMessage.message.conversation
          : type == "imageMessage"
          ? baileysMessage.message.imageMessage.caption
          : type == "videoMessage"
          ? baileysMessage.message.videoMessage.caption
          : type == "extendedTextMessage"
          ? baileysMessage.message.extendedTextMessage.text
          : type3[1] == "buttonsResponseMessage"
          ? baileysMessage.message.buttonsResponseMessage.selectedButtonId
          : type3[2] == "buttonsResponseMessage"
          ? baileysMessage.message.buttonsResponseMessage.selectedButtonId
          : type3[0] == "buttonsResponseMessage"
          ? baileysMessage.message.buttonsResponseMessage.selectedButtonId
          : type3[1] == "listResponseMessage"
          ? baileysMessage.message.listResponseMessage.singleSelectReply
              .selectedRowId
          : type3[0] == "listResponseMessage"
          ? baileysMessage.message.listResponseMessage.singleSelectReply
              .selectedRowId
          : type == "templateButtonReplyMessage"
          ? baileysMessage.message.templateButtonReplyMessage.selectedId
          : "";
  
      const isMedia =
        type === "imageMessage" ||
        type === "videoMessage" ||
        type === "audioMessage" ||
        type == "viewOnceMessage" ||
        type == "viewOnceMessageV2";
  
      const content = JSON.stringify(baileysMessage.message);
  
      const isQuotedImage =
        type === "extendedTextMessage" && content.includes("imageMessage");
  
      const isQuotedVideo =
        type === "extendedTextMessage" && content.includes("videoMessage");
  
      let prefix = `/`;
      const args = body.trim().split(/ +/).slice(1);
      const messagesC = body.slice(0).trim().split(/ +/).shift().toLowerCase();
      const pushname = baileysMessage.pushName ? baileysMessage.pushName : "";
      const isCmd = body.startsWith(prefix);
  
      const command = isCmd
        ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase()
        : null;

      const isGroup = baileysMessage.key.remoteJid.endsWith("@g.us");

      const reply = (texto) => {
        bot.sendMessage(from, { text: texto }, { quoted: baileysMessage });
      };
      const reply2 = (texto, number) => {
        bot.sendMessage(number, { text: texto }, { quoted: baileysMessage });
      };
      const react = (rt) => {
        bot.sendMessage(from, { react: { text: rt, key: baileysMessage.key } });
      };
  
    
      const video = (video, texto) => {
        bot.sendMessage(
          from,
          { video: { url: video }, caption: texto },
          { quoted: baileysMessage }
        );
      };

      const image = (image, texto) => {
        bot.sendMessage(
          from,
          { image: { url: image }, caption: texto },
          { quoted: baileysMessage }
        );
      };
  
      if (messagesC.includes("bot")) {
        reply(`que tu quer pia`);
      }
  
      if (isCmd)
        console.log(`>> [ WhatsApp ] - C: ${command} de ${pushname}`.info);

        out.get('/aa', async (req, res) => {
            res.send('oi')
            reply2('aaaa', '554792091566@c.us')
        })
  
      switch (command) {
       

        default:
          if (isCmd) {
            reply(
              `_Opa ${pushname}!_\n_O comando *"${command}" não foi encontrado*, isso significa que ele não está listado na minha lista de comandos._\n_Por favor clique no botão *"Ver menu"* listado abaixo ou digite *"/menu"*, dúvidas ou problemas *reveja os termos com o comando "/termos" ou reclame com "/suporte".*_`);
            console.log(`>> [ WhatsApp ] - CN: ${command}`.red);
          }
          break;
      }
    });
  }
  

module.exports = { middle, out}