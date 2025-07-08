import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from 'baileys-pro';
const { generateWAMessageFromContent, proto } = pkg;

const kick = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['kick', 'remove'];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) {
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "GROUP MENU",
            id: `.groupmenu`
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
                text: "*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*"
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

      await gss.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) {
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "MAKE ME ADMIN",
            id: `.admin`
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
                text: "*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*"
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

      await gss.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    if (!senderAdmin) {
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "BECOME ADMIN",
            id: `.becomeadmin`
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
                text: "*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*"
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

      await gss.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    if (!m.mentionedJid) m.mentionedJid = [];

    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : text.replace(/[^0-9]/g, '').length > 0
      ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
      : [];

    if (users.length === 0) {
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "MENTION USER",
            id: `.kick @user`
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
                text: "*📛 PLEASE MENTION OR QUOTE A USER TO KICK*"
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

      await gss.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      return;
    }

    const validUsers = users.filter(Boolean);

    await gss.groupParticipantsUpdate(m.from, validUsers, 'remove')
      .then(() => {
        const kickedNames = validUsers.map(user => `@${user.split("@")[0]}`);
        const buttons = [
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "ADD USER",
              id: `.add ${validUsers[0]}`
            })
          },
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "GROUP MENU",
              id: `.groupmenu`
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
                  text: `*USERS ${kickedNames} KICKED SUCCESSFULLY FROM THE GROUP ${groupMetadata.subject}*`
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

        gss.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id
        });
      })
      .catch(() => {
        const buttons = [
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "TRY AGAIN",
              id: `.kick ${validUsers[0]}`
            })
          },
          {
            "name": "quick_reply",
            "buttonParamsJson": JSON.stringify({
              display_text: "GROUP MENU",
              id: `.groupmenu`
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
                  text: 'Failed to kick user(s) from the group.'
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

        gss.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id
        });
      });
  } catch (error) {
    console.error('Error:', error);
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "TRY AGAIN",
          id: `.kick`
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "GROUP MENU",
          id: `.groupmenu`
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
              text: 'An error occurred while processing the command.'
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

    gss.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default kick;