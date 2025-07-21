import config from '../config.cjs';
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

const demote = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['demote', 'unadmin'];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return gss.sendMessage(m.from, {
      text: "*📛 ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs*",
      viewOnce: true,
    }, { quoted: m });

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await gss.decodeJid(gss.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return gss.sendMessage(m.from, {
      text: "*📛 ʙᴏᴛ ᴍᴜsᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ*",
      viewOnce: true,
    }, { quoted: m });

    if (!senderAdmin) return gss.sendMessage(m.from, {
      text: "*📛 ʏᴏᴜ ᴍᴜsᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ*",
      viewOnce: true,
    }, { quoted: m });

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
          buttonId: `.demote @user`,
          buttonText: { displayText: `👤${toFancyFont("demote user")}` },
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
      return gss.sendMessage(m.from, {
        text: `*${toFancyFont("please mention or quote a user to demote")}*`,
        ...messageOptions,
      }, { quoted: m });
    }

    const validUsers = users.filter(Boolean);

    await gss.groupParticipantsUpdate(m.from, validUsers, 'demote')
      .then(() => {
        const demotedNames = validUsers.map(user => `@${user.split("@")[0]}`);
        const buttons = [
          {
            buttonId: `.promote @user`,
            buttonText: { displayText: `👤${toFancyFont("promote user")}` },
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
        gss.sendMessage(m.from, {
          text: `*${toFancyFont("users")} ${demotedNames} ${toFancyFont("demoted")} ${toFancyFont("successfully")} ${toFancyFont("in")} ${toFancyFont("the")} ${toFancyFont("group")} ${groupMetadata.subject}*`,
          ...messageOptions,
        }, { quoted: m });
      })
      .catch(() => gss.sendMessage(m.from, {
        text: `*${toFancyFont("failed")} ${toFancyFont("to")} ${toFancyFont("demote")} ${toFancyFont("user(s)")} ${toFancyFont("in")} ${toFancyFont("the")} ${toFancyFont("group")}*`,
        viewOnce: true,
      }, { quoted: m }));
  } catch (error) {
    console.error('Error:', error);
    gss.sendMessage(m.from, {
      text: `*${toFancyFont("an")} ${toFancyFont("error")} ${toFancyFont("occurred")} ${toFancyFont("while")} ${toFancyFont("processing")} ${toFancyFont("the")} ${toFancyFont("command")}*`,
      viewOnce: true,
    }, { quoted: m });
  }
};

export default demote;
