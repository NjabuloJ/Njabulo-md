const config = require("../config.cjs");
const pkg = require('baileys-pro');
const { generateWAMessageFromContent, proto } = pkg;

fana({
  nomCom: "welcome",
  categorie: "Group"
}, async (chatId, zk, commandeOptions) => {
  const { ms, arg, verifGroupe, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) {
    const text = `This ain’t for lone wolves, fam! Use in a group!`;
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
              text
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

  if (!verifAdmin && !superUser) {
    const text = `You ain’t an admin, bruh! Step up or step out!`;
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
              text
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

  let responseMessage;
  if (arg[0] === "on") {
    config.WELCOME = true;
    responseMessage = `Welcome & left messages ON! Newbies beware!`;
  } else if (arg[0] === "off") {
    config.WELCOME = false;
    responseMessage = `Welcome & left messages OFF! Silent mode, fam!`;
  } else {
    responseMessage = `Yo, use it right, fam!
- \`.welcome on\`: Enable welcome & left
- \`.welcome off\`: Disable welcome & left`;
  }

  const buttons = [
    {
      "name": "quick_reply",
      "buttonParamsJson": JSON.stringify({
        display_text: "ENABLE",
        id: `.welcome on`
      })
    },
    {
      "name": "quick_reply",
      "buttonParamsJson": JSON.stringify({
        display_text: "DISABLE",
        id: `.welcome off`
      })
    },
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
});