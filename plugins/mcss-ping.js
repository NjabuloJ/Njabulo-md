import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";

const ping = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";
    const validCommands = ["ping", "speed", "p"];
    if (validCommands.includes(cmd)) {
      const start = new Date().getTime();
      const reactionEmojis = ["📡"];
      const textEmojis = ["💎", "🏆", "⚡", "🎖", "🎶", "🌠", "🌀", "🔱", "🚀", "✩"];
      const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
      let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
      while (textEmoji === reactionEmoji) {
        textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
      }
      await m.React(textEmoji);
      const end = new Date().getTime();
      const responseTime = (end - start) / 1000;
      const text = `┏──────────────⊷\n┊Njabulo Jb speed - ${responseTime.toFixed(1)}s!\n┗──────────────⊷`;
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "alive",
            id: `.alive`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "menu",
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
                text
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Pσɯҽɾҽԃ Ⴆყ NנɐႦυℓσ נႦ"
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
  } catch (error) {
    console.error(`❌ Ping error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: ` *Njabulo Jb* hit a snag! Error: ${error.message || "Failed to check speed"} `,
    }, { quoted: m });
  }
};

export default ping;
