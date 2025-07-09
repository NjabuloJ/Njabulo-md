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

const song = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

    if (cmd === "song") {
      if (args.length === 0 || !args.join(" ")) {
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
│❒ Give me a song name or keywords to search 😎
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
                  buttons: [
                    {
                      "name": "quick_reply",
                      "buttonParamsJson": JSON.stringify({
                        display_text: "MENU",
                        id: `.menu`
                      })
                    }
                  ]
                }),
              }),
            },
          },
        }, {});
        Matrix.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id
        });
        return;
      }

      // Rest of the code remains the same...

      // After searching for the song
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "AUDIO",
            id: `.song audio ${args.join(" ")}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "DOCUMENT",
            id: `.song document ${args.join(" ")}`
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
│❒ *${searchResults.videos[0].title}* found! 🎶
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
      Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
    } else if (cmd === "song" && args[0] === "audio") {
      // Send audio
      const searchQuery = args.slice(1).join(" ");
      const searchResults = await ytSearch(searchQuery);
      const song = searchResults.videos[0];
      const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = `${tmpDir}/${safeTitle}.mp3`;

      // Download and send audio
      const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp3?apikey=gifted_api_se5dccy&url=${encodeURIComponent(song.url)}`;
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

      // Clean up temp file
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
      // Send document
      const searchQuery = args.slice(1).join(" ");
      const searchResults = await ytSearch(searchQuery);
      const song = searchResults.videos[0];
      const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = `${tmpDir}/${safeTitle}.mp3`;

      // Download and send document
      const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp3?apikey=gifted_api_se5dccy&url=${encodeURIComponent(song.url)}`;
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

      // Clean up temp file
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
    console.error(`❌ song error: ${error.message}`);
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
│❒ *Toxic-MD* hit a snag, fam! Try again or pick a better track! 😈
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
              buttons: [
                {
                  "name": "quick_reply",
                  "buttonParamsJson": JSON.stringify({
                    display_text: "MENU",
                    id: `.menu`
                  })
                }
              ]
            }),
          }),
        },
      },
    }, {});
    Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default song;