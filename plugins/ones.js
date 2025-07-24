import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;

const autotypingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slgice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autotypin') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_TYPING = true;
      responseMessage = "Auto-Typing has been enabled.";
    } else if (text === 'off') {
      config.AUTO_TYPING = false;
      responseMessage = "Auto-Typing has been disabled.";
    } else {
      const buttonMessage = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: "Auto-Typing is currently " + (config.AUTO_TYPING ? "enabled" : "disabled") + ". Please select an option:"
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Select an option"
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "Enable",
                      id: "autotyping on"
                    })
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "Disable",
                      id: "autotyping off"
                    })
                  }
                ],
              }),
              contextInfo: {
                viewOnce: true,
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              }
            }),
          },
        },
      }, {});

      return await Matrix.relayMessage(buttonMessage.key.remoteJid, buttonMessage.message, {
        messageId: buttonMessage.key.id
      });
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default autotypingCommand;