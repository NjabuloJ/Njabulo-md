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
    return Matrix.sendMessage(m.from, { text: "❌ *Usage:* `.apk <App Name>`", ...messageOptions }, { quoted: m });
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
        {
          buttonId: `.search ${query}`,
          buttonText: { displayText: `${toFancyFont("Search Again")}` },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, { text: "⚠️ *No results found for the given app name.*", ...messageOptions }, { quoted: m });
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `╭━━━〔 *ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ* 〕━━━┈⊷
┃  *Name:* ${app.name}
┃  *Size:* ${appSize} MB
┃  *Package:* ${app.package}
┃  *Updated On:* ${app.updated}
┃  *Developer:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
> *ᴍᴀᴅᴇ ʙʏ ᴄʀᴇᴡ sʟᴀʏᴇʀ*`;

    const buttons = [
      {
        buttonId: `.menu`,
        buttonText: { displayText: `${toFancyFont("Menu")}` },
        type: 1,
      },
      {
        buttonId: `.search ${query}`,
        buttonText: { displayText: `${toFancyFont("Search Again")}` },
        type: 1,
      },
    ];
    const messageOptions = {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption,
      buttons,
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
    };

    await Matrix.sendMessage(m.from, { react: { text: "⬆️", key: m.key } });

    await Matrix.sendMessage(m.from, messageOptions, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("APK Downloader Error:", error);
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
    Matrix.sendMessage(m.from, { text: "❌ *An error occurred while fetching the APK. Please try again.*", ...messageOptions }, { quoted: m });
  }
};

export default apkDownloader;