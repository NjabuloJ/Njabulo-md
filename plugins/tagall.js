import config from '../config.cjs';
import pkg from "baileys-pro";

const tagAll = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['tagall'];
    if (!validCommands.includes(cmd)) return;

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    let message = `乂 *Attention Everyone* 乂\n\n*Message:* ${m.body.slice(prefix.length + cmd.length).trim() || 'no message'}\n\n`;
    for (let participant of participants) {
      message += `❒ @${participant.id.split('@')[0]}\n`;
    }

    const buttons = [
      {
        "buttonId": "tagall_again",
        "buttonText": {
          "displayText": "Tag All Again"
        },
        "type": 1,
        "buttonParamsJson": JSON.stringify({
          display_text: "Tag All Again",
          id: "tagall_again",
          name: "Tag All"
        })
      }
    ];

    await gss.sendMessage(
      m.from,
      {
        text: message,
        mentions: participants.map(a => a.id),
        buttons: buttons,
        headerType: 1
      },
      { quoted: m }
    );
  } catch (error) {
    console.error('Error:', error);
    await m.reply('An error occurred while processing the command.');
  }
};

export default tagAll;