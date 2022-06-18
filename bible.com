function main( ){
  const dataset = `1	KJV
12	ASV
193	VIE1925
151	VIE2010
8	AMPC
19	BD2011
31	BOOKS
37	CEB
42	CPDV
55	DRC1752
59	ESV
68	GNT
69	GNTD
70	GW
72	HCSB
90	LEB
97	MSG
100	NASB1995
105	NCV
107	NET
110	NIrV
111	NIV11
113	NIVUK11
114	NKJV
116	NLT
130	TOJB2011
205	BPT
206	engWEBUS
294	CEVUK
296	GNBUK
303	CEVDCI
314	TLV
316	TS2009
392	CEV
406	ERV
416	GNBDC
431	GNBDK
449	NVB
463	NABRE
477	RV1885
478	DARBY
546	KJVAAE
547	KJVAE
821	YLT98
1047	GWC
1077	JUB
1171	MEV
1204	WEBBE
1207	WMBBE
1209	WMB
1275	CJB
1359	ICB
1365	MP1650
1588	AMP
1638	VCB
1713	CSB
1849	TPT
1922	RV1895
1932	FBV
2015	NRSVCI
2016	NRSV
2017	RSVCI
2020	RSV
2079	EASY
2135	NMV
2163	enggnv
2407	WBMS
2530	PEV
2692	NASB2020
2753	RAD
3010	TEG
3034	BSB
3051	MP1781
3345	LSB`.split('\n').forEach(item=>{
  item = item.split('\t')
  setCell(item[1],"content")
  setCell(item[1],item[0],1,4)
})
  
}
function getContent(id = "193", reference = "GEN.1") {
  return JSON.stringify(getChapter(id, reference));
}

function getChapter(id = "193", reference = "GEN.10") {
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
        elementObj["paragraph"] = parseInt(paragraph_order, 10);
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

      !element[0]?.attribs["class"]?.match(/(content)|(heading)|(p)|(verse)/gi) &&
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

function setCell(sheetName = "New Sheet",value="3",col=1,row=3) {
   SpreadsheetApp.getActiveSpreadsheet()
    ?.getSheetByName(sheetName)
    ?.getRange(col,row).setValue(value);
}

const serveJSON = (obj = { success: true }) =>
  ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );

function doGet(e) {
  const { isBible, id, reference } = e.parameter;
  if (isBible) {
    if (id && !reference) {
      return serveJSON(getVersion(id));
    }
    if (id && reference) {
      return serveJSON(getChapter(id, reference));
    }
    return serveJSON();
  }
}
