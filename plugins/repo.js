import axios from "axios";
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;

const toFancyFont = (text, isUpperCase = false) => {
  const fonts = {
    A: "𝘼",
    B: "𝘽",
    C: "𝘾",
    D: "𝘿",
    E: "𝙀",
    F: "𝙁",
    G: "𝙂",
    H: "𝙃",
    I: "𝙄",
    J: "𝙅",
    K: "𝙆",
    L: "𝙇",
    M: "𝙈",
    N: "𝙉",
    O: "𝙊",
    P: "𝙋",
    Q: "𝙌",
    R: "𝙍",
    S: "𝙎",
    T: "𝙏",
    U: "𝙐",
    V: "𝙑",
    W: "𝙒",
    X: "𝙓",
    Y: "𝙔",
    Z: "𝙕",
    a: "𝙖",
    b: "𝙗",
    c: "𝙘",
    d: "𝙙",
    e: "𝙚",
    f: "𝙛",
    g: "𝙜",
    h: "𝙝",
    i: "𝙞",
    j: "𝙟",
    k: "𝙠",
    l: "𝙡",
    m: "𝙢",
    n: "𝙣",
    o: "𝙤",
    p: "𝙥",
    q: "𝙦",
    r: "𝙧",
    s: "𝙨",
    t: "𝙩",
    u: "𝙪",
    v: "𝙫",
    w: "𝙬",
    x: "𝙭",
    y: "𝙮",
    z: "𝙯",
  };
  return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
};

const repo = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (!["repo", "sc", "script", "info"].includes(cmd)) return;

    if (text) {
      await Matrix.sendMessage(
        m.from,
        {
          text: `Yo, ${m.pushName}, quit the extra bullshit! Just use *${prefix}repo*, dumbass! 😤`,
          buttons: [
            {
              buttonId: `.menu`,
              buttonText: { displayText: `${toFancyFont("Menu")}` },
              type: 1,
            },
            {
              buttonId: `.alive`,
              buttonText: { displayText: `${toFancyFont("Alive")}` },
              type: 1,
            },
          ],
        },
        { quoted: m }
      );
      return;
    }

    await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const repoUrl = "https://api.github.com/repos/xhclintohn/Toxic-MD";
    const headers = {
      Accept: "application/vnd.github.v3+json",
      ...(config.GITHUB_TOKEN ? { Authorization: `token ${config.GITHUB_TOKEN}` } : {}),
    };

    const response = await axios.get(repoUrl, { headers });
    const repoData = response.data;

    if (response.status !== 200 || !repoData.full_name) {
      throw new Error("Failed to fetch repo data or repo not found.");
    }

    const createdDate = new Date(repoData.created_at).toLocaleDateString("en-GB");
    const lastUpdateDate = new Date(repoData.updated_at).toLocaleDateString("en-GB");

    const replyText = `*${toFancyFont("Toxic-MD")}* ${toFancyFont("Repo")}\n
*Bot:* ${repoData.name || "N/A"}
*Owner:* ${repoData.owner?.login || "N/A"}
*Stars:* ${repoData.stargazers_count || 0} (star it, fam!)
*Forks:* ${repoData.forks_count || 0} (fork it, now!)
*Description:* ${repoData.description || "No description"}
*Created:* ${createdDate}
*Updated:* ${lastUpdateDate}
*Link:* ${repoData.html_url}
*Powered By Toxic-MD*`;

    const buttons = [
      {
        buttonId: `.menu`,
        buttonText: { displayText: `${toFancyFont("Menu")}` },
        type: 1,
      },
      {
        buttonId: `.alive`,
        buttonText: { displayText: `${toFancyFont("Alive")}` },
        type: 1,
      },
    ];

    await Matrix.sendMessage(
      m.from,
      {
        image: { url: "https://files.catbox.moe/y2utve.jpg" },
        caption: replyText,
        buttons,
      },
      { quoted: m }
    );

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });
  } catch (error) {
    console.error(`❌ Repo error: ${error.message}`);
    await Matrix.sendMessage(
      m.from,
      {
        react: { text: "❌", key: m.key },
        text: `*Toxic-MD* failed to fetch repo stats! 😈\nVisit: https://github.com/xhclintohn/Toxic-MD`,
      },
      { quoted: m }
    );
  }
};

export default repo;