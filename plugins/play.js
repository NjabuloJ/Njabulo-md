import axios from "axios";
import yts from "yt-search";
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

const play2 = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "play2") {
    if (!args) {
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
      return gss.sendMessage(m.from, {
        text: `*${toFancyFont("Please provide a YouTube link or song name")}\n*${toFancyFont("Example: .play2 Moye Moye")}\n*${toFancyFont("Or: .play2 https://youtu.be/xyz")}`,
        ...messageOptions,
      }, { quoted: m });
    }

    try {
      const searchResults = await yts(args);
      if (!searchResults.videos.length) {
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
        return gss.sendMessage(m.from, {
          text: `*${toFancyFont("No results found")}`,
          ...messageOptions,
        }, { quoted: m });
      }

      const video = searchResults.videos[0];
      const buttons = [
        {
          buttonId: `.getaudio ${video.url}`,
          buttonText: { displayText: `${toFancyFont("Get Audio")}` },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      gss.sendMessage(m.from, {
        text: `*${toFancyFont(video.title)}*\n\n*${toFancyFont("Duration: " + video.duration.timestamp)}*\n*${toFancyFont("Views: " + video.views)}*\n\n*${toFancyFont("Click Get Audio to download the song")}`,
        ...messageOptions,
      }, { quoted: m });

    } catch (error) {
      console.error(error);
      const buttons = [
        {
          buttonId: `.play2 ${args}`,
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
      gss.sendMessage(m.from, {
        text: `*${toFancyFont("An error occurred: " + error.message)}`,
        ...messageOptions,
      }, { quoted: m });
    }
  }

  if (m.body.startsWith(".getaudio ")) {
    const videoUrl = m.body.slice(10).trim();
    try {
      const apiUrl = `https://api.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.success) {
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
        return gss.sendMessage(m.from, {
          text: `*${toFancyFont("Failed to download audio")}`,
          ...messageOptions,
        }, { quoted: m });
      }

      await gss.sendMessage(
        m.from,
        { 
          audio: { url: data.result.downloadUrl },
          mimetype: 'audio/mpeg'
        },
        { quoted: m }
      );

    } catch (error) {
      console.error(error);
      const buttons = [
        {
          buttonId: `.getaudio ${videoUrl}`,
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
      gss.sendMessage(m.from, {
        text: `*${toFancyFont("An error occurred: " + error.message)}`,
        ...messageOptions,
      }, { quoted: m });
    }
  }
};

export default play2;