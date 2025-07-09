import fetch from 'node-fetch';
import ytSearch from 'yt-search';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import osCallbacks from 'os';
import config from "../config.cjs";
import { proto } from 'baileys-pro';

const streamPipeline = promisify(pipeline);
const tmpDir = osCallbacks.tmpdir();

const play = async (m, gss) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

    if (cmd === "pla") {
      if (args.length === 0 || !args.join(" ")) {
        const buttons = [
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              "display_text": "Search Song",
              "id": `.play Your Song Name`
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
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            "display_text": "Stop Music",
            "id": `.stop`
          })
        }
      ];

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
                buttons
              })
            }),
          },
        },
      };

      await gss.relayMessage(m.from, searchingMsg.message, {
        messageId: searchingMsg.key.id
      });

      // Search YouTube for song info
      const searchResults = await ytSearch(searchQuery);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        const noResultsMsg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `No tracks found for "${searchQuery}".`
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

        await gss.relayMessage(m.from, noResultsMsg.message, {
          messageId: noResultsMsg.key.id
        });
        return;
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
        const songInfoMsg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `
*Title*: ${data.result.title || song.title}
*Views*: ${song.views.toLocaleString()}
*Duration*: ${song.timestamp}
*Channel*: ${song.author.name}
*Uploaded*: ${song.ago}
*URL*: ${data.result.video_url || song.url}
`
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

        await gss.relayMessage(m.from, songInfoMsg.message, {
          messageId: songInfoMsg.key.id
        });

        // Download the audio file
        const downloadResponse = await fetch(data.result.download_url);
        if (!downloadResponse.ok) {
          throw new Error(`Failed to download audio: ${downloadResponse.status}`);
        }
        const fileStream = fs.createWriteStream(filePath);
        await streamPipeline(downloadResponse.body, fileStream);
      } catch (apiError) {
        console.error(`API error:`, apiError.message);
        const apiErrorMsg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `Failed to fetch song details.`
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

        await gss.relayMessage(m.from, apiErrorMsg.message, {
          messageId: apiErrorMsg.key.id
        });
        return;
      }

      // Send the audio file
      try {
        const doc = {
          document: {
            url: filePath,
          },
          mimetype: 'audio/mpeg',
          fileName: `${safeTitle}.mp3`,
        };

        await gss.sendMessage(m.from, doc, { quoted: m });

        const audioMsg = {
          audio: {
            url: filePath,
          },
          mimetype: 'audio/mpeg',
          ptt: false,
        };

        await gss.sendMessage(m.from, audioMsg, { quoted: m });

        const songPlayedMsg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `Now playing: ${song.title}`
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

        await gss.relayMessage(m.from, songPlayedMsg.message, {
          messageId: songPlayedMsg.key.id
        });

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
        const sendErrorMsg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `Failed to send audio.`
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

        await gss.relayMessage(m.from, sendErrorMsg.message, {
          messageId: sendErrorMsg.key.id
        });
      }
    }
  } catch (error) {
    console.error(`Error:`, error.message);
    const errorMsg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `An error occurred.`
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
                    "display_text": "Try Again",
                    "id": `.play`
                  })
                }
              ]
            })
          }),
        },
      },
    };

    await gss.relayMessage(m.from, errorMsg.message, {
      messageId: errorMsg.key.id
    });
  }
};

export default play;