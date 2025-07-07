import config from "../config.cjs";
import pkg from "baileys-pro";

const alive = async (m, Matrix) => {
  try {
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";

    if (!["alive", "uptime", "runtime"].includes(cmd)) return;

    const reactionEmojis = ["🔥", "💖", "🚀", "💨", "🎯", "🎉", "🌟", "💥", "🕐", "🔹"];
    const textEmojis = ["💎", "🏆", "⚡", "🎖", "🎶", "🌠", "🌀", "🔱", "🚀", "✩"];
    const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

    while (textEmoji === reactionEmoji) {
      textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    }

    await m.React(textEmoji);

    let buttonId;
    let displayText;
    let message;
    switch (cmd) {
      case "alive":
        message = `◈━━━━━━━━━━━━━━━━◈ │❒ Toxic-MD alive! ${reactionEmoji} ◈━━━━━━━━━━━━━━━━◈`;
        buttonId = "alive_button";
        displayText = "👋 Alive";
        break;
      case "uptime":
        message = `◈━━━━━━━━━━━━━━━━◈ │❒ Toxic-MD uptime: ${timeString}! ${reactionEmoji} ◈━━━━━━━━━━━━━━━━◈`;
        buttonId = "uptime_button";
        displayText = "⏰ Uptime";
        break;
      case "runtime":
        message = `◈━━━━━━━━━━━━━━━━◈ │❒ Toxic-MD runtime: ${timeString}! ${reactionEmoji} ◈━━━━━━━━━━━━━━━━◈`;
        buttonId = "runtime_button";
        displayText = "⏱️ Runtime";
        break;
      default:
        return;
    }

    const buttons = [
      {
        "buttonId": buttonId,
        "buttonText": {
          "displayText": displayText
        },
        "type": 1,
        "buttonParamsJson": JSON.stringify({
          display_text: displayText,
          id: buttonId
        })
      }
    ];

    const buttonMessage = {
      text: message,
      footer: "Toxic-MD Status",
      buttons: buttons,
      headerType: 1
    };

    await Matrix.sendMessage(m.from, buttonMessage, { quoted: m });
  } catch (error) {
    console.error(`❌ Alive error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈ │❒ *Toxic-MD* hit a snag! Error: ${error.message || "Failed to check status"} 😡 ◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default alive;