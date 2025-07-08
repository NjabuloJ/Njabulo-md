import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

//...

const buttons = [
  {
    "name": "quick_reply",
    "buttonParamsJson": JSON.stringify({
      display_text: "CALCULATOR",
      id: `.calc`
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
          text: `*${format}* = _${result}_`
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
          text: "Calculator"
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