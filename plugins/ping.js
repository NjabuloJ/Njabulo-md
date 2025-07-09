import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  try {
    // ... rest of your code
    const message =` Njabulo Jb alive - ${timeString}! ${reactionEmoji}`;
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "PING",
          id: `.ping`
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
    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: message
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Njabulo Jb Status"
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
  } catch (error) {
    // ... rest of your code
  }
};

export default alive;
