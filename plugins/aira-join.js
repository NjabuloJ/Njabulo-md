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

const joinGroup = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const args = text.split(' ');

    const validCommands = ['join'];

    if (!validCommands.includes(cmd)) return;
    
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
      return m.reply(`*${toFancyFont("THIS IS AN OWNER COMMAND")}`, messageOptions);
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
      return m.reply(`*${toFancyFont("Enter The Group Link!")}`, messageOptions);
    }
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) {
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
      return m.reply(`*${toFancyFont("INVALID LINK!")}`, messageOptions);
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
    m.reply(`*${toFancyFont("Please wait...")}`, messageOptions);
    const result = args[0].split('https://chat.whatsapp.com/')[1];

    await gss.groupAcceptInvite(result)
      .then((res) => m.reply(`*${toFancyFont("SUCCESSFULLY JOINED THE GROUP.")} ${JSON.stringify(res)}`, messageOptions))
      .catch((err) => m.reply(`*${toFancyFont("FAILED TO JOIN THE GROUP.")} ${JSON.stringify(err)}`, messageOptions));
  } catch (error) {
    console.error('Error:', error);
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
    m.reply(`*${toFancyFont("An error occurred while processing the command.")}`, messageOptions);
  }
};

const isUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default joinGroup;