import fs from "fs";
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;

function toFancyFont(text) {
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
  return text
    .toLowerCase()
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

const anticallCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "anticall") return;

    if (!isCreator) {
      return Matrix.sendMessage(m.from, {
        text: `Step off, loser! Only *Toxic-MD*’s boss can fuck with this! 😤🔪`,
      }, { quoted: m });
    }

    if (!text) {
      const buttons = [
        {
          buttonId: `.anticall ${toFancyFont("on")}`,
          buttonText: { displayText: `${toFancyFont("on")}` },
          type: 1,
        },
        {
          buttonId: `.anticall ${toFancyFont("off")}`,
          buttonText: { displayText: `${toFancyFont("off")}` },
          type: 1,
        },
      ];
      const messageOptions = {
        viewOnce: true,
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(
        m.from,
        {
          text: `Yo, braindead, tell *Toxic-MD* *${toFancyFont("on")}* or *${toFancyFont("off")}*! Don’t waste my time! 😆`,
          ...messageOptions,
        },
        { quoted: m }
      );
    }

    if (!["on", "off"].includes(text)) {
      return Matrix.sendMessage(m.from, {
        text: `What’s this garbage? *Toxic-MD* only takes *${toFancyFont("on")}* or *${toFancyFont("off")}`, you clown! 🤡`,
      }, { quoted: m });
    }

    config.REJECT_CALL = text === "on";

    try {
      fs.writeFileSync("./config.js", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      return Matrix.sendMessage(m.from, {
        text: `*Toxic-MD* choked tryin’ to save that, fam! Server’s trash! 😣`,
      }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, {
      text: `*Toxic-MD* anti-call flipped to *${toFancyFont(text)}*! You’re lockin’ it down, boss! 💪🔥`,
      viewOnce: true,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Anticall error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `*Toxic-MD* screwed up somewhere, fam! Hit it again! 😈`,
      viewOnce: true,
    }, { quoted: m });
  }
};

export default anticallCommand;