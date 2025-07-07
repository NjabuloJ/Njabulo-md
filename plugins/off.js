import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'alwaysonline') {
    if (!isCreator) return m.reply("* THIS IS AN OWNER COMMAND*");

    let responseMessage;
    if (text === 'on') {
      config.ALWAYS_ONLINE = true;
      responseMessage = "Always Online has been enabled.";
    } else if (text === 'off') {
      config.ALWAYS_ONLINE = false;
      responseMessage = "Always Online has been disabled.";
    } else {
      responseMessage = "Usage:\n- `alwaysonline on`: Enable Always Online\n- `alwaysonline off`: Disable Always Online";
    }

    const buttons = [
      {
        buttonId: `${prefix}menu`,
        buttonText: {
          displayText: `📖 MENU`
        },
        type: 1,
      },
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
              text: responseMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Always Online"
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

    try {
      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, {
        text: 'Error processing your request.'
      }, {
        quoted: m
      });
    }
  }
};

export default alwaysonlineCommand;
