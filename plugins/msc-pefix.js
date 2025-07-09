import fs from "fs";
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const setprefixCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd !== "setprefix") return;

    if (!isCreator) {
      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, only *Toxic-MD*’s boss can touch this, fam! 🔐
◈━━━━━━━━━━━━━━━━◈`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Toxic-MD"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      display_text: "MENU",
                      id: `.menu`
                    })
                  }
                ]
              }),
            }),
          },
        },
      }, {});
      Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    if (!text) {
      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `◈━━━━━━━━━━━━━━━━◈
│❒ Gimme a new prefix, fam! Don’t leave *Toxic-MD* hangin’! 😎
◈━━━━━━━━━━━━━━━━◈`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Toxic-MD"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      display_text: "MENU",
                      id: `.menu`
                    })
                  }
                ]
              }),
            }),
          },
        },
      }, {});
      Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    if (text.length > 1) {
      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `◈━━━━━━━━━━━━━━━━◈
│❒ Keep it chill, fam! Prefix gotta be one character only! 😡
◈━━━━━━━━━━━━━━━━◈`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Toxic-MD"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      display_text: "MENU",
                      id: `.menu`
                    })
                  }
                ]
              }),
            }),
          },
        },
      }, {});
      Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    config.PREFIX = text;
    try {
      fs.writeFileSync("./config.cjs", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `◈━━━━━━━━━━━━━━━━◈
│❒ * If *Toxic-MD* couldn’t save the prefix, fam! Check the server! 😣
◈━━━━━━━━━━━━━━━━◈`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Toxic-MD"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      display_text: "MENU",
                      id: `.menu`
                    })
                  }
                ]
              }),
            }),
          },
        },
      }, {});
      Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* prefix switched to *${text}*! You’re runnin’ the show, fam! 🔧🔥
◈━━━━━━━━━━━━━━━━◈`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Toxic-MD"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: "",
              gifPlayback: true,
              subtitle: "",
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  "name": "quick_reply",
                  "buttonParamsJson": JSON.stringify({
                    display_text: "MENU",
                    id: `.menu`
                  })
                }
              ]
            }),
          }),
        },
      },
    }, {});
    Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  } catch (error) {
    console.error(`❌ Setprefix error: ${error.message}`);
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag, fam! Try again! 😈
◈━━━━━━━━━━━━━━━━◈`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Toxic-MD"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: "",
              gifPlayback: true,
              subtitle: "",
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  "name": "quick_reply",
                  "buttonParamsJson": JSON.stringify({
                    display_text: "MENU",
                    id: `.menu`
                  })
                }
              ]
            }),
          }),
        },
      },
    }, {});
    Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default setprefixCommand;