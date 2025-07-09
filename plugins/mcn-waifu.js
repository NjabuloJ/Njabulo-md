mport config from "../config.cjs";
import axios from 'axios';
import pkg from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

fana({
  nomCom: ["cry", "kiss", "kill", "kick", "hug", "pat", "lick", "bite", "yeet", "bully", "bonk", "wink", "poke", "nom", "slap", "smile", "wave", "awoo", "blush", "smug", "dance", "happy", "sad", "cringe", "cuddle", "shinobu", "handhold", "glomp", "highfive"],
  categorie: "Sticker"
}, async (chatId, zk, commandeOptions) => {
  const { ms } = commandeOptions;
  const cmd = commandeOptions.nomCom;

  try {
    const { data } = await axios.get(`https://api.waifu.pics/sfw/${cmd}`);
    if (data && data.url) {
      zk.sendImageAsSticker(chatId, data.url, ms, { packname: "Njabulo Jb", author: "" });

      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "MENU",
            id: `.menu`
          })
        }
      ];
      const msg = generateWAMessageFromContent(chatId, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `Enjoy your sticker!`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Powered By SILVA"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
            }),
          },
        },
      }, {});
      zk.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
    } else {
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "MENU",
            id: `.menu`
          })
        }
      ];
      const msg = generateWAMessageFromContent(chatId, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `Error fetching sticker.`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Powered By SILVA"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
            }),
          },
        },
      }, {});
      zk.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
    }
  } catch (error) {
    console.error('Error fetching sticker:', error);
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "MENU",
          id: `.menu`
        })
      }
    ];
    const msg = generateWAMessageFromContent(chatId, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `Error fetching sticker.`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Powered By SILVA"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: "",
              gifPlayback: true,
              subtitle: "",
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons
            }),
          }),
        },
      },
    }, {});
    zk.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
});