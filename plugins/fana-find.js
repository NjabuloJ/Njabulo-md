import fs from "fs";
import acrcloud from "acrcloud";
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

const acr = new acrcloud({
  host: "identify-eu-west-1.acrcloud.com",
  access_key: "716b4ddfa557144ce0a459344fe0c2c9",
  access_secret: "Lz75UbI8g6AzkLRQgTgHyBlaQq9YT5wonr3xhFkf",
});

const shazam = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ["namesong", "find", "whatmusic"];
    if (!validCommands.includes(cmd)) return;

    const quoted = m.quoted || {};
    if (!quoted || (quoted.mtype !== "audioMessage" && quoted.mtype !== "videoMessage")) {
      const buttons = [
        {
          buttonId: `.help`,
          buttonText: { displayText: `${toFancyFont("help")}` },
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
      return Matrix.sendMessage(m.from, { text: `*${toFancyFont("Yo, Aira needs a quoted audio or video to ID, fam!")}`, ...messageOptions }, { quoted: m });
    }

    try {
      const media = await m.quoted.download();
      const filePath = `./${Date.now()}.mp3`;
      fs.writeFileSync(filePath, media);

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
      await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Toxic-MD sniffin’ out that track, hold up...")}`, ...messageOptions }, { quoted: m });

      const res = await acr.identify(fs.readFileSync(filePath));
      const { code, msg } = res.status;

      if (code !== 0) {
        throw new Error(msg);
      }

      const { title, artists, album, genres, release_date } = res.metadata.music[0];
      const txt = `*${toFancyFont("Njabulo Jb IT!")}\n\n*${toFancyFont("Title")}:* ${title}\n*${toFancyFont("Artist")}:* ${artists ? artists.map((v) => v.name).join(", ") : "Unknown"}\n*${toFancyFont("Album")}:* ${album ? album.name : "Unknown"}\n*${toFancyFont("Genre")}:* ${genres ? genres.map((v) => v.name).join(", ") : "Unknown"}\n*${toFancyFont("Release")}:* ${release_date || "Unknown"}`;

      fs.unlinkSync(filePath);
      await Matrix.sendMessage(m.from, { text: txt, ...messageOptions }, { quoted: m });
    } catch (error) {
      console.error(`🎵 Shazam error: ${error.message}`);
      fs.unlinkSync(filePath); // Clean up even on error
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
      await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Aira couldn’t ID that track, fam! Try another!")}`, ...messageOptions }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Shazam error: ${error.message}`);
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
    await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Njabulo jb hit a glitch, fam! Retry that jam!")}`, ...messageOptions }, { quoted: m });
  }
};

export default shazam;
