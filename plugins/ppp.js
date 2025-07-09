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

const play = async (m, gss) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split("The command to get audio and document is .song");

    if (cmd === "song") {
      if (args.length === 0 || !args.join(" ")) {
        const buttons = [
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              "display_text": "Search Song",
              "id": `.song Your Song Name`
            })
          }
        ];

        const msg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `Give me a song name or keywords to search`
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "Toxic-MD Music Player"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: "",
                  gifPlayback: true,
                  subtitle: "",
                  hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons
                })
              }),
            },
          },
        };

        await gss.relayMessage(m.from, msg.message, {
          messageId: msg.key.id
        });
        return;
      }

      const searchQuery = args.join(" ");

      const searchingMsg = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `Searching for "${searchQuery}"...`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Toxic-MD Music Player"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      "display_text": "Audio",
                      "id": `.song audio ${searchQuery}`
                    })
                  },
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      "display_text": "Document",
                      "id": `.song document ${searchQuery}`
                    })
                  },
                  {
                    "name": "quick_reply",
                    "buttonParamsJson": JSON.stringify({
                      "display_text": "Both",
                      "id": `.song both ${searchQuery}`
                    })
                  }
                ]
              })
            }),
          },
        },
      };

      await gss.relayMessage(m.from, searchingMsg.message, {
        messageId: searchingMsg.key.id
      });
    } else if (cmd === "song" && args[0] === "audio") {
      const searchQuery = args.slice(1).join(" ");
      const filePath = await getAudio(searchQuery);
      const audioMsg = {
        audio: {
          url: filePath,
        },
        mimetype: 'audio/mpeg',
        ptt: false,
      };

      await gss.sendMessage(m.from, audioMsg, { quoted: m });

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
    } else if (cmd === "song" && args[0] === "document") {
      const searchQuery = args.slice(1).join(" ");
      const filePath = await getAudio(searchQuery);
      const doc = {
        document: {
          url: filePath,
        },
        mimetype: 'audio/mpeg',
        fileName: `${searchQuery}.mp3`,
      };

      await gss.sendMessage(m.from, doc, { quoted: m });

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
    } else if (cmd === "song" && args[0] === "both") {
      const searchQuery = args.slice(1).join(" ");
      const filePath = await getAudio(searchQuery);
      const audioMsg = {
        audio: {
          url: filePath,
        },
        mimetype: 'audio/mpeg',
        ptt: false,
      };

      const doc = {
        document: {
          url: filePath,
        },
        mimetype: 'audio/mpeg',
        fileName: `${searchQuery}.mp3`,
      };

      await gss.sendMessage(m.from, audioMsg, { quoted: m });
      await gss.sendMessage(m.from, doc, { quoted: m });

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
    }
  } catch (error) {
    console.error(`Error:`, error.message);
  }
};

const getAudio = async (searchQuery) => {
  const searchResults = await ytSearch(searchQuery);
  if (!searchResults.videos || searchResults.videos.length === 0) {
    throw new Error('No tracks found');
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

    // Download the audio file
    const downloadResponse = await fetch(data.result.download_url);
    if (!downloadResponse.ok) {
      throw new Error(`Failed to download audio: ${downloadResponse.status}`);
    }
    const fileStream = fs.createWriteStream(filePath);
    await streamPipeline(downloadResponse.body, fileStream);
  } catch (apiError) {
    console.error(`API error:`, apiError.message);
    throw apiError;
  }

  return filePath;
};

export default play;