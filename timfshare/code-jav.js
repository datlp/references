EXTENSIONS =  /(mpg|mpe|mpeg|asf|mov|qt|rm|mp4|flv|m4v|webm|ogv|ogg|mkv|ts|tsv)$/;
//EXTENSIONS = /(zip|rar|7z)$/;
apiHeaders = {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiZnNoYXJlIiwidXVpZCI6IjcxZjU1NjFkMTUiLCJ0eXBlIjoicGFydG5lciIsImV4cGlyZXMiOjAsImV4cGlyZSI6MH0.WBWRKbFf7nJ7gDn1rOgENh1_doPc07MNsKwiKCJg40U",
    "content-type": "application/json",
    "sec-ch-ua":
      '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    Referer: "https://timfshare.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
  body: null,
  method: "POST",
};
(async () => {
  structures  = (await fetch("https://script.google.com/macros/s/AKfycby6VQCtXEo9ZRN_aUIf85iqmKRv1KvwlOlnxiYSMA75oU-7IwjT4TVzyrnxdC77tDgPhQ/exec?_uniqueField=id&is_get_all=true&name_sheet=CodeDeep&id_spreadsheet=1j96GzNo0qvlhnBHkFlTjdJxeqmcA0VDwADS2EOub1no")
  .then((res) => res.json())).filter((_)=>!_.prevent && _.id);
  //structures = [{ code: "heyzo", digits: 4, id: "ipx-•••", len: 3, status: 1 }];
    console.log(structures)
  recursion(structures, 0);
})();

function recursion(structures, __index) {
  let { code, digits } = structures[__index] || {};
  if (!code || !digits) return;
  code = code?.toLowerCase()?.replaceAll(' ','');
  filter = new RegExp(`[.]${code}[.][0-9]{${digits}}[.]`);
  fetchMovies(code, (data = []) => {
    standard = data.map((result = {}) => {
      const { name = "" } = result;
      _name = name
        .toLowerCase()
        .replaceAll(/[^0-9a-z]/g, ".")
        ?.replaceAll(`${code}.hd`, code)
        ?.replaceAll(`${code}hd`, code)
        ?.replaceAll(`${code}00`, code)
        ?.replaceAll(/[^0-9a-z]/g, ".")
        ?.replaceAll(/[0-9]{2,}/g, ".$&")
        ?.replaceAll(/[.]{1,}/g, ".");
        _name="." + _name;
      if (!_name.match(EXTENSIONS)?.[0]) return {_name,...result};
      __code = _name
        .match(filter)?.[0]
        ?.replaceAll(/[.]{1,}/g, "-")
        ?.toUpperCase()
        ?.slice(1,-1);

      return __code ? { __code, _name,...result } : {_name,...result};
    });
    
    filterMovies = standard
      .filter((item = {}) => item.__code)
      .sort((a, b) => (a.__code < b.__code ? 1 : -1));
     
    console.log(`${((__index/structures.length)*100).toFixed(0)} % - data: ${data.length} - matched: ${filterMovies.length} - ${code} - ${digits} `);
    console.log(filter," ",standard);
    fileContent = filterMovies
      .map(({ id, __code,name }) => `${__code}\t${id}\t${name}`)
      .join("\n");
    fileContent &&
      download(`${code} (${filterMovies.length})`, fileContent + "\n");
    recursion(structures, __index + 1);
  });
}

function fetchMovies(query, callback) {
  results = [];
  fetch(
    `https://api.timfshare.com/v1/string-query-search?query=${query}`,
    apiHeaders
  )
    .then((res) => res.json())
    .then((_ = {}) => {
      results = _.data || [];
      if (results.length < 150) return callback(results);

      Promise.all(
        ["00", ...Array(10).fill(0)].map((_, index) =>
          fetch(
            `https://api.timfshare.com/v1/string-query-search?query=${query}${
              _ ? `${_}` : ` ${index}`
            }`,
            apiHeaders
          ).then((res) => res.json())
        )
      ).then((__ = []) => {
        __.forEach((_r) => {
          results = [...results, ...(_r.data || [])];
        });
        ids = {};
        movies = [];
        results.forEach(({ id, ...rest }) => {
          if (!ids[id]) {
            movies.push({ id, ...rest });
            ids[id] = true;
          }
        });

        return callback(movies);
      });
    });
}

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
// https://github.com/datlp/references/blob/main/timfshare/code-jav.js
