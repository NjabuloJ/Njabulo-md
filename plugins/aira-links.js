import config from '../config.cjs';
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

const linkgc = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['invite', 'grouplink'];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) {
      const buttons = [
        {
          buttonId: `.help`,
          buttonText: { displayText: `💬${toFancyFont("Help")}` },
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
      return m.reply(`*${toFancyFont("THIS COMMAND CAN ONLY BE USED IN GROUPS")}`, messageOptions);
    }
    const groupMetadata = await gss.groupMetadata(m.from);
    const botNumber = await gss.decodeJid(gss.user.id);
    const isBotAdmins = groupMetadata.participants.find(p => p.id === botNumber)?.admin;

    if (!isBotAdmins) {
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
      return m.reply(`*${toFancyFont("BOT MUST BE AN ADMIN TO USE THIS COMMAND.")}`, messageOptions);
    }

    const response = await gss.groupInviteCode(m.from);
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
    await gss.sendMessage(m.from, {
      text: `*${toFancyFont("Group Link: ")}https://chat.whatsapp.com/${response}\n\n*${toFancyFont("Group Name: ")}${groupMetadata.subject}`,
      detectLink: true,
      ...messageOptions,
    });

  } catch (error) {
    console.error('Error:', error);
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
    m.reply(`*${toFancyFont("An error occurred while processing the command.")}`, messageOptions);
  }
};

export default linkgc;
