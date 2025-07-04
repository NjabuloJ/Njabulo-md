import config from "../config.cjs";
import pkg from "baileys-pro";

const ping = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const validCommands = ["ping", "speed", "p"];
    if (validCommands.includes(cmd)) {
      const start = new Date().getTime();
      const reactionEmojis = ["🔥", "💖", "🚀", "💨", "🎯", "🎉", "🌟", "💥", "🕐", "🔹"];
      const textEmojis = ["💎", "🏆", "⚡", "🎖", "🎶", "🌠", "🌀", "🔱", "🚀", "✩"];
      const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
      let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
      while (textEmoji === reactionEmoji) {
        textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
      }
      await m.React(textEmoji);
      const end = new Date().getTime();
      const responseTime = (end - start) / 1000;
      const message = `◈━━━━━━━━━━━━━━━━◈ │❒ Toxic-MD speed - ${responseTime.toFixed(1)}s! ${reactionEmoji} ◈━━━━━━━━━━━━━━━━◈`;
      const buttons = [
        {
          buttonId: 'alive',
          buttonText: { displayText: 'Alive' },
          type: 1
        },
        {
          buttonId: 'help',
          buttonText: { displayText: 'Help' },
          type: 1
        },
        {
          buttonId: 'support',
          buttonText: { displayText: 'Support' },
          type: 1
        }
      ];
      await Matrix.sendMessage(m.from, {
        text: message,
        buttons: buttons,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            showAdAttribution: true,
           title: "Toxic-MD Speed",
            body: "Checking your connection speed with Toxic-MD!",
            sourceUrl: "https://github.com/xhclintohn/Toxic-MD",
            mediaType: 1,
            renderLargerThumbnail: true,
            mediaUrl: "https://files.catbox.moe/zaqn1j.jpg",
            thumbnailUrl: "https://files.catbox.moe/zaqn1j.jpg",                  
          },
        },
      }, { quoted: m });
    }
  })
