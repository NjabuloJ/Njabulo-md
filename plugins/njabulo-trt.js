import Tesseract from 'tesseract.js';
import translate from 'translate-google-api';
import { writeFile } from 'fs/promises';
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

const translateCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['translate', 'trt'];

  if (validCommands.includes(cmd)) {
    const targetLang = args[0];
    const text = args.slice(1).join(' ');

    if (m.quoted) {
      if (m.quoted.mtype === 'imageMessage') {
        try {
          const media = await m.quoted.download();
          if (!media) throw new Error('Failed to download media.');

          const filePath = `./${Date.now()}.png`;
          await writeFile(filePath, media);
          const { data: { text: extractedText } } = await Tesseract.recognize(filePath, 'eng', {
            logger: m => console.log(m)
          });

          const result = await translate(extractedText, { to: targetLang });
          const translatedText = result[0];

          const responseMessage = `*${toFancyFont(targetLang)}:*\n\n${translatedText}`;
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
          await sock.sendMessage(m.from, { text: responseMessage, ...messageOptions }, { quoted: m });
        } catch (error) {
          console.error("Error extracting and translating text from image:", error);
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
          await sock.sendMessage(m.from, { text: `*${toFancyFont("Error extracting and translating text from image.")}`, ...messageOptions }, { quoted: m });
        }
      } else if (m.quoted.text) {
        try {
          const quotedText = m.quoted.text;
          const result = await translate(quotedText, { to: targetLang });
          const translatedText = result[0];

          const responseMessage = `*${toFancyFont(targetLang)}:*\n\n${translatedText}`;
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
          await sock.sendMessage(m.from, { text: responseMessage, ...messageOptions }, { quoted: m });
        } catch (error) {
          console.error("Error translating quoted text:", error);
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
          await sock.sendMessage(m.from, { text: `*${toFancyFont("Error translating quoted text.")}`, ...messageOptions }, { quoted: m });
        }
      }
    } else if (text && targetLang) {
      try {
        const result = await translate(text, { to: targetLang });
        const translatedText = result[0];

        const responseMessage = `*${toFancyFont(targetLang)}:*\n\n${translatedText}`;
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
        await sock.sendMessage(m.from, { text: responseMessage, ...messageOptions }, { quoted: m });
      } catch (error) {
        console.error("Error translating text:", error);
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
        await sock.sendMessage(m.from, { text: `*${toFancyFont("Error translating text.")}`, ...messageOptions }, { quoted: m });
      }
    } else {
      const responseMessage = `*${toFancyFont("Usage: " + prefix + "translate <target_lang> <text>")}\n*${toFancyFont("Example: " + prefix + "translate en कैसे हो भाई")}\n*${toFancyFont("Or reply to an image/text message with " + prefix + "translate <target_lang>")}`;
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
      await sock.sendMessage(m.from, { text: responseMessage, ...messageOptions }, { quoted: m });
    }
  }
};

export default translateCommand;