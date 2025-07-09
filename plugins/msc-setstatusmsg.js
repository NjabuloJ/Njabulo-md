import config from '../config.cjs';
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'setstatusmsg') {
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
                text: "*📛 THIS IS AN OWNER COMMAND*"
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

    let responseMessage;

    if (text) {
      config.STATUS_READ_MSG = text;
      responseMessage = `Custom reply message has been set to: "${text}"`;
    } else {
      responseMessage = `Usage: *${prefix}setstatusmsg <message>* to set a custom reply message.`;
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
              text: responseMessage
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

export default anticallCommand;