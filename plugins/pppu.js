const ping = async (m, sock) => {
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';
  
// Fancy font utility
function toFancyFont(text, isUpperCase = false) {
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
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React('✈');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;
    const text = `*_🔥🇸​​🇮​​🇱​​🇻​​🇦​ ​🇪​​🇹​​🇭​​🇮​​🇽​ ѕρєє∂: ${responseTime.toFixed(2)} s_*`;
    const buttons = [
      {
        buttonId: `${prefix}alive`,
        buttonText: {
          displayText: `💻 ${toFancyFont("Alive")}`
        },
        type: 1
      },
      {
        buttonId: `${prefix}menu`,
        buttonText: {
          displayText: `📚 ${toFancyFont("Menu")}`
        },
        type: 1
      }
    ];
    sock.sendMessage(m.from, {
      text,
      buttons,
      headerType: 1
    }, { quoted: m });
  }
}

export default ping;
