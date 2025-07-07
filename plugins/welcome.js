import config from '../../config.cjs';
import pkg from "baileys-pro";

const gcEvent = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'welcome') {
    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");

    const groupMetadata = await Matrix.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    let responseMessage;
    const buttons = [
      {
        "buttonId": "welcome_on",
        "buttonText": {
          "displayText": "Enable Welcome"
        },
        "type": 1,
        "buttonParamsJson": JSON.stringify({
          display_text: "Enable Welcome",
          id: "welcome_on",
          name: "Welcome On"
        })
      },
      {
        "buttonId": "welcome_off",
        "buttonText": {
          "displayText": "Disable Welcome"
        },
        "type": 1,
        "buttonParamsJson": JSON.stringify({
          display_text: "Disable Welcome",
          id: "welcome_off",
          name: "Welcome Off"
        })
      }
    ];

    if (text === 'on') {
      config.WELCOME = true;
      responseMessage = "WELCOME & LEFT message has been enabled.";
    } else if (text === 'off') {
      config.WELCOME = false;
      responseMessage = "WELCOME & LEFT message has been disabled.";
    } else {
      responseMessage = "Usage:\n- `WELCOME on`: Enable WELCOME & LEFT message\n- `WELCOME off`: Disable WELCOME & LEFT message";
      await Matrix.sendMessage(
        m.from,
        {
          text: responseMessage,
          buttons: buttons,
          headerType: 1
        },
        { quoted: m }
      );
      return;
    }

    try {
      await Matrix.sendMessage(
        m.from,
        {
          text: responseMessage,
          buttons: buttons,
          headerType: 1
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default gcEvent;