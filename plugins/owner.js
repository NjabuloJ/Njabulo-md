import pkg from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";
import axios from "axios";

const ownerContact = async (m, gss) => {
  const ownernumber = config.OWNER_NUMBER;
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'owner') {
    try {
      const buttons = [
        {
          "buttonId": "contact_owner",
          "buttonText": {
            "displayText": "Chat with Owner"
          },
          "type": 1,
          "buttonParamsJson": JSON.stringify({
            display_text: "Chat with Owner",
            id: "contact_owner",
            name: "Owner Contact"
          })
        }
      ];

      await gss.sendMessage(
        m.from,
        {
          contacts: {
            displayName: 'Owner Contact',
            contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${ownernumber}\nFN:Owner\nitem1.TEL;waid=${ownernumber}:${ownernumber}\nitem1.X-ABLabel:Mobile\nEND:VCARD` }]
          },
          buttons: buttons,
          headerType: 4
        },
        { quoted: m }
      );

      await m.React("✅");
    } catch (error) {
      console.error('Error sending owner contact:', error);
      m.reply('Error sending owner contact.');
      await m.React("❌");
    }
  }
};

export default ownerContact;
