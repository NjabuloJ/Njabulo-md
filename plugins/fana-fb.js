import axios from "axios";
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

const facebook = async (m, Matrix) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const query = m.body.slice(prefix.length + cmd.length).trim();

    if (!["fb", "facebook"].includes(cmd)) return;

    if (!query || !query.startsWith("http")) {
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Yo, dumbass, gimme a proper Facebook video URL!")}*`, ...messageOptions }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const { data } = await axios.get(`https://api.giftedtech.web.id/api/download/facebook?apikey=gifted_api_se5dccy&url=${encodeURIComponent(query)}`);

    if (!data.success || !data.result) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Njabulo Jb couldn’t grab that video, fam! URL’s trash or somethin’s busted!")}`, ...messageOptions }, { quoted: m });
    }

    const { title, hd_video, sd_video, thumbnail } = data.result;
    const videoUrl = hd_video || sd_video;

    if (!videoUrl) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("No video worth downloadin’ here, fam! Toxic-MD ain’t got time for this shit!")}`, ...messageOptions }, { quoted: m });
    }

    const quality = hd_video ? "HD" : "SD";
    const caption = `*${toFancyFont("Aira Facebook Video")}*\n*${toFancyFont("Title")}:* ${title || "No title"}\n*${toFancyFont("Quality")}:* ${quality}`;

    await Matrix.sendMessage(m.from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption,
    }, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });
  } catch (error) {
    console.error(`❌ Facebook error: ${error.message}`);
    await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
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
    Matrix.sendMessage(m.from, { text: `*${toFancyFont("Njabulo Jb fucked up grabbin’ that video, fam! Try again, you got this!")}`, ...messageOptions }, { quoted: m });
  }
};

export default facebook;
