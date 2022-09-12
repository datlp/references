REG_MOVIE_EXTENSIONS =
  /[.](AVI|MPG|MPE|MPEG|ASF|WMV|MOV|QT|RM|MP4|FLV|M4V|WEBM|OGV|OGG|MKV|TS|TSV)/;
PAGESIZE = 10;
async function recursion(PAGE = 0, CODES = []) {
  if (PAGE * PAGESIZE > CODES.length) return;
  arr = [];
  values = await Promise.all(
    CODES.slice(PAGE * PAGESIZE, (PAGE + 1) * PAGESIZE).map((item) =>
      fetch(
        "https://api.timfshare.com/v1/string-query-search?query=" + item.search,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiZnNoYXJlIiwidXVpZCI6IjcxZjU1NjFkMTUiLCJ0eXBlIjoicGFydG5lciIsImV4cGlyZXMiOjAsImV4cGlyZSI6MH0.WBWRKbFf7nJ7gDn1rOgENh1_doPc07MNsKwiKCJg40U",
            "content-type": "application/json",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
          referrer: "https://timfshare.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      ).then((response) => response.json())
    )
  ).then((result) => {
    result.forEach((child, order) => {
      input = CODES[order + PAGE * PAGESIZE];
      searchKey = input.search;
      number = input.number;
      code = input.code;
      console.log(searchKey, number, code);
      child.data.forEach(({ id, name }) => {
        try {
          const text = name
            .toUpperCase()
            ?.replaceAll(
              new RegExp(`${searchKey}(-| |_|N|)[0]{1,}[0-9]{${number}}`, "gi"),
              (found) =>
                found.replace(
                  new RegExp(`(-| |_|N|)[0]{1,}[0-9]{${number},}`),
                  (founded) => founded.slice(-1 * parseInt(number))
                )
            );

          if (REG_MOVIE_EXTENSIONS.test(text)) {
            codeExtracted = text.match(
              new RegExp(`${searchKey}(-| |_|)[0-9]{${number},}`, "gi")
            );
            if (Array.isArray(codeExtracted)) {
              extracted = codeExtracted[0].replaceAll(
                new RegExp(searchKey + "(-| |_|)", "gi"),
                code + "-"
              );

              arr = [
                ...new Set([
                  ...arr,
                  `${extracted.replace()}\t${name}\t${id}`,
                ]),
              ];
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
  });
  download(CODES[PAGE * PAGESIZE].search, arr.join("\n") + "\n");
  await recursion(PAGE + 1, CODES);
}

(async () => {
  CODES = await fetch(
    "https://script.google.com/macros/s/AKfycby6VQCtXEo9ZRN_aUIf85iqmKRv1KvwlOlnxiYSMA75oU-7IwjT4TVzyrnxdC77tDgPhQ/exec?_uniqueField=id&is_get_all=true&name_sheet=CODES&id_spreadsheet=1j96GzNo0qvlhnBHkFlTjdJxeqmcA0VDwADS2EOub1no"
  ).then((res) => res.json());
  console.log(recursion(0, CODES.slice(0,25)));
})();
function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute(
    "download",
    new Date().getTime() + " " + filename + ".txt"
  );
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
REG_MOVIE_EXTENSIONS =
  /[.](AVI|MPG|MPE|MPEG|ASF|WMV|MOV|QT|RM|MP4|FLV|M4V|WEBM|OGV|OGG|MKV|TS|TSV)/;
PAGESIZE = 10;
async function recursion(index = 0, CODES = []) {
  if (index >= CODES.length) return;
  arr = [];
  values = await Promise.all(
    genCode(CODES[index].code).map((item) =>
      fetch(
        "https://api.timfshare.com/v1/string-query-search?query=" + item,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiZnNoYXJlIiwidXVpZCI6IjcxZjU1NjFkMTUiLCJ0eXBlIjoicGFydG5lciIsImV4cGlyZXMiOjAsImV4cGlyZSI6MH0.WBWRKbFf7nJ7gDn1rOgENh1_doPc07MNsKwiKCJg40U",
            "content-type": "application/json",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
          referrer: "https://timfshare.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      ).then((response) => response.json())
    )
  ).then((result) => {
    result.forEach((child, order) => {
      input = CODES[index];
      searchKey = input.code;
      number = input.number;
      child.data.forEach(({ id, name }) => {
        try {
          const text = name
            .toUpperCase()
            ?.replaceAll(
              new RegExp(`${searchKey}(-| |_|N|)[0]{1,}[0-9]{${number}}`, "gi"),
              (found) =>
                found.replace(
                  new RegExp(`(-| |_|N|)[0]{1,}[0-9]{${number},}`),
                  (founded) => founded.slice(-1 * parseInt(number))
                )
            );

          if (REG_MOVIE_EXTENSIONS.test(text)) {
            codeExtracted = text.match(
              new RegExp(`${searchKey}(-| |_|)[0-9]{${number},}`, "gi")
            );
            if (Array.isArray(codeExtracted)) {
              extracted = codeExtracted[0].replaceAll(
                new RegExp(searchKey + "(-| |_|)", "gi"),
                searchKey.toUpperCase() + "-"
              );

              arr = [
                ...new Set([
                  ...arr,
                  `${extracted.replace()}\t${name}\t${id}`,
                ]),
              ];
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
  });
  download(CODES[index].code, arr.join("\n") + "\n");
  await recursion(index+1, CODES);
}

(async () => {
  CODES = await fetch(
    "https://script.google.com/macros/s/AKfycby6VQCtXEo9ZRN_aUIf85iqmKRv1KvwlOlnxiYSMA75oU-7IwjT4TVzyrnxdC77tDgPhQ/exec?_uniqueField=id&is_get_all=true&name_sheet=CodeDeep&id_spreadsheet=1j96GzNo0qvlhnBHkFlTjdJxeqmcA0VDwADS2EOub1no"
  ).then((res) => res.json());
  console.log(recursion(0, CODES.slice(0,25)));
})();
function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute(
    "download",
    new Date().getTime() + " " + filename + ".txt"
  );
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function genCode(code = '') {
  text =
    Array(10)
      .fill(code)
      .map(
        (code, index) =>
          `${code}-${index} ${code}_${index} ${code}${index} ${code}00${index}`
      )
      .join(' ') + ` ${code}0000 ${code}`;
  return (text || '').split(' ');
}
