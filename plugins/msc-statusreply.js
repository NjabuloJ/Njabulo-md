import fs from "fs";
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const autostatusreplyCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "autostatusreply") return;

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
                text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ Get lost, poser! Only *Toxic-MD*'s boss can fuck with status replies! 😤🔪
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`
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
                text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ Yo, braindead, tell *Toxic-MD* *on* or *off*! Don't just stare! 😆
│❒ Ex: *${prefix}autostatusreply on*
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`
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
                      display_text: "ON",
                      id: `.autostatusreply on`
                    })
                  },
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      display_text: "OFF",
                      id: `.autostatusreply off`
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

    if (!["on", "off"].includes(text)) {
      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ What's this garbage? *Toxic-MD* only takes *on* or *off*, clown! 🤡
│❒ Ex: *${prefix}autostatusreply on*
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`
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
                      display_text: "ON",
                      id: `.autostatusreply on`
                    })
                  },
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      display_text: "OFF",
                      id: `.autostatusreply off`
                    })
                  }
                ]
              }),
            }),
          },
        },
      }, {});
      return;
    }

    config.AUTO_STATUS_REPLY = text === "on";

    try {
      fs.writeFileSync("./config.cjs", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config.cjs: ${error.message}`);
      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* choked tryin' to save that, fam! Server's trash! 😣
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`
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
              text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* auto-status reply flipped to *${text}*! You're runnin' this, boss! 💪🔥
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`
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
    console.error(`❌ Autostatusreply error: ${error.message}`);
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* screwed up somewhere, fam! Hit it again! 😈
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`
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

export default autostatusreplyCommand;