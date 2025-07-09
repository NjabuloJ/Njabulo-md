mport config from "../config.cjs";
const pkg = require('baileys-pro');
const { generateWAMessageFromContent, proto } = pkg;

fana({
  nomCom: ["translate", "trt"],
  categorie: "General"
}, async (chatId, zk, commandeOptions) => {
  const { ms, arg } = commandeOptions;

  const targetLang = arg[0];
  const text = arg.slice(1).join(' ');

  if (!targetLang || !text) {
    const responseMessage = "Usage: .translate <target_lang> <text>\nExample: .translate en कैसे हो भाई";
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
              text: responseMessage
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
    return;
  }

  try {
    const result = await translate(text, { to: targetLang });
    const translatedText = result[0];

    const responseMessage = `${targetLang}:\n\n${translatedText}`;
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
              text: responseMessage
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
  } catch (error) {
    console.error("Error translating text:", error);
    const responseMessage = "Error translating text.";
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
              text: responseMessage
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