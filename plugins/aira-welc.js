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

const gcEvent = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === "welcome") {
      if (!m.isGroup) {
        const buttons = [
          {
            buttonId: `.help`,
            buttonText: { displayText: `📃${toFancyFont("Help")}` },
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
        return Matrix.sendMessage(m.from, { text: `*${toFancyFont("This ain’t for lone wolves, fam! Use in a group!")}`, ...messageOptions }, { quoted: m });
      }

      const groupMetadata = await Matrix.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      const botNumber = await Matrix.decodeJid(Matrix.user.id);
      const botAdmin = participants.find((p) => p.id === botNumber)?.admin;
      const senderAdmin = participants.find((p) => p.id === m.sender)?.admin;

      if (!botAdmin) {
        const buttons = [
          {
            buttonId: `.promote`,
            buttonText: { displayText: `👤${toFancyFont("Promote Bot")}` },
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
        return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Toxic-MD needs admin powers to run this, fam!")}`, ...messageOptions }, { quoted: m });
      }

      if (!senderAdmin) {
        const buttons = [
          {
            buttonId: `.promote`,
            buttonText: { displayText: `👤${toFancyFont("Promote Self")}` },
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
        return Matrix.sendMessage(m.from, { text: `*${toFancyFont("You ain’t an admin, bruh! Step up or step out!")}`, ...messageOptions }, { quoted: m });
      }

      let responseMessage;
      if (text === "on") {
        config.WELCOME = true;
        responseMessage = `*${toFancyFont("Njabulo Jb welcome & left messages ON! Newbies beware!")}`;
      } else if (text === "off") {
        config.WELCOME = false;
        responseMessage = `*${toFancyFont("Njabulo Jb welcome & left messages OFF! Silent mode, fam!")}`;
      } else {
        responseMessage = `*${toFancyFont("Yo, use it right, fam!")}\n*${toFancyFont("- " + prefix + "welcome on: Enable welcome & left")}\n*${toFancyFont("- " + prefix + "welcome off: Disable welcome & left")}`;
      }

      const buttons = [
        {
          buttonId: `.menu`,
          buttonText: { displayText: `📃${toFancyFont("Menu")}` },
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
      await Matrix.sendMessage(m.from, { text: responseMessage, ...messageOptions }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Welcome error: ${error.message}`);
    const buttons = [
      {
        buttonId: `.report`,
        buttonText: { displayText: `⚠︎${toFancyFont("Report")}` },
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
    await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Njabulo Jb hit a snag, fam! Try again, we still savage!")}`, ...messageOptions }, { quoted: m });
  }
};

export default gcEvent;
