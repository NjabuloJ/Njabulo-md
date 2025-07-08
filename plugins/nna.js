import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const FORWARDING_SCORE = 999;
const SERVER_MESSAGE_ID = 143;

const createButton = (displayText, id) => ({
  name: 'quick_reply',
  buttonParamsJson: JSON.stringify({ display_text: displayText, id }),
});

const alive = async (m, Matrix) => {
  try {
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / DAY);
    const hours = Math.floor((uptimeSeconds % DAY) / HOUR);
    const minutes = Math.floor((uptimeSeconds % HOUR) / MINUTE);
    const seconds = Math.floor(uptimeSeconds % MINUTE);

    const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

    if (['al', 'up', 'runtime'].includes(cmd)) {
      const uptimeMessage = `*🤖 ETHIX-MD Status Overview*
_______________________________________

*📆 ${days} Day*
*🕰️ ${hours} Hour*
*⏳ ${minutes} Minute*
*⏲️ ${seconds} Second*
_______powered by silva tech____________
`;

      const buttons = [
        createButton('MENU', `.menu`),
        createButton('PING', `.ping`),
      ];

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: uptimeMessage,
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: '© Powered By 𝕊𝕀𝕃𝕍𝔸',
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: '',
                gifPlayback: true,
                subtitle: '',
                hasMediaAttachment: false,
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons,
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: FORWARDING_SCORE,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363249960769123@newsletter',
                  newsletterName: 'Ethix-MD',
                  serverMessageId: SERVER_MESSAGE_ID,
                },
              },
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id,
      });
    }
  } catch (error) {
    console.error('Error sending alive message:', error);
  }
};

export default alive;
