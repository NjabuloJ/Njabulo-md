import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const block = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const validCommands = ['block'];
    if (!validCommands.includes(cmd)) return;
    if (!isCreator) {
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "OWNER MENU",
            id: `.ownermenu`
          })
        }
      ];
      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: "*📛 THIS IS AN OWNER COMMAND*"
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Block"
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
      return gss.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    }
    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    await gss.updateBlockStatus(users, 'block')
      .then((res) => {
        const buttons = [
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "UNBLOCK",
              id: `.unblock ${users.split('@')[0]}`
            })
          }
        ];
        const msg = generateWAMessageFromContent(m.from, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `Blocked ${users.split('@')[0]} successfully.`
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "Block"
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
        gss.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
      })
      .catch((err) => {
        const buttons = [
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "TRY AGAIN",
              id: `.block ${users.split('@')[0]}`
            })
          }
        ];
        const msg = generateWAMessageFromContent(m.from, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `Failed to block user: ${err}`
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "Block"
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
        gss.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
      });
  }