import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;

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

function toFancyFont(text, isUpperCase = false) {
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return Array.from(formattedText).map((char) => fonts[char] || char).join("");
}

const kick = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (!["kick", "remove"].includes(cmd)) return;

    if (!m.isGroup) {
      const buttons = [
        {
          buttonId: `.menu`,
          buttonText: { displayText: toFancyFont("Menu") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
      };
      return Matrix.sendMessage(m.from, {
        text: `❒ ${toFancyFont("Yo, Toxic-MD only kicks in groups!")} 🏠`,
        ...messageOptions,
      }, { quoted: m });
    }

    const groupMetadata = await Matrix.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find((p) => p.id === botNumber)?.admin;
    const senderAdmin = participants.find((p) => p.id === m.sender)?.admin;

    if (!botAdmin) {
      const buttons = [
        {
          buttonId: `.promote`,
          buttonText: { displayText: toFancyFont("Promote") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
      };
      return Matrix.sendMessage(m.from, {
        text: `❒ ${toFancyFont("Toxic-MD needs admin powers to kick, fam!")} 😡`,
        ...messageOptions,
      }, { quoted: m });
    }

    if (!senderAdmin) {
      const buttons = [
        {
          buttonId: `.admin`,
          buttonText: { displayText: toFancyFont("Admin") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
      };
      return Matrix.sendMessage(m.from, {
        text: `❒ ${toFancyFont("You ain’t an admin, fam! Step up or chill!")} 😎`,
        ...messageOptions,
      }, { quoted: m });
    }

    if (!m.mentionedJid) m.mentionedJid = [];
    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : text.replace(/[^0-9]/g, "").length > 0
      ? [text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"]
      : [];

    if (users.length === 0) {
      const buttons = [
        {
          buttonId: `.help`,
          buttonText: { displayText: toFancyFont("Help") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
        1,
      };
      return Matrix.sendMessage(m.from, {
        text: `❒ ${toFancyFont("Tag or quote someone to kick, fam! Don’t ghost Toxic-MD!")} 😤`,
        ...messageOptions,
      }, { quoted: m });
    }

    const validUsers = users.filter((user) => {
      if (!user) return false;
      const isMember = participants.some((p) => p.id === user);
      const isBot = user === botNumber;
      const isSender = user === m.sender;
      return isMember && !isBot && !isSender;
    });

    if (validUsers.length === 0) {
      const buttons = [
        {
          buttonId: `.members`,
          buttonText: { displayText: toFancyFont("Members") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
      };
      return Matrix.sendMessage(m.from, {
        text: `❒ ${toFancyFont("Can’t kick nobody, fam! Check the tags or don’t try kickin’ yourself or Toxic-MD!")} 😜`,
        ...messageOptions,
      }, { quoted: m });
    }

    await Matrix.groupParticipantsUpdate(m.from, validUsers, "remove");
    const kickedNames = validUsers.map((user) => `@${user.split("@")[0]}`).join(", ");
    const buttons = [
      {
        buttonId: `.alive`,
        buttonText: { displayText: toFancyFont("Alive") },
        type: 1,
      },
      {
        buttonId: `.menu`,
        buttonText: { displayText: toFancyFont("Menu") },
        type: 1,
      },
    ];
    const messageOptions = {
      buttons,
      viewOnce: true,
      contextInfo: { mentionedJid: validUsers },
    };
    await Matrix.sendMessage(m.from, {
      text: `❒ ${toFancyFont(kickedNames)} ${toFancyFont("got yeeted from")} *${groupMetadata.subject}* ${toFancyFont("by Toxic-MD!")} 👊💥`,
      ...messageOptions,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Kick error: ${error.message}`);
    const buttons = [
      {
        buttonId: `.report`,
        buttonText: { displayText: toFancyFont("Report") },
        type: 1,
      },
    ];
    const messageOptions = {
      buttons,
      viewOnce: true,
    };
    await Matrix.sendMessage(m.from, {
      text: `❒ ${toFancyFont("Toxic-MD hit a snag kickin’, fam! Try again!")} 😈`,
      ...messageOptions,
    }, { quoted: m });
  }
};

export default kick;