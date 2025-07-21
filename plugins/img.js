import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;
const gis = require('g-i-s');

function toFancyFont(text, isUpperCase = false) {
  const fonts = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ғ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "s",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ",
  };
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

const img = async (m, Matrix) => {
  const prefix = config.PREFIX || ".";
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";
  if (cmd === "imgi") {
    const searchTerm = m.body.slice(prefix.length + 4).trim();
    if (!searchTerm) {
      await m.reply("Which image?");
      return;
    }

    gis(searchTerm, async (error, results) => {
      if (error) {
        await m.reply("Oops, an error occurred.");
        return;
      }

      if (!results || results.length === 0) {
        await m.reply("No images found.");
        return;
      }

      for (let i = 0; i < Math.min(results.length, 5); i++) {
        await Matrix.sendMessage(m.from, {
          image: { url: results[i].url },
          caption: `*${toFancyFont("Downloaded by Njabulo Jb")}*`,
          contextInfo: {
            mentionedJid: [m.sender],
          },
        }, { quoted: m });
      }
    });
  }
};

export default img;
