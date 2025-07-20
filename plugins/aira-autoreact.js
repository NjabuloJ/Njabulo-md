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

const autoreactCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "autoreact") return;

    if (!isCreator) {
      return Matrix.sendMessage(m.from, {
        text: `Get the fuck outta here, wannabe! Only *Toxic-MD*’s boss runs this show! 😤🔪`,
        viewOnce: true,
      }, { quoted: m });
    }

    if (!text) {
      const buttons = [
        {
          buttonId: `.autoreact ${toFancyFont("on")}`,
          buttonText: { displayText: `${toFancyFont("on")}` },
          type: 1,
        },
        {
          buttonId: `.autoreact ${toFancyFont("off")}`,
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
          text: `Yo, dipshit, tell *Toxic-MD* *${toFancyFont("on")}* or *${toFancyFont("off")}*! Don’t just stand there! 😆`,
          ...messageOptions,
        },
        { quoted: m }
      );
    }

    if (!["on", "off"].includes(text)) {
      return Matrix.sendMessage(m.from, {
        text: `What’s this bullshit? *Toxic-MD* only takes *${toFancyFont("on")}* or *${toFancyFont("off")}`, you moron! 🤡`,
        viewOnce: true,
      }, { quoted: m });
    }

    config.AUTO_REACT = text === "on";

    try {
      fs.writeFileSync("./config.js", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      return Matrix.sendMessage(m.from, {
        text: `*Toxic-MD* choked tryin’ to save that, fam! Server’s actin’ like a bitch! 😣`,
        viewOnce: true,
      }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, {
      text: `*Toxic-MD* auto-react flipped to *${toFancyFont(text)}*! You’re ownin’ this game, boss! 💪🔥`,
      viewOnce: true,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Autoreact error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `*Toxic-MD* fucked up somewhere, fam! Smash it again! 😈`,
      viewOnce: true,
    }, { quoted: m });
  }
};

export default autoreactCommand;