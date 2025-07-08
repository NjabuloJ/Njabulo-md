import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const ping = async (m, sock) => {
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';
  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React('✈');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;
    const text = `*NנɐႦυℓσ נႦ​ ѕρєє∂: ${responseTime.toFixed(2)} s_*`;
    const buttons = [
      {
        buttonId: `${prefix}menu`,
        buttonText: { displayText: `📖 ${toFancyFont("MENU")}` },
        type: 1,
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
              text
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "> ✆︎Pσɯҽɾҽԃ Ⴆყ NנɐႦυℓσ נႦ"
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
    sock.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
}

export default ping;
