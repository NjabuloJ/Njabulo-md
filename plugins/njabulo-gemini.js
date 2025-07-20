import axios from 'axios';
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

const gemini = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const prompt = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['gemini'];

  if (validCommands.includes(cmd)) {
    if (!prompt) {
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
      await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Please give me a prompt")}`, ...messageOptions }, { quoted: m });
      return;
    }

    try {
      await m.React("⏳");

      const apiUrl = `https://api.giftedtech.web.id/api/ai/geminiai?apikey=gifted_api_se5dccy&q=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.status === 200 && data.success) {
        const answer = data.result;
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
        await Matrix.sendMessage(m.from, { text: answer, ...messageOptions }, { quoted: m });
        await m.React("✅");
      } else {
        throw new Error('Invalid response from the API.');
      }
    } catch (err) {
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
      await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Something went wrong")}`, ...messageOptions }, { quoted: m });
      console.error('Error: ', err);
      await m.React("❌");
    }
  }
};

export default gemini;