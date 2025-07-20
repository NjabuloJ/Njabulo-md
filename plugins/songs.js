import axios from "axios";
import yts from "yt-search";
import config from '../config.cjs';

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

const play2 = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "play2") {
    if (!args) {
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
      };
      return gss.sendMessage(m.from, {
        text: `❒ ${toFancyFont("Please provide a YouTube link or song name")}\n${toFancyFont("Example: .play2 Moye Moye")}\n${toFancyFont("Or: .play2 https://youtu.be/xyz")}`,
        ...messageOptions,
      }, { quoted: m });
    }

    try {
      const buttons = [
        {
          buttonId: `.song`,
          buttonText: { displayText: toFancyFont("Get Song") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
      };
      gss.sendMessage(m.from, {
        text: `❒ ${toFancyFont("Processing your request...")}`,
        ...messageOptions,
      }, { quoted: m });

      let videoUrl;
      
      // Check if input is a YouTube URL
      if (args.match(/(youtube\.com|youtu\.be)/)) {
        videoUrl = args;
      } else {
        // Search YouTube if input is text
        const searchResults = await yts(args);
        if (!searchResults.videos.length) {
          const buttons = [
            {
              buttonId: `.search`,
              buttonText: { displayText: toFancyFont("Search Again") },
              type: 1,
            },
          ];
          const messageOptions = {
            buttons,
            viewOnce: true,
          };
          return gss.sendMessage(m.from, {
            text: `❒ ${toFancyFont("No results found")}`,
            ...messageOptions,
          }, { quoted: m });
        }
        videoUrl = searchResults.videos[0].url;
      }

      const apiUrl = `https://api.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.success) {
        const buttons = [
          {
            buttonId: `.retry`,
            buttonText: { displayText: toFancyFont("Retry") },
            type: 1,
          },
        ];
        const messageOptions = {
          buttons,
          viewOnce: true,
        };
        return gss.sendMessage(m.from, {
          text: `❒ ${toFancyFont("Failed to download audio")}`,
          ...messageOptions,
        }, { quoted: m });
      }

      const buttons = [
        {
          buttonId: `.document`,
          buttonText: { displayText: toFancyFont("Get Document") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
      };
      await gss.sendMessage(
        m.from,
        { 
          audio: { url: data.result.downloadUrl },
          mimetype: 'audio/mpeg'
        },
        { quoted: m }
      );
      await gss.sendMessage(m.from, {
        text: `❒ ${toFancyFont("Audio sent! Click Get Document to get the document")}`,
        ...messageOptions,
      }, { quoted: m });

      // Send document
      gss.sendMessage(
        m.from,
        { 
          document: { url: data.result.downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: `${data.result.title}.mp3`
        },
        { quoted: m }
      );

    } catch (error) {
      console.error(error);
      const buttons = [
        {
          buttonId: `.error`,
          buttonText: { displayText: toFancyFont("Error") },
          type: 1,
        },
      ];
      const messageOptions = {
        buttons,
        viewOnce: true,
      };
      gss.sendMessage(m.from, {
        text: `❒ ${toFancyFont("An error occurred: ")} ${error.message}`,
        ...messageOptions,
      }, { quoted: m });
    }
  }
};

export default play2;