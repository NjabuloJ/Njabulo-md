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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const imageCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const query = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['image', 'img', 'gimage'];

  if (validCommands.includes(cmd)) {
  
    if (!query && !(m.quoted && m.quoted.text)) {
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
      return sock.sendMessage(m.from, { text: `*${toFancyFont("Please provide some text, Example usage: " + prefix + cmd + " black cats")}`, ...messageOptions });
    }
  
    if (!query && m.quoted && m.quoted.text) {
      query = m.quoted.text;
    }

    const numberOfImages = 5; 

    try {
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
      await sock.sendMessage(m.from, { text: `*${toFancyFont("Please wait...")}`, ...messageOptions });

      const images = [];

      for (let i = 0; i < numberOfImages; i++) {
        const endpoint = `https://api.guruapi.tech/api/googleimage?text=${encodeURIComponent(query)}`;
        const response = await axios.get(endpoint, { responseType: 'arraybuffer' });

        if (response.status === 200) {
          const imageBuffer = Buffer.from(response.data, 'binary');
          images.push(imageBuffer);
        } else {
          throw new Error('Image generation failed');
        }
      }

      for (let i = 0; i < images.length; i++) {
        await sleep(500);
        await sock.sendMessage(m.from, { image: images[i], caption: '' }, { quoted: m });
      }
      await m.React("✅");
    } catch (error) {
      console.error("Error fetching images:", error);
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
      await sock.sendMessage(m.from, { text: `*${toFancyFont("Oops! Something went wrong while generating images. Please try again later.")}`, ...messageOptions });
    }
  }
};

export default imageCommand;