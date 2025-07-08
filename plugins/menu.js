import moment from "moment-timezone";
import fs from "fs";
import os from "os";
import pkg from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";
import axios from "axios";

// Time logic
const time = moment.tz("Africa/Nairobi").format("HH:mm:ss");
const date = moment.tz("Africa/Nairobi").format("DD/MM/YYYY");
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
    A: "A",
    B: "b",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
    H: "H",
    I: "l",
    J: "J",
    K: "K",
    L: "L",
    M: "M",
    N: "N",
    O: "o",
    P: "P",
    Q: "Q",
    R: "R",
    S: "S",
    T: "T",
    U: "u",
    V: "v",
    W: "W",
    X: "X",
    Y: "Y",
    Z: "z",
    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    f: "f",
    g: "g",
    h: "h",
    i: "i",
    j: "j",
    k: "k",
    l: "l",
    m: "m",
    n: "n",
    o: "o",
    p: "p",
    q: "q",
    r: "r",
    s: "s",
    t: "t",
    u: "u",
    v: "v",
    w: "w",
    x: "x",
    y: "y",
    z: "z",
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
╭─────────────┈⊷
│ *ʙᴏᴛ ɴᴀᴍᴇ : ɴᴊᴀʙᴜʟᴏ ᴊʙ*
│ ᴘʟᴜɢɪɴs ᴄᴍᴅ : ${totalCommands}
│ ᴘʀᴇғɪx : ${prefix}
│ ᴍᴏᴅᴇ : ${mode}
╰─────────────┈⊷

> ✆︎Pσɯҽɾҽԃ Ⴆყ NנɐႦυℓσ נႦ
`;

      const messageOptions = {
        viewOnce: true,
        buttons: [
          {
            buttonId: `${prefix}plugin`,
            buttonText: { displayText: `${toFancyFont("Plugins")}` },
            type: 1,
          },
          {
          buttonId: `${prefix}ping`,
            buttonText: { displayText: `${toFancyFont("Njabulo Jb")}` },
            type: 1,
          },
        ],
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            showAdAttribution: true, // Marks as an ad
            title: "world bot",
            body: "Ⴆყ NנɐႦυℓσ נႦ",
            sourceUrl: "https://github.com/NjabuloJ/Njabulo-Jb",
            mediaType: 1,
            renderLargerThumbnail: true,
            mediaUrl: "https://files.catbox.moe/zaqn1j.jpg",
          },
        },
      };
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
        case "plugin":
          menuTitle = "Plugins";
          menuResponse = `
- . *Download*
- . apk
- . facebook
- . mediafire
- . pinters
- . gitclone
- . gdrive
- . insta
- . ytmp3
- . ytmp4
- . play
- . song
- . video
- . ytmp3doc
- . ytmp4doc
- . tiktok

 *Converter*
- . attp
- . attp2
- . attp3
- . ebinary
- . dbinary
- . emojimix
- . mp3
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

> ✆︎Pσɯҽɾҽԃ Ⴆყ NנɐႦυℓσ נႦ
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
