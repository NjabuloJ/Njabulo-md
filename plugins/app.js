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

const apkDownloader = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!["apk", "app", "application"].includes(cmd)) return;
  if (!query) {
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
    return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Usage: " + prefix + "apk <App Name>")}*`, ...messageOptions }, { quoted: m });
  }

  try {
    await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(query)}/limit=1`;
    const { data } = await axios.get(apiUrl);

    if (!data?.datalist?.list?.length) {
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("No results found for the given app name!")}*`, ...message]Options }, { quoted: m });
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `*${toFancyFont("ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ")}*\n\n*${toFancyFont("Name:")}* ${app.name}\n*${toFancyFont("Size:")}* ${appSize} MB\n*${toFancyFont("Package:")}* ${app.package}\n*${toFancyFont("Updated On:")}* ${app.updated}\n*${toFancyFont("Developer:")}* ${app.developer.name}\n\n*${toFancyFont("ᴍᴀᴅᴇ ʙʏ ᴄʀᴇᴡ sʟᴀʏᴇʀ")}`;

    await Matrix.sendMessage(m.from, { react: { text: "⬆️", key: m.key } });

    await Matrix.sendMessage(m.from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363299029326322@newsletter",
          newsletterName: "ᴅᴇᴍᴏɴ sʟᴀʏᴇʀ",
          serverMessageId: 143,
        },
      },
    }, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("APK Downloader Error:", error);
    const buttons = [
      {
        buttonId: `.apk`,
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
    Matrix.sendMessage(m.from, { text: `*${toFancyFont("An error occurred while fetching the APK. Please try again!")}*`, ...messageOptions }, { quoted: m });
  }
};

export default apkDownloader;