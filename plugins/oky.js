import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

function toFancyFont(text, isUpperCase = false) {
  const fonts = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
  };
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

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

    if (!["ale", "upime", "rtime"].includes(cmd)) return;

    const reactionEmojis = ["🔥", "💖", "🚀", "💨", "🎯", "🎉", "🌟", "💥", "🕐", "🔹"];
    const textEmojis = ["💎", "🏆", "⚡", "🎖", "🎶", "🌠", "🌀", "🔱", "🚀", "✩"];
    const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

    while (textEmoji === reactionEmoji) {
      textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    }

    await m.React(textEmoji);

    const message = ` • .This it bot have program multi\n • .Njabulo Jb alive - *${timeString}!*\n • .Tap button see more`;
    const messageOptions = {
     viewOnce: true,
      buttons: [
        {
          buttonId: `.ping`,
          buttonText: { displayText: `📊 ${toFancyFont("Ping")}` },
          type: 1,
        },
        {
          buttonId: `.menu`,
          buttonText: { displayText: `📋 ${toFancyFont("Menu")}` },
          type: 1,
        },
      ],
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: true,
          title: toFancyFont("Njabulo Jb"),
          body: toFancyFont("Alive"),
          sourceUrl: "https://github.com/your-repo",                      
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    };

    await Matrix.sendMessage(m.from, {
      text: message,
      ...messageOptions,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Alive error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: ` *Njabulo Jb* hit a snag! Error: ${error.message || "Failed to check status"}`,
    }, {
      quoted: m
    });
  }
};

export default alive;
