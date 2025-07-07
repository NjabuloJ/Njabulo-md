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
          "buttonId": "ping_button",
          "buttonText": {
            "displayText": "🔄 Ping Again"
          },
          "type": 1,
          "buttonParamsJson": JSON.stringify({
            display_text: "🔄 Ping Again",
            id: "ping_button",
            name: "Ping"
          })
        }
      ];
      const buttonMessage = {
        text: message,
        footer: "Toxic-MD Speed",
        buttons: buttons,
        headerType: 1
      };
      await Matrix.sendMessage(m.from, buttonMessage, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Ping error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈ │❒ *Toxic-MD* hit a snag! Error: ${error.message || "Failed to check speed"} 😡 ◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default ping;