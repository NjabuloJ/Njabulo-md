import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from 'baileys-pro ';
const { generateWAMessageFromContent, proto } = pkg;

async function handleCommand(m, gss) {
  if (config.AUTO_TYPING && m.from) {
    gss.sendPresenceUpdate("composing", m.from);
  }
  if (config.AUTO_RECORDING && m.from) {
    gss.sendPresenceUpdate("recording", m.from);
  }
  if (m.from) {
    gss.sendPresenceUpdate(config.ALWAYS_ONLINE ? 'available' : 'unavailable', m.from);
  }
  if (config.AUTO_READ) {
    await gss.readMessages([m.key]);
  }
  if (config.AUTO_BLOCK && m.sender.startsWith('212')) {
    await gss.updateBlockStatus(m.sender, 'block');
  }

  // Example of adding buttons to a message
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const buttons = [
    {
      "name": "quick_reply",
      "buttonParamsJson": JSON.stringify({
        display_text: "Menu",
        id: `${prefix}menu`
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
            text: 'Hello, how can I assist you?'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "Bot"
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
}

export default handleCommand;