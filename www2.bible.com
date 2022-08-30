// ---------------------------------------------------------
// ◖sup◗: verse label
// ≤strong≥: chapter label
// «span»: verse content
// →data-usfm←: verse usfm
// ≈<br>≈: line

function convertJSON(content) {
  obj = {};
  content.match(/«.*?»/gi).map((item, index) => {
    const split = item.slice(2, -1).split("←");
    if (obj[split[0]]) obj[split[0]].content += split[1];
    else obj[split[0]] = { content: split[1], index };
  });
  return obj;
}

function convertHTML(content) {
  return content
    .match(/≈.*?≈|≤.*?≥|◖.*?◗|«.*?»/gi)
    .map((text) =>
      text.replaceAll(/◖|◗|≤|≥|«|»|→|←|≈/g, (char) => {
        switch (char) {
          case "◖":
            return "<sup>";
          case "◗":
            return `</sup>`;
          case "≤":
            return '<strong data-type="heading">';
          case "≥":
            return "</strong>";
          case "«":
            return "<span ";
          case "»":
            return `</span>`;
          case "→":
            return 'data-usfm="';
          case "←":
            return '">';
          case "≈":
            return "";
        }
        return char;
      })
    )
    .join("");
}

hashBible = {
  37: "CEB",
  42: "CPDV",
  55: "DRC1752",
  431: "GNBDK",
  1: "KJV",
  8: "AMPC",
  12: "ASV",
  19: "BD2011",
  59: "ESV",
  68: "GNT",
  193: "VIE1925",
  3034: "BSB",
  3345: "LSB",
  69: "GNTD",
  416: "GNBDC",
  1204: "WEBBE",
  1922: "RV1895",
  2015: "NRSVCI",
  2017: "RSVCI",
  2407: "WBMS",
  206: "engWEBUS",
  303: "CEVDCI",
  546: "KJVAAE",
  463: "NABRE",
  70: "GW",
  72: "HCSB",
  90: "LEB",
  97: "MSG",
  100: "NASB1995",
  105: "NCV",
  107: "NET",
  110: "NIrV",
  111: "NIV11",
  113: "NIVUK11",
  114: "NKJV",
  116: "NLT",
  130: "TOJB2011",
  151: "VIE2010",
  205: "BPT",
  294: "CEVUK",
  296: "GNBUK",
  314: "TLV",
  316: "TS2009",
  392: "CEV",
  406: "ERV",
  449: "NVB",
  477: "RV1885",
  478: "DARBY",
  547: "KJVAE",
  821: "YLT98",
  1077: "JUB",
  1171: "MEV",
  1207: "WMBBE",
  1209: "WMB",
  1275: "CJB",
  1359: "ICB",
  1588: "AMP",
  1638: "VCB",
  1713: "CSB",
  1932: "FBV",
  2016: "NRSV",
  2020: "RSV",
  2079: "EASY",
  2135: "NMV",
  2163: "enggnv",
  2692: "NASB2020",
  1849: "TPT",
  2753: "RAD",
  31: "BOOKS",
  3051: "MP1781",
  2530: "PEV",
  1047: "GWC",
  1365: "MP1650",
  3010: "TEG",
};
async function recursion(url, count = 0) {
  if (!url) return;
  await fetch(url)
    .then((res) => res.json())
    .then((result) => {
      const { reference, next, content, ...rest } = result;
      index = `000000${count}`.slice(-7);
      count++;
      title = `${hashBible[reference.version_id]}.${index}.${reference.usfm
        .join(" ")
        .replaceAll(/[.][\d]{1,}/g, (found) => {
          return found
            .replace(/[\d]{1,}/, "0000$&")
            .replace(/[\d]{1,}/, (found1) => found1.slice(-3));
        })}`;
      delete result.content;
      download(title + ".json", JSON.stringify(result) + ",\n");
      download(title + ".html", content + "\n");
      recursion(
        `https://nodejs.bible.com/api/bible/chapter/3.1?id=${next.version_id}&reference=${next.usfm?.[0]}`,
        count
      );
    });
}

await recursion(
  "https://nodejs.bible.com/api/bible/chapter/3.1?id=193&reference=GEN.1",
  0
);
function download(filename, text) {
  if (!filename) return;
  var pom = document.createElement("a");
  pom.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  pom.setAttribute("download", filename);

  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}

//

obj = {};
fileContent.match(/«.*?»/gi).map((item, index) => {
  const split = item.slice(2, -1).split("←");
  if (obj[split[0]]) obj[split[0]].content += split[1];
  else obj[split[0]] = { content: split[1], index };
});
obj;

document.querySelectorAll(".chapter>.label").forEach((label) => {
  label.remove();
});
document.querySelectorAll(".chapter .heading").forEach((heading) => {
  heading.innerText = `≤${heading.innerText}≥`;
});
document.querySelectorAll(".verse>.label").forEach((label) => {
  label.innerText = `◖${label.innerText}◗`;
});
document.querySelectorAll(".chapter .verse").forEach((verse) => {
  verse.querySelectorAll(".content").forEach((content) => {
    content.innerText = `«→${verse.dataset.usfm}←${content.innerText}»`;
  });
});
fileContent = "";
document.querySelectorAll(".chapter").forEach((chapter) => {
  text = chapter.innerText
    .replaceAll(/[\n]{1,}/g, "≈<br>≈")
    .replaceAll("\t", "");
  fileContent += `${chapter.dataset.usfm}\t${text}\n`;
});
download("e", fileContent);
function download(filename, text) {
  if (!filename) return;
  var pom = document.createElement("a");
  pom.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  pom.setAttribute("download", filename);

  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}

fileContent
  .match(/≈.*?≈|≤.*?≥|◖.*?◗|«.*?»/gi)
  .map((text) =>
    text.replaceAll(/◖|◗|≤|≥|«|»|→|←|≈/g, (replace) => html(replace))
  )
  .join("");
function html(char) {
  switch (char) {
    case "◖":
      return "<sup>";
    case "◗":
      return `</sup>`;
    case "≤":
      return '<strong data-type="heading">';
    case "≥":
      return "</strong>";
    case "«":
      return "<span ";
    case "»":
      return `</span>`;
    case "→":
      return 'data-usfm="';
    case "←":
      return '">';
    case "≈":
      return "";
  }
}

//
document.querySelectorAll(".chapter .heading").forEach((heading) => {
  heading.innerText = `«${heading.innerText}»`;
});
document.querySelectorAll(".chapter .verse").forEach((verse) => {
  label = verse.querySelector(".label")?.innerText || "";
  label && verse.querySelector(".label")?.remove();
  verse.querySelectorAll(".content").forEach((content) => {
    content.innerText = `«┌${label}┘→${verse.dataset.usfm}←${content.innerText}»`;
  });
});
fileContent = "";
document.querySelectorAll(".chapter").forEach((chapter) => {
  text = chapter.innerText
    .replaceAll(/[\n]{1,}/g, "«<br/>»")
    .replaceAll("\t", "");
  fileContent += `${chapter.dataset.usfm}\t${text}\n`;
});
download("e", fileContent);
function download(filename, text) {
  if (!filename) return;
  var pom = document.createElement("a");
  pom.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  pom.setAttribute("download", filename);

  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}
download(
  "e",
  arr
    .map(({ audio }) =>
      Object.keys(audio?.[0]?.download_urls)
        .map((keys) => audio?.[0]?.download_urls[keys])
        .join("\t")
    )
    .join("\n")
);
