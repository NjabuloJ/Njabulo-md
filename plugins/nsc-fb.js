import fetch from 'node-fetch';
import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const downloadAndSendMedia = async (m, Matrix) => {
  if (!config.AUTO_DL) return;  // Exit early if AUTO_DL is false

  const text = m.body.trim();

  if (!/^https?:\/\//.test(text)) {
    return;
  }

  try {
    const supportedDomains = ['youtube.com', 'youtu.be', 'instagram.com', 'facebook.com', 'tiktok.com', 'drive.google.com'];
    const urlObj = new URL(text);
    const domain = urlObj.hostname.replace('www.', '');

    if (supportedDomains.some(d => domain.includes(d))) {
      const apiUrl = `https://api.xfar.net/feature/downloader?url=${encodeURIComponent(text)}`;
      const res = await fetch(apiUrl);
      const result = await res.json();

      if (result.status) {
        const mediaData = result.data;
        const caption = `> Powered By Ethix-md`;

        if (mediaData.low) {
          const mediaUrl = mediaData.low;
          const extension = mediaUrl.split('.').pop().toLowerCase();

          await Matrix.sendMedia(m.from, mediaUrl, extension, caption, m);

          // Button functionality
          const buttons = [
            {
              "name": "quick_reply",
              "buttonParamsJson": JSON.stringify({
                display_text: "DOWNLOAD AGAIN",
                id: text
              })
            },
            {
              "name": "quick_reply",
              "buttonParamsJson": JSON.stringify({
                display_text: "MENU",
                id: `.menu`
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
                    text: "Media downloaded successfully!"
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "Ethix-md"
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
          }, {});

          await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
          });

          await m.React('✅');
        } else {
        }
      } else {
      }
    } else {
    }
  } catch (error) {
    console.error('Error downloading and sending media:', error.message);
    m.reply('Error downloading and sending media.');

    // Button functionality for error
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "TRY AGAIN",
          id: text
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "MENU",
          id: `.menu`
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
              text: "Error downloading media. Please try again."
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Ethix-md"
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
    }, {});

    await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });

    await m.React('❌');
  }
};

export default downloadAndSendMedia;