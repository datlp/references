EXTENSIONS =
  /(avi|mpg|mpe|mpeg|asf|wmv|mov|qt|rm|mp4|flv|m4v|webm|ogv|ogg|mkv|ts|tsv)$/;
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
(async ()=>{
structures  = (await fetch(
    "https://script.google.com/macros/s/AKfycby6VQCtXEo9ZRN_aUIf85iqmKRv1KvwlOlnxiYSMA75oU-7IwjT4TVzyrnxdC77tDgPhQ/exec?_uniqueField=id&is_get_all=true&name_sheet=CodeDeep&id_spreadsheet=1j96GzNo0qvlhnBHkFlTjdJxeqmcA0VDwADS2EOub1no"
  ).then((res) => res.json())).map(({id})=>id);

recursion(0);
})()

function recursion(__index) {
    structure = (structures[__index]);
    if(!structure) return 
  query = structure.replace(/-.*/, "")?.toLowerCase();
  digits = structure.match(/[*]{2,}/)?.[0]?.length;
  filters = [
    new RegExp(`${query}[0-9]{${digits}}`),
    new RegExp(`${query}00[0-9]{${digits}}`),
  ];
  fetchMovies(query, (movies) => {
    download(
      query,
      movies
        .map(({ name = "", ...rest }) => {
          _name = name.toLowerCase().replaceAll(/[^0-9a-z]/g, "");
          if (!_name.match(EXTENSIONS)) return;
          code = _name
            .match(filters[0])?.[0]
            ?.toUpperCase()
            ?.replace(
              new RegExp(`[0-9]{${digits}}$`),
              (str) => `-${str.match(new RegExp(`[0-9]{${digits}}$`))}`
            );
          if (code) return { code, ...rest, name };
          return;
        })
        .filter((item) => item)
        .sort((a, b) => (a.code < b.code ? 1 : -1))
        .map(({ id, code }) => `${code}\t${id}`)
        .join("\n")
    );
    recursion(__index+1)
  });
}
function fetchMovies(query, callback) {
  Promise.all(
    Array(10)
      .fill(0)
      .map((_, index) =>
        fetch(
          `https://api.timfshare.com/v1/string-query-search?query=${query} ${index}`,
          apiHeaders
        ).then((res) => res.json())
      )
  ).then((result) => {
    ids = {};
    movies = [];
    result.forEach(({ data = [] }) => {
      data.forEach(({ id, ...rest }) => {
        if (!ids[id]) {
          movies.push({ id, ...rest });
          ids[id] = true;
        }
      });
    });
    callback(movies);
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
