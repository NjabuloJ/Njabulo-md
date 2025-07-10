import config from '../config.cjs';

// Main command function
const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const validCommands = ['autostatuss', 'autosvieww', 'autostatusvieww'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) return m.reply("* THIS IS AN OWNER COMMAND*");

    if (!text) {
      const responseMessage = `Reply with a number:\n- *${prefix + cmd} 1:* Enable AUTO STATUS VIEW\n- *${prefix + cmd} 2:* Disable AUTO STATUS SEEN`;
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } else if (text === '1') {
      config.AUTO_STATUS_SEEN = true;
      const responseMessage = "AUTO STATUS SEEN has been enabled.";
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } else if (text === '2') {
      config.AUTO_STATUS_SEEN = false;
      const responseMessage = "AUTO STATUS SEEN has been disabled.";
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } else {
      const responseMessage = `Invalid input. Please reply with:\n- *${prefix + cmd} 1:* Enable AUTO STATUS VIEW\n- *${prefix + cmd} 2:* Disable AUTO STATUS SEEN`;
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    }
  }
};

export default anticallCommand;
