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
*①• ${toFancyFont("aira")} *(Command Menu ⚠)*
*②• ${toFancyFont("Bot")}*: ${toFancyFont("*(aira)*")}
*④• ${toFancyFont("Date")}*: ${xdate}
*⑤• ${toFancyFont("Time")}*: ${xtime} 
*⑥• ${toFancyFont("Prefix")}: [ ${prefix} ]*
*⑦• ${toFancyFont("Mode")}*: ${mode}
*⑧• ${toFancyFont("Library")}: (Baileys)*

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
            buttonId: `${prefix}download-menu`,
            buttonText: { displayText: `📃 ${toFancyFont("All Commands Cmd")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}converter-menu`,
            buttonText: { displayText: `📃 ${toFancyFont("Auto Join channel")}` },
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
          menuTitle = "All Commands Cmd";
          menuResponse = `   *【 AI】*
Here's the reformatted list:

① Download
.①apk
.②facebook
.③mediafire
.④pinters
.⑤gitclone
.⑥gdrive
.⑦insta
.⑧ytmp3
.⑨ytmp4
.⑩play
.⑪song
.⑫video
.⑬ytmp3doc
.⑭ytmp4doc
.⑮tiktok

② Converter
.①attp
.②attp2
.③attp3
.④ebinary
.⑤dbinary
.⑥emojimix
.⑦mp3

③ AI
.①ai
.②bug
.③report
.④gpt
.⑤dall
.⑥remini
.⑦gemini

④ Tools
.①calculator
.②tempmail
.③checkmail
.④trt
.⑤tts

⑤ Group
.①linkgroup
.②setppgc
.③setname
.④setdesc
.⑤group
.⑥gcsetting
.⑦welcome
.⑧add
.⑨kick
.⑩hidetag
.⑪tagall
.⑫antilink
.⑬antitoxic
.⑭promote
.⑮demote
.⑯getbio

⑥ Search
.①play
.②yts
.③imdb
.④google
.⑤gimage
.⑥pinterest
.⑦wallpaper
.⑧wikimedia
.⑨ytsearch
.⑩ringtone
.⑪lyrics

⑦ Main
.①ping
.②alive
.③owner
.④menu
.⑤infobot

⑧ Owner
.①join
.②leave
.③block
.④unblock
.⑤setppbot
.⑥anticall
.⑦setstatus
.⑧setnamebot
.⑨autorecording
.⑩autolike
.⑪autotyping
.⑫alwaysonline
.⑬autoread
.⑭autosview

⑨ Stalk
.①truecaller
.②instastalk
.③githubstalk

Let me know if you need any further changes!
`;
          
        break;

        default:
          return;
      }

      // Format the full response
      const fullResponse = `
*①• ${toFancyFont("aira")} *(Command Menu ⚠)*
*②• ${toFancyFont("Bot")}*: ${toFancyFont("*(aira)*")}
*④• ${toFancyFont("Date")}*: ${xdate}
*⑤• ${toFancyFont("Time")}*: ${xtime} 
*⑥• ${toFancyFont("Prefix")}: [ ${prefix} ]*
*⑦• ${toFancyFont("Mode")}*: ${mode}
*⑧• ${toFancyFont("Library")}: (Baileys)*

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
              externalAdReply: {
                showAdAttribution: true, // Marks as an ad
                title: `${toFancyFont("Aira")} ${toFancyFont(menuTitle)}`,
                body: `Explore Njabulo Jb's ${menuTitle.toLowerCase()} commands!`,
                sourceUrl: "https://github.com/NjabuloJ/Njabulo-Jb",
                mediaType: 1,
                renderLargerThumbnail: true,
                mediaUrl: "https://files.catbox.moe/zaqn1j.jpg",
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
            externalAdReply: {
              showAdAttribution: true, // Marks as an ad
              title: `${toFancyFont("Aira")} ${toFancyFont(menuTitle)}`,
              body: `Explore Aira's ${menuTitle.toLowerCase()} commands!`,
              sourceUrl: "https://github.com/NjabuloJ/Njabulo-Jb",
              mediaType: 1,
              renderLargerThumbnail: true,
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
