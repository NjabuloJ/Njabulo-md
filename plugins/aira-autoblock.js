import config from '../config.cjs';
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

const autoblockCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autoblock') {
    if (!isCreator) return Matrix.sendMessage(m.from, {
      text: "*📛 ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ*",
      viewOnce: true,
    }, { quoted: m });
    let responseMessage;
    const buttons = [
      {
        buttonId: `.autoblock ${toFancyFont("on")}`,
        buttonText: { displayText: `${toFancyFont("on")}` },
        type: 1,
      },
      {
        buttonId: `.autoblock ${toFancyFont("off")}`,
        buttonText: { displayText: `${toFancyFont("off")}` },
        type: 1,
      },
    ];

    if (!text) {
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
          text: `Usage:\n- \`${prefix}autoblock ${toFancyFont("on")}\`: Enable Auto-Block\n- \`${prefix}autoblock ${toFancyFont("off")}\`: Disable Auto-Block`,
          ...messageOptions,
        },
        { quoted: m }
      );
    }

    if (text === 'on') {
      config.AUTO_BLOCK = true;
      responseMessage = "Auto-Block has been enabled.";
    } else if (text === 'off') {
      config.AUTO_BLOCK = false;
      responseMessage = "Auto-Block has been disabled.";
    } else {
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
          text: `Usage:\n- \`${prefix}autoblock ${toFancyFont("on")}\`: Enable Auto-Block\n- \`${prefix}autoblock ${toFancyFont("off")}\`: Disable Auto-Block`,
          ...messageOptions,
        },
        { quoted: m }
      );
    }
    try {
      await Matrix.sendMessage(m.from, { text: responseMessage, viewOnce: true }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.', viewOnce: true }, { quoted: m });
    }
  }
};

export default autoblockCommand;