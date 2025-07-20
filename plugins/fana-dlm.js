import axios from 'axios';
import config from '../config.cjs';
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;

function toFancyFont(text, isUpperCase = false) {
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
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

const imdb = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['movie'];

    if (!validCommands.includes(cmd)) return;

    if (!text) {
      const buttons = [
        {
          buttonId: `.help`,
          buttonText: { displayText: `${toFancyFont("Help")}` },
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
      return gss.sendMessage(m.from, { text: `*${toFancyFont("Give me a series or movie name")}`, ...messageOptions });
    }

    let fids = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(text)}&plot=full`);
    let imdbt = "";
    
    if (fids.data.Response === "False") {
      const buttons = [
        {
          buttonId: `.report`,
          buttonText: { displayText: `${toFancyFont("Report")}` },
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
      return gss.sendMessage(m.from, { text: `*${toFancyFont("Movie or series not found")}`, ...messageOptions });
    }

    imdbt += `*${toFancyFont("IMDB SEARCH")}*\n\n`;
    imdbt += `*${toFancyFont("Title")}:* ${fids.data.Title}\n`;
    imdbt += `*${toFancyFont("Year")}:* ${fids.data.Year}\n`;
    imdbt += `*${toFancyFont("Rated")}:* ${fids.data.Rated}\n`;
    imdbt += `*${toFancyFont("Released")}:* ${fids.data.Released}\n`;
    imdbt += `*${toFancyFont("Runtime")}:* ${fids.data.Runtime}\n`;
    imdbt += `*${toFancyFont("Genre")}:* ${fids.data.Genre}\n`;
    imdbt += `*${toFancyFont("Director")}:* ${fids.data.Director}\n`;
    imdbt += `*${toFancyFont("Writer")}:* ${fids.data.Writer}\n`;
    imdbt += `*${toFancyFont("Actors")}:* ${fids.data.Actors}\n`;
    imdbt += `*${toFancyFont("Plot")}:* ${fids.data.Plot}\n`;
    imdbt += `*${toFancyFont("Language")}:* ${fids.data.Language}\n`;
    imdbt += `*${toFancyFont("Country")}:* ${fids.data.Country}\n`;
    imdbt += `*${toFancyFont("Awards")}:* ${fids.data.Awards}\n`;
    imdbt += `*${toFancyFont("BoxOffice")}:* ${fids.data.BoxOffice}\n`;
    imdbt += `*${toFancyFont("Production")}:* ${fids.data.Production}\n`;
    imdbt += `*${toFancyFont("imdbRating")}:* ${fids.data.imdbRating}\n`;
    imdbt += `*${toFancyFont("imdbVotes")}:* ${fids.data.imdbVotes}\n`;

    const buttons = [
      {
        buttonId: `.menu`,
        buttonText: { displayText: `${toFancyFont("Menu")}` },
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
    await gss.sendMessage(m.from, {
      image: {
        url: fids.data.Poster,
      },
      caption: imdbt,
      ...messageOptions,
    }, {
      quoted: m,
    });
  } catch (error) {
    console.error('Error:', error);
    const buttons = [
      {
        buttonId: `.report`,
        buttonText: { displayText: `${toFancyFont("Report")}` },
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
    gss.sendMessage(m.from, { text: `*${toFancyFont("An error occurred while fetching the data.")}`, ...messageOptions });
  }
};

export default imdb;