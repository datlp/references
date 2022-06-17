function getContent(id = "193", reference = "GEN.1") {
  return JSON.stringify(main(id, reference));
}

function main(id = "193", reference = "GEN.10") {
  const { content, ...rest } = JSON.parse(
    UrlFetchApp.fetch(
      `https://nodejs.bible.com/api/bible/chapter/3.1?id=${id}&reference=${reference}`
    ).getContentText() || {}
  );
  if (!content) return "";
  let result = [];
  const $ = Cheerio.load(content);
  $(".chapter")
    .children()
    .each((index, element) => {
      $(element).attr("data-order", index);
    });
  $(".verse .content,.heading").map((index, item) => {
    let elementObj = (initial = { styles: [] });
    function recursion(element) {
      if (element.hasClass("chapter")) {
        // elementObj.push(element[0].attribs["data-usfm"]);
        return;
      }
      if (!element.parent()) return;
      recursion($(element.parent()));

      if (element.hasClass("verse")) {
        const verse_usfm = element[0].attribs["data-usfm"];
        elementObj["verse"] = verse_usfm;
      }
      if (element[0].attribs["data-order"] !== undefined) {
        const paragraph_order = element[0].attribs["data-order"];
        elementObj["paragraph"] = parseInt(paragraph_order,10);
      }
      if (element.hasClass("content")) {
        if (
          element.text().match(/[ ]{0,}/)?.[0]?.length === element.text().length
        ) {
          elementObj = initial;
        } else {
          elementObj["content"] = element.text();
          result.push(elementObj);
          elementObj = initial;
        }
      }
      if (element.hasClass("heading")) {
        elementObj["heading"] = element.text();
        result.push(elementObj);
        elementObj = initial;
      }

      !element[0].attribs["class"].match(/(content)|(heading)|(p)|(verse)/gi) &&
        elementObj.styles.push(element[0].attribs["class"]);
    }
    recursion($(item));
  });

  return { ...rest, content: result };
}

function getVersion(id = 1588) {
  const version =
    JSON.parse(
      UrlFetchApp.fetch(
        `https://nodejs.bible.com/api/bible/version/3.1?id=${id}`
      ).getContentText()
    ) || {};
  const {
    abbreviation,
    books = [],
    title,
    language: { name },
  } = version;

  return [
    [
      abbreviation,
      title,
      name,
      JSON.stringify(
        books.map(({ human, human_long, usfm, chapters = [] }) => ({
          human,
          human_long,
          usfm,
          chapters: chapters.map(({ usfm }) => ({ usfm })),
        }))
      ),
    ],
  ];
}

function getId(sheetName = "New Sheet") {
  return SpreadsheetApp.getActiveSpreadsheet()
    ?.getSheetByName(sheetName)
    ?.getSheetId();
}

const serveJSON = (obj = { success: true }) =>
  ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );

function doGet(e) {
  const { isBible, id, reference } = e.parameter;
  if (isBible) {
    if (id && !reference) {
      return serveJSON(
        UrlFetchApp.fetch(
          `https://nodejs.bible.com/api/bible/version/3.1?id=${id}`
        ).getContentText()
      );
    }
    if (id && reference) {
      return serveJSON(main(id, reference));
    }
    return serveJSON();
  }
}
