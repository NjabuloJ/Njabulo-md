import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

// Main command function
const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();
  const validCommands = ['autostatus', 'autosview', 'autostatusview'];
  if (validCommands.includes(cmd)){
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
                text: "Auto Status"
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
      return Matrix.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    }
    let responseMessage;
    if (text === 'on') {
      config.AUTO_STATUS_SEEN = true;
      responseMessage = "AUTO STATUS SEEN has been enabled.";
    } else if (text === 'off') {
      config.AUTO_STATUS_SEEN = false;
      responseMessage = "AUTO STATUS SEEN has been disabled.";
    } else {
      responseMessage = `Usage:\n- *${prefix + cmd} ON:* Enable AUTO STATUS VIEW\n- *${prefix + cmd} off:* Disable AUTO STATUS SEEN`;
    }
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "ON",
          id: `.autostatus on`
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "OFF",
          id: `.autostatus off`
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
              text: responseMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Auto Status"
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
    Matrix.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
  }
};

export default anticallCommand;