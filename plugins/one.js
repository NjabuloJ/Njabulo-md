import config from "../config.cjs";

const sendFormattedMessage = async (Matrix, chatId, text, ms) => {
  await Matrix.sendMessage(chatId, {
    text,
    contextInfo: {
      externalAdReply: {
        title: "Njabulo Jb",
        body: "Message via ad !",
        thumbnailUrl: "https:                                                 
        sourceUrl: "//whatsapp.com/channel/0029VbAckOZ7tkj92um4KN3u",
        sourceUrl: "https://whatsapp.com/channel/0029VbAckOZ7tkj92um4KN3u",
        mediaType: 1,
        showAdAttribution: true
      }
    }
  }, { quoted: ms });
};

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'line') {
    if (!isCreator) return m.reply("*ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ*");

    let responseMessage;
    if (text.startsWith('1.')) {
      const choice = text.split('.')[1];
      switch (choice) {
        case '1':
          config.ALWAYS_ONLINE = true;
          responseMessage = "Always Online has been enabled.";
          break;
        case '2':
          config.ALWAYS_ONLINE = false;
          responseMessage = "Always Online has been disabled.";
          break;
        default:
          responseMessage = "Invalid choice. Please reply with 1.1 to enable or 1.2 to disable.";
      }
    } else {
      responseMessage = "Usage:\n- `alwaysonline 1.1`: Enable Always Online\n- `alwaysonline 1.2`: Disable Always Online";
    }

    try {
      await sendFormattedMessage(Matrix, m.from, responseMessage, m);
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default alwaysonlineCommand;
