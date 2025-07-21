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

    const repoUrl = "https://api.github.com/repos/xhclintohn/Toxic-MD";
    const headers = {
      Accept: "application/vnd.github.v3+json",
      ...(config.GITHUB_TOKEN ? { Authorization: `token ${config.GITHUB_TOKEN}` } : {}),
    };

    const response = await axios.get(repoUrl, { headers });
    const repoData = response.data;

    if (response.status !== 200 || !repoData.full_name) {
      throw new Error("Failed to fetch repo data or repo not found.");
    }

    const createdDate = new Date(repoData.created_at).toLocaleDateString("en-GB");
    const lastUpdateDate = new Date(repoData.updated_at).toLocaleDateString("en-GB");

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

    const validCommands = ["ist", "hel", "nu"];
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
*①• ${toFancyFont("aira")} *(Command Menu ⚠)*
*②• ${toFancyFont("Bot")}*: ${toFancyFont("*(aira)*")}
*④• ${toFancyFont("Date")}*: ${xdate}
*⑤• ${toFancyFont("Time")}*: ${xtime} 
*⑥• ${toFancyFont("Prefix")}: [ ${prefix} ]*
*⑦• ${toFancyFont("Mode")}*: ${mode}
*⑧• ${toFancyFont("Library")}: (Baileys)*
*Stars:* ${repoData.stargazers_count || 0} (star it, fam!)

 ╭──〔 *Aira* 〕
│
│ ➊    *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*
│ ➋    *ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
│ ➌    *ғᴜɴ ᴍᴇɴᴜ*
│ ➍    *ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
│ ➎    *ᴀɪ ᴍᴇɴᴜ*
│ ➏    *ᴀɴɪᴍᴇ ᴍᴇɴᴜ*
│ ➐    *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
│ ➑    *ᴏᴛʜᴇʀ ᴍᴇɴᴜ*
│ ➒    *ʀᴇᴀᴄᴛɪᴏɴ ᴍᴇɴᴜ*
│ ➓    *ᴍᴀɪɴ ᴍᴇɴᴜ*
│ ⓫    *ʟᴏɢᴏ ᴍᴀᴋᴇʀ*
│ ⓬    *sᴇᴛᴛɪɴɢs ᴍᴇɴᴜ*
│
╰──〔 *Aira* 〕

*${pushwish} @*${m.pushName}*! 

> Tap a button to select a menu category:
`;

      const messageOptions = {
        viewOnce: true,
        buttons: [
          {
            buttonId: `${prefix}alive`,
            buttonText: { displayText: `📃 ${toFancyFont("alive")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}ping`,
            buttonText: { displayText: `📃 ${toFancyFont("ping")}` },
            type: 1,
          },
        ],
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
          title: "Aira",
          body: "commands",
          thumbnailUrl: "https://whatsapp.com/channel/0029VbAckOZ7tkj92um4KN3u",
           sourceUrl: "https://whatsapp.com/channel/0029VbAckOZ7tkj92um4KN3u",
           mediaType: 1,
           showAdAttribution: true
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
