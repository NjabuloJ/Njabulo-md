import fetch from 'node-fetch';
import ytSearch from 'yt-search';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import osCallbacks from 'os';
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;

function toFancyFont(text) {
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
  return text
    .toLowerCase()
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

const streamPipeline = promisify(pipeline);
const tmpDir = osCallbacks.tmpdir();

const song = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

    if (cmd === "video") {
      if (args.length === 0 || !args.join(" ")) {
        const buttons = [
          {
            buttonId: `.menu`,
            buttonText: { displayText: `📃${toFancyFont("Menu")}` },
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
        return Matrix.sendMessage(m.from, {
          text: `${toFancyFont("give")} ${toFancyFont("me")} ${toFancyFont("a")} ${toFancyFont("song")} ${toFancyFont("name")} ${toFancyFont("or")} ${toFancyFont("keywords")} ${toFancyFont("to")} ${toFancyFont("search")}`,
          ...messageOptions,
        }, { quoted: m });
      }

      const searchQuery = args.join(" ");
      await Matrix.sendMessage(m.from, {
        text: `*ɴᴊᴀʙᴜʟᴏ ᴊʙ* ${toFancyFont("huntin’")} ${toFancyFont("for")} "${searchQuery}"`,
        viewOnce: true,
      }, { quoted: m });

      // Search YouTube for song info
      const searchResults = await ytSearch(searchQuery);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        const buttons = [
          {
            buttonId: `.menu`,
            buttonText: { displayText: `📃${toFancyFont("Menu")}` },
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
        return Matrix.sendMessage(m.from, {
          text: `${toFancyFont("no")} ${toFancyFont("tracks")} ${toFancyFont("found")} ${toFancyFont("for")} "${searchQuery}". ${toFancyFont("you")} ${toFancyFont("slippin’")}!`,
          ...messageOptions,
        }, { quoted: m });
      }

      const song = searchResults.videos[0];
      const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = `${tmpDir}/${safeTitle}.mp3`;

      // Fetch download URL from the new API
      let apiResponse;
      try {
      const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(song.url)}`;
        apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
          throw new Error(`API responded with status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        if (!data.success || !data.result.download_url) {
          throw new Error('API response missing download URL or failed');
        }

        // Send song info from yt-search and API
        const songInfo = `
 *ɴᴊᴀʙᴜʟᴏ ᴊʙ* ${toFancyFont("song")} ${toFancyFont("intel")} 🔥
 *${toFancyFont("title")}*: ${song.title}
 *${toFancyFont("views")}*: ${song.views.toLocaleString()}
 *${toFancyFont("duration")}*: ${song.timestamp}
 *${toFancyFont("channel")}*: ${song.author.name}
 *${toFancyFont("quality")}*: ${data.result.quality}
 *${toFancyFont("uploaded")}*: ${song.ago}
 *${toFancyFont("url")}*: ${song.url}
`;
        const buttons = [
          {
            buttonId: `.song ${args.join(" ")}`,
            buttonText: { displayText: `🎧${toFancyFont("get")} ${toFancyFont("song")}` },
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
        await Matrix.sendMessage(m.from, {
          text: songInfo,
          ...messageOptions,
        }, { quoted: m });

        // Download the audio file
        const downloadResponse = await fetch(data.result.download_url);
        if (!downloadResponse.ok) {
          throw new Error(`Failed to download audio: ${downloadResponse.status}`);
        }
        const fileStream = fs.createWriteStream(filePath);
        await streamPipeline(downloadResponse.body, fileStream);
      } catch (apiError) {
        console.error(`API error:`, apiError.message);
        const buttons = [
          {
            buttonId: `.support`,
            buttonText: { displayText: `⚠︎${toFancyFont("support")}` },
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
        return Matrix.sendMessage(m.from, {
          text: `*Njabulo Jb* ${toFancyFont("couldn’t")} ${toFancyFont("hit")} ${toFancyFont("the")} ${toFancyFont("api")} ${toFancyFont("for")} "${song.title}". ${toFancyFont("server’s")} ${toFancyFont("actin’")} ${toFancyFont("up")}!`,
          ...messageOptions,
        }, { quoted: m });
      }

      // Send the audio file
      try {
        const doc = {
          video: {
            url: filePath,
          },
          mimetype: 'video/mp4',
          ptt: false,
          fileName: `${safeTitle}`,
        };
        await Matrix.sendMessage(m.from, doc, { quoted: m });

        // Clean up temp file after 5 seconds
        setTimeout(() => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted temp file: ${filePath}`);
            }
          } catch (cleanupErr) {
            console.error('Error during file cleanup:', cleanupErr);
          }
        }, 5000);
      } catch (sendError) {
        console.error(`Failed to send audio:`, sendError.message);
        const buttons = [
          {
            buttonId: `.support`,
            buttonText: { displayText: `⚠︎${toFancyFont("support")}` },
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
        return Matrix.sendMessage(m.from, {
          text: `*ɴᴊᴀʙᴜʟᴏ ᴊʙ* ${toFancyFont("can’t")} ${toFancyFont("song")} "${song.title}". ${toFancyFont("failed")} ${toFancyFont("to")} ${toFancyFont("send")} ${toFancyFont("audio")}`,
          ...messageOptions,
        }, { quoted: m });
      }

      const buttons = [
        {
          buttonId: `.menu`,
          buttonText: { displayText: `📃${toFancyFont("Menu")}` },
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
      await Matrix.sendMessage(m.from, {
        text: `*${song.title}* ${toFancyFont("dropped")} ${toFancyFont("by")} *Aira*! ${toFancyFont("blast")} ${toFancyFont("it")}!`,
        ...messageOptions,
      }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ song error: ${error.message}`);
    const buttons = [
      {
        buttonId: `.support`,
        buttonText: { displayText: `⚠︎${toFancyFont("support")}` },
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
    await Matrix.sendMessage(m.from, {
      text: `*ɴᴊᴀʙᴜʟᴏ ᴊʙ* ${toFancyFont("hit")} ${toFancyFont("a")} ${toFancyFont("snag")}, ${toFancyFont("fam")}! ${toFancyFont("try")} ${toFancyFont("again")} ${toFancyFont("or")} ${toFancyFont("pick")} ${toFancyFont("a")} ${toFancyFont("better")} ${toFancyFont("track")}! `,
      ...messageOptions,
    }, { quoted: m });
  }
};

export default song;
