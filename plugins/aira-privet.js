import fs from "fs";
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;

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

const modeCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "mode") return;

    if (!isCreator) {
      const buttons = [
        {
          buttonId: `.owner`,
          buttonText: { displayText: `${toFancyFont("Contact Owner")}` },
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Back off, scrub! Only Toxic-MD’s king can mess with this!")}`, ...messageOptions }, { quoted: m });
    }

    if (!text) {
      const buttons = [
        {
          buttonId: `.help`,
          buttonText: { displayText: `${toFancyFont("Help")}` },
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Yo, genius, tell Toxic-MD what mode! Use public or private, dumbass!")}`, ...messageOptions }, { quoted: m });
    }

    if (!["public", "private"].includes(text)) {
      const buttons = [
        {
          buttonId: `.help`,
          buttonText: { displayText: `${toFancyFont("Help")}` },
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("What’s this trash? Toxic-MD only takes public or private! Get it right, clown!")}`, ...messageOptions }, { quoted: m });
    }

    config.MODE = text;
    Matrix.public = text === "public";

    try {
      fs.writeFileSync("./config.cjs", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      const buttons = [
        {
          buttonId: `.report`,
          buttonText: { displayText: `${toFancyFont("Report")}` },
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Toxic-MD choked tryin’ to save that mode, fam! Server’s actin’ weak!")}`, ...messageOptions }, { quoted: m });
    }

    const buttons = [
      {
        buttonId: `.menu`,
        buttonText: { displayText: `${toFancyFont("Menu")}` },
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
    await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Toxic-MD flipped to " + text + " mode! You’re runnin’ this shit now, boss!")}`, ...messageOptions }, { quoted: m });
  } catch (error) {
    console.error(`❌ Mode error: ${error.message}`);
    const buttons = [
      {
        buttonId: `.report`,
        buttonText: { displayText: `${toFancyFont("Report")}` },
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
    await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Toxic-MD fucked up somewhere, fam! Try that again!")}`, ...messageOptions }, { quoted: m });
  }
};

export default modeCommand;