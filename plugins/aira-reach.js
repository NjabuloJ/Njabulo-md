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

const autoreactCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "autoreact") return;

    if (!isCreator) {
      const buttons = [
        {
          buttonId: `.menu`,
          buttonText: { displayText: `${toFancyFont("Menu")}` },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("Get the fuck outta here, wannabe! Only Toxic-MD’s boss runs this show!")}*`,
        ...messageOptions,
      }, { quoted: m });
    }

    if (!text) {
      const buttons = [
        {
          buttonId: `.autoreact on`,
          buttonText: { displayText: `${toFancyFont("On")}` },
          type: 1,
        },
        {
          buttonId: `.autoreact off`,
          buttonText: { displayText: `${toFancyFont("Off")}` },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("Yo, dipshit, tell Toxic-MD on or off! Don’t just stand there!")}*`,
        ...messageOptions,
      }, { quoted: m });
    }

    if (!["on", "off"].includes(text)) {
      const buttons = [
        {
          buttonId: `.autoreact on`,
          buttonText: { displayText: `${toFancyFont("On")}` },
          type: 1,
        },
        {
          buttonId: `.autoreact off`,
          buttonText: { displayText: `${toFancyFont("Off")}` },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("What’s this bullshit? Toxic-MD only takes on or off, you moron!")}*`,
        ...messageOptions,
      }, { quoted: m });
    }

    config.AUTO_REACT = text === "on";

    try {
      fs.writeFileSync("./config.js", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("Toxic-MD choked tryin’ to save that, fam! Server’s actin’ like a bitch!")}*`,
      }, { quoted: m });
    }

    const buttons = [
      {
        buttonId: `.menu`,
        buttonText: { displayText: `${toFancyFont("Menu")}` },
        type: 1,
      },
    ];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    await Matrix.sendMessage(m.from, {
      text: `*${toFancyFont(`Toxic-MD auto-react flipped to ${text}! You’re ownin’ this game, boss!`)}*`,
      ...messageOptions,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Autoreact error: ${error.message}`);
    const buttons = [
      {
        buttonId: `.autoreact`,
        buttonText: { displayText: `${toFancyFont("Try Again")}` },
        type: 1,
      },
    ];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    await Matrix.sendMessage(m.from, {
      text: `*${toFancyFont("Toxic-MD fucked up somewhere, fam! Smash it again!")}*`,
      ...messageOptions,
    }, { quoted: m });
  }
};

export default autoreactCommand;