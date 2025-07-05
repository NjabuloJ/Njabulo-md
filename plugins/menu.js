import moment from "moment-timezone";
import fs from "fs";
import os from "os";
import pkg from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";
import axios from "axios";

//NנɐႦυℓσ נႦ Time logic⚠︎
const xtime = moment.tz("Africa/Nairobi").format("HH:mm:ss");
const xdate = moment.tz("Africa/Nairobi").format("DD/MM/YYYY");
const time2 = moment().tz("Africa/Nairobi").format("HH:mm:ss");
let pushwish = "";

if (time2 < "05:00:00") {
  njabulojb = `Good Morning`;
} else if (time2 < "11:00:00") {
  njabulojb = `Good Morning`;
} else if (time2 < "15:00:00") {
  njabulojb = `Good Afternoon`;
} else if (time2 < "18:00:00") {
  njabulojb = `Good Evening`;
} else if (time2 < "19:00:00") {
  njabulojb = `Good Evening`;
} else {
  njabulojb = `Good Night`;
}

//NנɐႦυℓσ נႦ Fancy font utility⚠︎
function toFancyFont(text, isUpperCase = false) {
  const fonts = {
 'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ',
 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
  };
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

//NנɐႦυℓσ נႦ Image fetch utility⚠︎
async function fetchMenuImage() {
  const imageUrl = "https://files.catbox.moe/wu6lu4.jpg";
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
      "commands",
      "channel-update",
    ];

    // Fetch image for all cases
    const menuImage = await fetchMenuImage();

    // Handle main menu
    if (validCommands.includes(cmd)) {
      const mainMenu = `
┏──────────────⊷
┊ʙᴏᴛ ɴᴀᴍᴇ  *NנɐႦυℓσ נႦ*
┊*${toFancyFont("Total Commands")}*: ${totalCommands}
┊*${toFancyFont("Prefix")}*: ${prefix}
┊*${toFancyFont("Mode")}*: ${mode}
┊ *${toFancyFont("Library")}*: Baileys
┗──────────────⊷

${pushwish} @*${m.pushName}*! Tap a button to select a menu category:

> Pσɯҽɾҽԃ Ⴆყ Makamesco-ɱԃ
`;

      const messageOptions = {
        viewOnce: true,
        buttons: [
          {
            buttonId: `${prefix}commands`,
            buttonText: { displayText: ` ${toFancyFont("commands")}` },
            type: 1,
          },
          {
            buttonId: `${prefix} channel-update`,
            buttonText: { displayText: ` ${toFancyFont("channel-update")}` },
            type: 1,
          },
        ],
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            showAdAttribution: true, // Marks as an ad
            title: `${toFancyFont("Makamesco-MD")} Menu`,
            body: `${pushwish} Explore Makamesco-MD's features!`,
            sourceUrl: "https://github.com/makamesco/Makamesco-md-v",
            mediaType: 1,
            renderLargerThumbnail: true,
            mediaUrl: "https://files.catbox.moe/wu6lu4.jpg",
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
        case "commands":
          menuTitle = "commands";
          menuResponse = `
┏──────────────⊷
┊☹ʙᴏᴛ ɴᴀᴍᴇ :  *ɴᴊᴀʙᴜʟᴏ ᴊʙ*
┗──────────────⊷
┏ 
*【${toFancyFont("Download")}】*
┗
┏
- .① ${toFancyFont("apk")}
- .② ${toFancyFont("facebookapk")}
- .③ ${toFancyFont("mediafireapk")}
- .④ ${toFancyFont("pintersapk")}
- .⑤ ${toFancyFont("gitcloneapk")}
- .⑥ ${toFancyFont("gdriveapk")}
- .⑦ ${toFancyFont("instaapk")}
- .⑧ ${toFancyFont("ytmp3apk")}
- .⑨ ${toFancyFont("ytmp4apk")}
- .⑩ ${toFancyFont("playapk")}
- .⑪ ${toFancyFont("song")}
- .⑫ ${toFancyFont("video")}
- .⑬ ${toFancyFont("ytmp")}
- .⑭ ${toFancyFont("ytmp4")}
- .⑮ ${toFancyFont("tiktok")}
┗
┏
- . ${toFancyFont("*Converter*")} 
- . ${toFancyFont("attp")}*
- . ${toFancyFont("attp2")}*
- . ${toFancyFont("attp3")}*
- . ${toFancyFont("ebinary")}*
- . ${toFancyFont("dbinary")}*
- . ${toFancyFont("emojimix")}*
- . *${toFancyFont("mp3")}*
┗
┏
- . ${toFancyFont("AI")} 🤖
- . ${toFancyFont("ai")}*
- . ${toFancyFont("bug")}*
- . ${toFancyFont("report")}*
- . ${toFancyFont("gpt")}*
- . ${toFancyFont("dalle")}*
- . ${toFancyFont("remini")}*
- . ${toFancyFont("gemini")}*
┗
┏
- . ${toFancyFont("Tools")} 🛠
- . ${toFancyFont("calculator")}*
- . ${toFancyFont("tempmail")}*
- . ${toFancyFont("checkmail")}*
- . ${toFancyFont("trt")}*
- . ${toFancyFont("tts")}*
┗
┏
- .  ${toFancyFont("Group")} 👥
- . ${toFancyFont("linkgroup")}*
- . ${toFancyFont("setppgc")}*
- . ${toFancyFont("setname")}*
- . ${toFancyFont("setdesc")}*
- . ${toFancyFont("group")}*
- . ${toFancyFont("gcsetting")}*
- . ${toFancyFont("welcome")}*
- . ${toFancyFont("add")}*
- . ${toFancyFont("kick")}*
- . ${toFancyFont("hidetag")}*
- . ${toFancyFont("tagall")}*
- . ${toFancyFont("antilink")}*
- . ${toFancyFont("antitoxic")}*
- . ${toFancyFont("promote")}*
- . ${toFancyFont("demote")}*
- . ${toFancyFont("getbio")}*
┗
┏
- .  ${toFancyFont("Search")} 🔍
- . ${toFancyFont("play")}*
- . ${toFancyFont("yts")}*
- . ${toFancyFont("imdb")}*
- . ${toFancyFont("google")}*
- . ${toFancyFont("gimage")}*
- . ${toFancyFont("pinterest")}*
- . ${toFancyFont("wallpaper")}*
- . ${toFancyFont("wikimedia")}*
- . ${toFancyFont("ytsearch")}*
- . ${toFancyFont("ringtone")}*
- . ${toFancyFont("lyrics")}*
┗
┏
- . ${toFancyFont("Main")} ⚙
- . ${toFancyFont("ping")}*
- . ${toFancyFont("alive")}*
- . ${toFancyFont("owner")}*
- . ${toFancyFont("menu")}*
- . ${toFancyFont("infobot")}*
┗
┏
- . ${toFancyFont("Owner")} 🔒
- . ${toFancyFont("join")}*
- . ${toFancyFont("leave")}*
- . ${toFancyFont("block")}*
- . ${toFancyFont("unblock")}*
- . ${toFancyFont("setppbot")}*
- . ${toFancyFont("anticall")}*
- . ${toFancyFont("setstatus")}*
- . ${toFancyFont("setnamebot")}*
- . ${toFancyFont("autorecording")}*
- . ${toFancyFont("autolike")}*
- . ${toFancyFont("autotyping")}*
- . ${toFancyFont("alwaysonline")}*
- . ${toFancyFont("autoread")}*
- . ${toFancyFont("autosview")}*
┗
`;
          break;

        default:
          return;
      }

      // Format the full response
      const fullResponse = `
◈━━━━━━━━━━━━━━━━◈
│❒ ${toFancyFont("Makamesco-MD")} - ${toFancyFont(menuTitle)} ⚠
│
│ 🤖 *${toFancyFont("Bot")}*: ${toFancyFont("Makamesco-MD")}
│ 👤 *${toFancyFont("User")}*: ${m.pushName}
│ 🔣 *${toFancyFont("Prefix")}*: ${prefix}
│ 📚 *${toFancyFont("Library")}*: Baileys
◈━━━━━━━━━━━━━━━━◈

${menuResponse}

> Pσɯҽɾҽԃ Ⴆყ Makamesco-ɱԃ
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
                title: `${toFancyFont("Makamesco-MD")} ${toFancyFont(menuTitle)}`,
                body: `Explore Makamesco-MD's ${menuTitle.toLowerCase()} commands!`,
                sourceUrl: "https://github.com/makamesco/Makamesco-md-v",
                mediaType: 1,
                renderLargerThumbnail: true,
                mediaUrl: "https://files.catbox.moe/wu6lu4.jpg",
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
              title: `${toFancyFont("Makamesco-MD")} ${toFancyFont(menuTitle)}`,
              body: `Explore Makamesco-MD's ${menuTitle.toLowerCase()} commands!`,
              sourceUrl: "https://github.com/makamesco/Makamesco-md-v",
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
│❒ *Makamesco-MD* hit a snag! Error: ${error.message || "Failed to load menu"} 😡
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default menu;
