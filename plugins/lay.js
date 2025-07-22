import fetch from 'node-fetch';
import ytSearch from 'yt-search';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import osCallbacks from 'os';
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const streamPipeline = promisify(pipeline);
const tmpDir = osCallbacks.tmpdir();

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

const play = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

    if (cmd === "laay") {
      if (args.length === 0 || !args.join(" ")) {
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
        return Matrix.sendMessage(m.from, {
          text: `*${toFancyFont("Give me a song name or keywords to search")}`,
          ...messageOptions,
        }, { quoted: m });
      }

      const searchQuery = args.join(" ");
      const buttons = [
        {
          buttonId: `.alive`,
          buttonText: { displayText: `${toFancyFont("Alive")}` },
          type: 1,
        },
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
      await Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("Toxic-MD huntin' for")}* "${searchQuery}"...`,
        ...messageOptions,
      }, { quoted: m });

      // Search YouTube for song info
      const searchResults = await ytSearch(searchQuery);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        return Matrix.sendMessage(m.from, {
          text: `*${toFancyFont("No tracks found for")}* "${searchQuery}". *${toFancyFont("You slippin'!")}`,
        }, { quoted: m });
      }

      const song = searchResults.videos[0];
      const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = `${tmpDir}/${safeTitle}.mp3`;

      // Fetch download URL from the new API
      let apiResponse;
      try {
        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(searchQuery)}`;
        apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
          throw new Error(`API responded with status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        if (!data.status || !data.result.download_url) {
          throw new Error('API response missing download URL or failed');
        }

        // Send song info from yt-search and API
        const songInfo = `
*${toFancyFont("Toxic-MD Song Intel")}*
*${toFancyFont("Title")}:* ${data.result.title || song.title}
*${toFancyFont("Views")}:* ${song.views.toLocaleString()}
*${toFancyFont("Duration")}:* ${song.timestamp}
*${toFancyFont("Channel")}:* ${song.author.name}
*${toFancyFont("Uploaded")}:* ${song.ago}
*${toFancyFont("URL")}:* ${data.result.video_url || song.url}
`;
        await Matrix.sendMessage(m.from, { text: songInfo }, { quoted: m });

        // Download the audio file
        const downloadResponse = await fetch(data.result.download_url);
        if (!downloadResponse.ok) {
          throw new Error(`Failed to download audio: ${downloadResponse.status}`);
        }
        const fileStream = fs.createWriteStream(filePath);
        await streamPipeline(downloadResponse.body, fileStream);
      } catch (apiError) {
        console.error(`API error:`, apiError.message);
        return Matrix.sendMessage(m.from, {
          text: `*${toFancyFont("Toxic-MD couldn't hit the API for")}* "${song.title}". *${toFancyFont("Server's actin' up!")}`,
        }, { quoted: m });
      }

      // Send the audio file
      try {
        const doc = {
          audio: {
            url: filePath,
          },
          mimetype: 'audio/mpeg',
          ptt: false,
          fileName: `${safeTitle}.mp3`,
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
        return Matrix.sendMessage(m.from, {
          text: `*${toFancyFont("Toxic-MD can't play")}* "${song.title}". *${toFancyFont("Failed to send audio")}`,
        }, { quoted: m });
      }

      await Matrix.sendMessage(m.from, {
        text: `*${toFancyFont(song.title)}* *${toFancyFont("dropped by Toxic-MD! Blast it!")}`,
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Play error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `*${toFancyFont("Toxic-MD hit a snag, fam! Try again or pick a better track!")}`,
    }, { quoted: m });
  }
};

export default play;
