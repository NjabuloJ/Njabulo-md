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

const lyricsCommand = async (m, Matrix) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    const validCommands = ['lyrics'];
    if (!validCommands.includes(cmd)) return;
    if (!text) {
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
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("Please provide a song name to get the lyrics.")}*`,
        ...messageOptions,
      }, { quoted: m });
    }
    await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Searching for lyrics, please wait...")}*` }, { quoted: m });
    const result = await lyricsv2(text).catch(async () => await lyrics(text));
    if (!result) {
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
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("No lyrics found for the provided song.")}*`,
        ...messageOptions,
      }, { quoted: m });
    }
    const replyMessage = `*${toFancyFont("Title:")}* ${toFancyFont(result.title)}\n*${toFancyFont("Author:")}* ${toFancyFont(result.author)}\n*${toFancyFont("Url:")}* ${result.link}\n*${toFancyFont("Lyrics:")}*\n\n${result.lyrics}`.trim();
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
    Matrix.sendMessage(m.from, {
      text: replyMessage,
      ...messageOptions,
    }, { quoted: m });
  } catch (error) {
    console.error('Error:', error);
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
    Matrix.sendMessage(m.from, {
      text: `*${toFancyFont("An error occurred while processing the command.")}*`,
      ...messageOptions,
    }, { quoted: m });
  }
};

export default lyricsCommand;