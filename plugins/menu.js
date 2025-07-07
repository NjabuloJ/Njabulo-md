import moment from "moment-timezone";
import fs from "fs";
import os from "os";
import pkg from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";
import axios from "axios";

// Time logic
const xtime = moment.tz("Africa/Nairobi").format("HH:mm:ss");
const xdate = moment.tz("Africa/Nairobi").format("DD/MM/YYYY");
const time2 = moment().tz("Africa/Nairobi").format("HH:mm:ss");
let pushwish = "";

if (time2 < "05:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "11:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "15:00:00") {
  pushwish = `Good Afternoon 🌅`;
} else if (time2 < "18:00:00") {
  pushwish = `Good Evening 🌃`;
} else if (time2 < "19:00:00") {
  pushwish = `Good Evening 🌃`;
} else {
  pushwish = `Good Night 🌌`;
}

// Fancy font utility
function toFancyFont(text, isUpperCase = false) {
  const fonts = {
    A: "𝘼",
    B: "𝘽",
    C: "𝘾",
    D: "𝘿",
    E: "𝙀",
    F: "𝙁",
    G: "𝙂",
    H: "𝙃",
    I: "𝙄",
    J: "𝙅",
    K: "𝙆",
    L: "𝙇",
    M: "𝙈",
    N: "𝙉",
    O: "𝙊",
    P: "𝙋",
    Q: "𝙌",
    R: "𝙍",
    S: "𝙎",
    T: "𝙏",
    U: "𝙐",
    V: "𝙑",
    W: "𝙒",
    X: "𝙓",
    Y: "𝙔",
    Z: "𝙕",
    a: "𝙖",
    b: "𝙗",
    c: "𝙘",
    d: "𝙙",
    e: "𝙚",
    f: "𝙛",
    g: "𝙜",
    h: "𝙝",
    i: "𝙞",
    j: "𝙟",
    k: "𝙠",
    l: "𝙡",
    m: "𝙢",
    n: "𝙣",
    o: "𝙤",
    p: "𝙥",
    q: "𝙦",
    r: "𝙧",
    s: "𝙨",
    t: "𝙩",
    u: "𝙪",
    v: "𝙫",
    w: "𝙬",
    x: "𝙭",
    y: "𝙮",
    z: "𝙯",
  };
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

// Image fetch utility
async function fetchMenuImage() {
  const imageUrl = "https://files.catbox.moe/omgszj.jpg";
  for (let i = 0; i < 3; i++) {
    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      return Buffer.from(response.data, "binary");
    } catch (error) {
      if (error.response?.status === 429 && i < 2) {
        console.log(`Rate limit hit, retrying in 2s...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }
      console.error("❌ Failed to fetch image:", error);
      return null;
    }
  }
}

const menu = async (m, Matrix) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const mode = config.MODE === "public" ? "public" : "private";
    const totalCommands = 70;

    const validCommands = ["list", "help", "menu"];
    const subMenuCommands = [
      "download-menu",
      "converter-menu",
      "ai-menu",
      "tools-menu",
      "group-menu",
      "search-menu",
      "main-menu",
      "owner-menu",
      "stalk-menu",
    ];

    // Fetch image for all cases
    const menuImage = await fetchMenuImage();

    // Handle main menu
    if (validCommands.includes(cmd)) {
      const mainMenu = `
╭─────────────━┈⊷
│*ʙᴏᴛ ɴᴀᴍᴇ : ɴᴊᴀʙᴜʟᴏ ᴊʙ*
│ ᴘʟᴜɢɪɴs ᴄᴍᴅ : ${totalCommands}
│ ᴘʀᴇғɪx : ${prefix}
│ ᴍᴏᴅᴇ : ${mode}
╰─────────────━┈⊷

${pushwish} @*${m.pushName}*! Tap a button to select a menu category:

> Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ
`;

      const messageOptions = {
        viewOnce: true,
        buttons: [
          {
            buttonId: `${prefix}download-menu`,
            buttonText: { displayText: `📥 ${toFancyFont("Download")}` },
            type: 1,
          },
          {
          buttonId: `${prefix}ping`,
            buttonText: { displayText: `📥 ${toFancyFont("Njabulo Jb")}` },
            type: 1,
          },
        ],
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            showAdAttribution: true, // Marks as an ad
            title: `${toFancyFont("Toxic-MD")} Menu`,
            body: `${pushwish} Explore Toxic-MD's features!`,
            sourceUrl: "https://github.com/xhclintohn/Toxic-MD",
            mediaType: 1,
            renderLargerThumbnail: true,
            mediaUrl: "https://files.catbox.moe/zaqn1j.jpg",
          },
        },
      };

      // Send menu with or without image
      if (menuImage) {
        await Matrix.sendMessage(
          m.from,
          { image: menuImage, caption: mainMenu, ...messageOptions },
          { quoted: m }
        );
      } else {
        await Matrix.sendMessage(m.from, { text: mainMenu, ...messageOptions }, { quoted: m });
      }

      // Send audio as a voice note
      await Matrix.sendMessage(
        m.from,
        { audio: { url: "https://files.catbox.moe/f4zaz4.mp3" }, mimetype: "audio/mp4", ptt: true },
        { quoted: m }
      );
    }

    // Handle sub-menu commands
    if (subMenuCommands.includes(cmd)) {
      let menuTitle;
      let menuResponse;

      switch (cmd) {
        case "download-menu":
          menuTitle = "Download";
          menuResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ Download
│ apk
│ facebook
│ mediafire
│ pinters
│ gitclone
│ gdrive
│ insta
│ ytmp3
│ ytmp4
│ play
│ song
│ video
│ ytmp3doc
│ ytmp4doc
│ tiktok
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│❒ Converter
│ ✘ attp
│ ✘ attp2
│ ✘ attp3
│ ✘ ebinary
│ ✘ dbinary
│ ✘ emojimix
│ ✘ mp3
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│❒ AI
│ ✘ ai
│ ✘ bug
│ ✘ report
│ ✘ gpt
│ ✘ dall
│ ✘ remini
│ ✘ gemini
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│❒ Tools
│ ✘ calculator
│ ✘ tempmail
│ ✘ checkmail
│ ✘ trt
│ ✘ tts
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│❒ Group
│ ✘ linkgroup
│ ✘ setppgc
│ ✘ setname
│ ✘ setdesc
│ ✘ group
│ ✘ gcsetting
│ ✘ welcome
│ ✘ add
│ ✘ kick
│ ✘ hidetag
│ ✘ tagall
│ ✘ antilink
│ ✘ antitoxic
│ ✘ promote
│ ✘ demote
│ ✘ getbio
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│❒ Search
│ ✘ play
│ ✘ yts
│ ✘ imdb
│ ✘ google
│ ✘ gimage
│ ✘ pinterest
│ ✘ wallpaper
│ ✘ wikimedia
│ ✘ ytsearch
│ ✘ ringtone
│ ✘ lyrics
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│❒ Main
│ ✘ ping
│ ✘ alive
│ ✘ owner
│ ✘ menu
│ ✘ infobot
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│❒ Owner
│ ✘ join"
│ ✘ leave
│ ✘ block
│ ✘ unblock
│ ✘ setppbot
│ ✘ anticall
│ ✘ setstatus
│ ✘ setnamebot
│ ✘ autorecording
│ ✘ autolike
│ ✘ autotyping
│ ✘ alwaysonline
│ ✘ autoread
│ ✘ autosview
◈━━━━━━━━━━━━━━━━◈
◈━━━━━━━━━━━━━━━━◈
│Stalk
│ truecaller
│ instastalk
│ githubstalk
◈━━━━━━━━━━━━━━━━◈
`;
          break;

        default:
          return;
      }

      // Format the full response
      const fullResponse = `
╭─────────────━┈⊷
│*ʙᴏᴛ ɴᴀᴍᴇ : ɴᴊᴀʙᴜʟᴏ ᴊʙ*
│ ᴘʟᴜɢɪɴs ᴄᴍᴅ : ${totalCommands}
│ ᴘʀᴇғɪx : [ ${prefix} ]
│ ᴍᴏᴅᴇ : ${mode}
╰─────────────━┈⊷

${menuResponse}

> Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ
`;

      // Send sub-menu with or without image
      if (menuImage) {
        await Matrix.sendMessage(
          m.from,
          {
            image: menuImage,
            caption: fullResponse,
            contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
             forwardedNewsletterMessageInfo: {
             newsletterJid: "120363398040175935@newsletter",
             newsletterName: "Toxic-MD",
             serverMessageId: 143,
              },
            },
          },
          { quoted: m }
        );
      } else {
        await Matrix.sendMessage(m.from, {
          text: fullResponse,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
             forwardedNewsletterMessageInfo: {
             newsletterJid: "120363398040175935@newsletter",
             newsletterName: "Toxic-MD",
             serverMessageId: 143,
            },
          },
        }, { quoted: m });
      }
    }
  } catch (error) {
    console.error(`❌ Menu error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag! Error: ${error.message || "Failed to load menu"} 😡
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default menu;
