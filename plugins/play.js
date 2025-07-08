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

const play = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

    if (cmd === "play") {
      if (args.length === 0 || !args.join(" ")) {
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ Give me a song name or keywords to search 😎
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      const searchQuery = args.join(" ");
      await Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* huntin' for "${searchQuery}"... 🎧
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });

      // Search YouTube for song info
      const searchResults = await ytSearch(searchQuery);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ No tracks found for "${searchQuery}". You slippin'! 💀
◈━━━━━━━━━━━━━━━━◈`,
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
◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* Song Intel 🔥
│❒ *Title*: ${data.result.title || song.title}
│❒ *Views*: ${song.views.toLocaleString()}
│❒ *Duration*: ${song.timestamp}
│❒ *Channel*: ${song.author.name}
│❒ *Uploaded*: ${song.ago}
│❒ *URL*: ${data.result.video_url || song.url}
◈━━━━━━━━━━━━━━━━◈`;
        await Matrix.sendMessage(m.from, { text: songInfo }, { quoted: m });

        // Download the audio file
        const downloadResponse = await fetch(data.result.download_url);
        if (!downloadResponse.ok) {
          throw new Error(`Failed to download audio: ${downloadResponse.status}`);
        }
        const fileStream = fs.createWriteStream(filePath);
        await streamPipeline(downloadResponse.body, fileStream);

        // Create buttons for different formats
        const buttons = [
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "Audio",
              id: `${prefix}play audio ${searchQuery}`
            })
          },
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "Document",
              id: `${prefix}play doc ${searchQuery}`
            })
          }
        ];

        const msg = generateWAMessageFromContent(m.from, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `◈━━━━━━━━━━━━━━━━◈
│❒ Choose a format for *${song.title}*: 
◈━━━━━━━━━━━━━━━━◈`
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "Toxic-MD"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: "",
                  gifPlayback: true,
                  subtitle: "",
                  hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons
                }),
              }),
            },
          },
        }, {});

        await Matrix.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });

      } catch (apiError) {
        console.error(`API error:`, apiError.message);
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* couldn't hit the API for "${song.title}". Server's actin' up! 😡
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }
    } else if (cmd === "play" && args[0] === "audio") {
      // Send audio file
      const searchQuery = args.slice(1).join(" ");
      const searchResults = await ytSearch(searchQuery);
      const song = searchResults.videos[0];
      const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = `${tmpDir}/${safeTitle}.mp3`;

      const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(searchQuery)}`;
      const apiResponse = await fetch(apiUrl);
      const data = await apiResponse.json();

      const downloadResponse = await fetch(data.result.download_url);
      const fileStream = fs.createWriteStream(filePath);
      await streamPipeline(downloadResponse.body, fileStream);

      const doc = {
        audio: {
          url: filePath,
        },
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `${safeTitle}.mp3`,
      };
      await Matrix.sendMessage(m.from, doc, { quoted: m });

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

    } else if (cmd === "play" && args[0] === "doc") {
      // Send document file
      const searchQuery = args.slice(1).join(" ");
      const searchResults = await ytSearch(searchQuery);
      const song = searchResults.videos[0];
      const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = `${tmpDir}/${safeTitle}.mp3`;

      const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(searchQuery)}`;
      const apiResponse = await fetch(apiUrl);
      const data = await apiResponse.json();

      const downloadResponse = await fetch(data.result.download_url);
      const fileStream = fs.createWriteStream(filePath);
      await streamPipeline(downloadResponse.body, fileStream);

      const doc = {
        document: {
          url: filePath,
        },
        mimetype: 'audio/mpeg',
        fileName: `${safeTitle}.mp3`,
      };
      await Matrix.sendMessage(m.from, doc, { quoted: m });

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
    }
  } catch (error) {
    console.error(`❌ Play error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag, fam! Try again or pick a better track! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default play;
