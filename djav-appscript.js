const spreadsheetId = '1j96GzNo0qvlhnBHkFlTjdJxeqmcA0VDwADS2EOub1no';
const SHEET_NAMES = {
  categories: 'Categories',
  actresses: 'Actresses',
  channels: 'Channels',
  movies: 'MoviesBeta',
  history: 'History',
};

const API_TYPES = {
  categories: {
    getAll: 'GET_CATEGORIES',
  },
  actresses: {
    getAll: 'GET_ACTRESSES',
  },
  channels: {
    getAll: 'GET_CHANNELS',
  },
  movies: {
    getAll: 'GET_MOVIES',
  },
  history: {
    add: 'ADD_HISTORY',
  },
};
const regRelease = /[\d]{4}-[\d]{2}-[\d]{2}/;
const regElements = /<.*?>/g;

function getcode(e = '') {
  if (!e) return '';
  const content = UrlFetchApp.fetch(
    'https://api.timfshare.com/v1/autocomplete?query=' + e,
    {
      headers: {
        accept: '*/*',
        'accept-language':
          'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiZnNoYXJlIiwidXVpZCI6IjcxZjU1NjFkMTUiLCJ0eXBlIjoicGFydG5lciIsImV4cGlyZXMiOjAsImV4cGlyZSI6MH0.WBWRKbFf7nJ7gDn1rOgENh1_doPc07MNsKwiKCJg40U',
        'content-type': 'application/json',
        'sec-ch-ua':
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
      referrer: 'https://timfshare.com/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }
  ).getContentText();
  // console.log(content)
  // if (!content) return '';
  // const $ = Cheerio.load(content);
  // const text = $('#__NEXT_DATA__')?.html()
  // function filterMovies(arr = [], filterField = 'name', filterSort = 'size') {
  //   const EXTENSIONS =
  //     /[.](avi|mpg|mpe|mpeg|asf|wmv|mov|qt|rm|mp4|flv|m4v|webm|ogv|ogg|mkv|ts|tsv)/;
  //   return arr
  //     .filter((movie) => {
  //       return EXTENSIONS.test(movie[filterField]) ? true : false;
  //     })
  //     .sort((a, b) => (a[filterSort] < b[filterSort] ? 1 : -1));
  // }
  // return JSON.stringify(filterMovies(JSON.parse(text).props.pageProps.data))
  regex = new RegExp(
    `[0-9a-zA-Z_]{0,}${e.toLowerCase()}[0-9a-zA-Z_]{0,}(-| |_|)[0-9]{2,}`,
    'gi'
  );
  let obj = {};
  console.log(
    JSON.stringify(JSON.parse(content).data).toLowerCase().match(regex)
  );
  const db = JSON.stringify(JSON.parse(content).data)
    .toLowerCase()
    .match(regex)
    ?.map((item) => item.replace(/(-| |_|)[0-9]{2,}$/, ''));
  db.forEach((item) => {
    if (!obj[item]) obj[item] = 1;
    else obj[item]++;
  });
  return [
    Object.keys(obj)
      .map((key) => ({ name: key, count: obj[key] }))
      .sort((a, b) => (a.count < b.count ? 1 : -1))
      .map((item) => item.name),
  ];
}
function timfshare(keyword = 'the lion king 2019') {
  keyword = keyword.replaceAll(' ', '+').toLowerCase();
  console.log(keyword);
  const content = UrlFetchApp.fetch(
    'https://timfshare.com/search?key=' + keyword
  ).getContentText();
  movies = JSON.parse(
    content.match(/<script id.*?script>/gi)?.[0]?.replaceAll(/<.*?>/gi, '')
  )?.props?.pageProps;
  movies = filterMovies(movies.data);
  console.log(movies);

  function filterMovies(arr = [], filterField = 'name', filterSort = 'size') {
    const EXTENSIONS =
      /[.](avi|mpg|mpe|mpeg|asf|wmv|mov|qt|rm|mp4|flv|m4v|webm|ogv|ogg|mkv|ts|tsv)/;
    return arr
      .filter((movie) => {
        return EXTENSIONS.test(movie[filterField]) ? true : false;
      })
      .sort((a, b) => (a[filterSort] < b[filterSort] ? 1 : -1));
  }
}

function toTitleCase(str = '') {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}
function deepUnique(arr = []) {
  const values = [...new Set(arr)];
  let result = [];
  values.forEach((item = '') => {
    item = item.replaceAll(/^[ ]{1,}|[ ]{1,}$/g, '');
    const reverse = item.split(' ')?.reverse(' ')?.join(' ');
    if (result.indexOf(item) === -1 && result.indexOf(reverse) === -1) {
      result.push(item);
    }
  });
  return result;
}
function unique(arr = []) {
  return [...new Set(arr)];
}
function toTitleCase(str = '') {
  str
    .toLocaleLowerCase()
    .replaceAll(/(^[a-z])|([^a-z0-9])[a-z]/g, (result) => result.toUpperCase());
}

function convertDate(dateString, currentTime) {
  var date;
  if (currentTime) {
    date = new Date();
  } else {
    date = new Date(dateString);
  }
  const value =
    date
      ?.toLocaleDateString('zh-Hans-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      ?.replaceAll('/', '_') || '';

  return value === 'Invalid Date' ? '' : value;
}
function matchAll(src, reg, replaceReg) {
  return (
    [
      ...new Set(
        [...src.matchAll(reg)].map((item) =>
          item?.[0]?.replaceAll(regElements, '')
        )
      ),
    ] || []
  );
}
function convertToBytes(e = '10 GB') {
  e = e.split(' ');
  if (e?.[0] && e?.[1]) {
    switch (e[1]) {
      case 'GB':
        return parseInt(parseFloat(e[0]) * 1073741824, 10);

      case 'MB':
        return parseInt(parseFloat(e[0]) * 1048576, 10);
    }
  }
  return;
}

function getAllV2({ parameter, sheetName, arrayName, id = 'id' }) {
  let result = { ...parameter };

  result['page'] = parseInt(result['page'], 10) || 0;
  result['pageSize'] = parseInt(result['pageSize'], 10) || 'all';
  result['total'] = 0;
  result[arrayName] = [];

  const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadSheet.getSheetByName(sheetName);
  const header = getSheetHeader(sheet);

  result['total'] = sheet.getLastRow() - 1;

  if (!result['keyword']) {
    const values = sheet
      .getRange(
        result.pageSize === 'all' ? 2 : result.page * result.pageSize + 2,
        1,
        result.pageSize === 'all' ? sheet.getLastRow() : result.pageSize,
        sheet.getLastColumn()
      )
      .getValues();

    result[arrayName] = arrayToJSON({
      header,
      dataList: values,
      uniqueField: id,
    });
  } else {
    const values = getSheetValues(sheet);
    const keyword = stringToSlug(result['keyword']);
    matchValues = values.filter((item) =>
      stringToSlug(item.join('')).match(keyword)
    );
    result[arrayName] = arrayToJSON({
      header,
      dataList:
        result.pageSize === 'all'
          ? matchValues
          : matchValues.slice(
              result.page * result.pageSize,
              (result.page + 1) * result.pageSize
            ),
      uniqueField: 'id',
    });
    result['noMatched'] = matchValues.length;
  }

  return serveJSON(result);
}

function stringToSlug(str) {
  var from =
      'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to =
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '');

  return str;
}

function arrayToJSON(option = {}) {
  const initial = {
    header: [],
    dataList: [],
    fieldList: [],
    splitBy: '',
    groupField: [],
    groupName: '',
    uniqueField: '',
    hidden: ['slug', ''],
  };
  const {
    header,
    dataList,
    fieldList,
    splitBy,
    groupField,
    groupName,
    uniqueField,
    hidden,
  } = { ...initial, ...option };

  const objectKeynames = header;
  let result = [];
  let nameIndexs = [];
  const uniqueFieldIndex = objectKeynames.indexOf(uniqueField);

  dataList.forEach((item) => {
    if (item === objectKeynames) return;
    if (!item[uniqueFieldIndex]) return;
    let subobj = {};
    let objGroup = {};

    objectKeynames.forEach((name, index) => {
      if (groupName && groupField.includes(name)) {
        objGroup[name] = item[index];
        subobj[groupName] = [objGroup];
      } else {
        if (fieldList.includes(name)) {
          subobj[name] = String(item[index])
            ?.split(splitBy)
            ?.filter((item) => item);
        } else {
          if (
            !groupField.includes(name) &&
            !hidden.includes(name) &&
            !name.toLowerCase().match('row')
          ) {
            subobj[name] = item[index];
          }
        }
      }
    });

    // Handle return array unique
    const index = nameIndexs.indexOf(subobj[uniqueField]);
    if (index === -1) {
      nameIndexs.push(subobj[uniqueField]);
      result.push(subobj);
    } else {
      subobj[groupName]?.[0] &&
        result[index][groupName].push(subobj[groupName][0]);
    }
  });
  return result;
}

function getSheetHeader(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()?.[0];
}

function getSheetValues(sheet) {
  return sheet
    .getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues();
}

const serveJSON = (obj = { success: true }) =>
  ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
function getJavseen() {
  if (
    new RegExp(['heyzo', 'tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    search = UrlFetchApp.fetch(
      'https://javseen.tv/search/video/?s=' + this.name
    ).getContentText();
    const $$ = Cheerio.load(search);
    const founded = $$('ul.videos .video')?.eq(0);
    const link = $$('a', founded)?.eq(0)?.attr('href');
    if (!link) return;
    content = UrlFetchApp.fetch('https://javseen.tv' + link).getContentText();
    if (!content) {
      return this;
    }
    const $ = Cheerio.load(content);
    this.cover.push($('.content-video img')?.eq(0)?.attr('src'));
    this.title.push($('.content-video h1')?.eq(0)?.text());
    this.release.push(
      $('.content-video')
        .text()
        ?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/gi)?.[0]
        ?.replaceAll('-', '_')
    );
    $('.content-video a[href*="/tags/"]').each((index, ele) => {
      this.categories.push($(ele).text());
    });
    $('.content-video a[href*="/pornstar/"]').each((index, ele) => {
      if (/[a-zA-Z]{2,}/.test($(ele).text()))
        this.actresses.push($(ele).text());
    });
    // $('.content-video a[href*="/maker/"]').each((index, ele) => {
    //   this.channels.push($(ele).text());
    // });
    // $('#waterfall a img').each((index, ele) => {
    //   this.categories.push($(ele)?.attr('src'));
    // });
    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
}
function getJavLand() {
  if (
    new RegExp(['heyzo', 'tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    content = UrlFetchApp.fetch(
      'https://jav.land/en/id_search.php?keys=' + this.name
    ).getContentText();
    if (!content) {
      return this;
    }
    const $ = Cheerio.load(content);
    this.cover.push($('.k-right img')?.eq(0)?.attr('src'));
    this.title.push($('.k-right strong')?.eq(0)?.text());
    this.release.push(
      $('tbody')
        .text()
        ?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/gi)?.[0]
        ?.replaceAll('-', '_')
    );
    $('tbody [href*="/genre/"]').each((index, ele) => {
      this.categories.push($(ele).text());
    });
    $('tbody a[href*="/star/"]').each((index, ele) => {
      if (/[a-zA-Z]{2,}/.test($(ele).text()))
        this.actresses.push($(ele).text());
    });
    $('tbody [href*="/maker/"]').each((index, ele) => {
      this.channels.push($(ele).text());
    });
    // $('#waterfall a img').each((index, ele) => {
    //   this.categories.push($(ele)?.attr('src'));
    // });
    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
}
function getJavDatabase() {
  if (
    new RegExp(['heyzo', 'tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    const url = `https://www.javdatabase.com/movies/${this.name.toLocaleLowerCase()}/`;
    const content = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
    }).getContentText();
    if (!content) {
      return this;
    }
    const $ = Cheerio.load(content);
    // this.cover.push($(".movietable")?.find("img")?.data("src"));
    this.title.push($('.tablevalue')?.eq(0)?.text());
    this.release.push(
      $('.movietable')
        .text()
        ?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/gi)?.[0]
        ?.replaceAll('-', '_')
    );
    $('.movietable [href*="avdatabase.com/genres/"]').each((index, ele) => {
      this.categories.push($(ele).text());
    });
    $('.idol-name a[href*="avdatabase.com/idols/"]').each((index, ele) => {
      if (/[a-zA-Z]{2,}/.test($(ele).text()))
        this.actresses.push($(ele).text());
    });
    $('.tablevalue [href*="avdatabase.com/studios/"]').each((index, ele) => {
      this.channels.push($(ele).text());
    });
    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
}
function getR18() {
  if (
    new RegExp(['heyzo', 'tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    const r18_id = UrlFetchApp.fetch(
      `https://www.r18.com/common/search/searchword=${this.name}/?lang=en&unit=USD`
    )
      .getContentText()
      .match(/data-content_id=".*?"/)?.[0]
      ?.replace(/data-content_id="/, '')
      ?.replace('"', '');
    if (!r18_id) return;
    data =
      JSON.parse(
        UrlFetchApp.fetch(`https://www.r18.com/api/v4f/contents/${r18_id}`)
          .getContentText()
          .replaceAll('\n', '')
      ).data || {};

    this.actresses =
      data.actresses?.length > 0
        ? data.actresses.map((actress) => actress.name)
        : [];
    this.channels =
      data.channels?.length > 0
        ? data.channels.map((channel) => channel.name)
        : [];
    this.categories = [
      ...(data.categories?.map((cate) => cate.name) || []),
      data.maker?.name || '',
    ];

    this.cover.push(data.images?.jacket_image?.large);
    this.demo.push(
      data.sample?.high || data.sample?.medium || data.sample?.low
    );
    this.title.push(data.title);
    this.release.push(
      data.release_date?.split(' ')?.[0]?.replaceAll('-', '_') || ''
    );
    this.gallery = [
      ...this.gallery,
      ...(data.gallery?.map(
        (item) => item.large || item.medium || item.small
      ) || []),
    ];
    return this;
  } catch (e) {
    console.log(e);
    return this;
  }
}
function getJavlibrary() {
  if (
    new RegExp(['heyzo', 'tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    const content = UrlFetchApp.fetch(
      `https://www.javlibrary.com/en/vl_searchbyid.php?keyword=${this.name}`
    ).getContentText();
    if (!content) return this;
    const $ = Cheerio.load(content);
    this.title.push($('h3').eq(0).text());
    cover = $('#video_jacket_img').eq(0).attr('src');
    cover && this.cover.push('https:' + cover);

    this.release.push(
      $('#video_info')
        ?.text()
        ?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)?.[0]
        ?.replaceAll('-', '_') || ''
    );

    $('#video_info .genre').each((index, ele) => {
      this.categories.push($('a', ele).text());
    });
    $('#video_info .maker').each((index, ele) => {
      this.channels.push($('a', ele).text());
    });
    $('#video_info .cast').each((index, ele) => {
      this.actresses.push($('a', ele).text()?.split(' ')?.reverse()?.join(' '));
    });

    return this;
  } catch (e) {
    console.log(e);
    return this;
  }
}
function getJavMost() {
  if (
    new RegExp(['tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    const content = UrlFetchApp.fetch(
      `https://www5.javmost.com/${this.name}/`
    ).getContentText();
    if (!content) return this;
    const $ = Cheerio.load(content);
    const detected = $('h5')?.parent()?.parent();
    if (!detected) return this;

    this.release.push(
      detected
        .text()
        ?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)?.[0]
        ?.replaceAll('-', '_')
    );

    this.cover.push($('#show_player img').eq(0).attr('src'));
    this.title.push($('h5', detected).eq(0).text());
    $('[href*="https://www5.javmost.com/category"]', detected).each(
      (index, ele) => {
        this.categories.push($(ele).text());
      }
    );
    $('[href*="https://www5.javmost.com/maker"]', detected).each(
      (index, ele) => {
        this.channels.push($(ele).text());
      }
    );
    $('[href*="https://www5.javmost.com/star"]', detected).each(
      (index, ele) => {
        this.actresses.push($(ele).text());
      }
    );
    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
}
function getJavgg() {
  if (
    new RegExp(['heyzo', 'tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    const url = `https://javgg.net/jav/${this.name.toLocaleLowerCase()}/`;
    const content = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
    }).getContentText();
    if (!content) {
      return this;
    }
    const $ = Cheerio.load(content);
    // this.cover.push($("#coverimage")?.find("img")?.data("src"));
    this.title.push($('#cover>p').text());
    this.release.push(convertDate($('.data .date').text()));
    $('.data [href*="https://javgg.net/genre/"]').each((index, ele) => {
      this.categories.push($(ele).text());
    });
    $('.data [href*="https://javgg.net/star/"]').each((index, ele) => {
      if (/[a-zA-Z]{2,}/.test($(ele).text()))
        this.actresses.push($(ele).text().split(' ').reverse().join(' '));
    });
    $('.data [href*="https://javgg.net/maker/"]').each((index, ele) => {
      this.channels.push($(ele).text());
    });
    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
}
function getHeyzo() {
  if (!this.name.toLocaleLowerCase().match('heyzo')) return this;
  try {
    const id = this.name.match(/[0-9]{2,}/)?.[0];
    if (!id) return this;
    const content = UrlFetchApp.fetch(
      `https://en.heyzo.com/moviepages/${id}/index.html`
    ).getContentText();

    if (!content) return this;
    const $ = Cheerio.load(content);
    this.title.push(
      $('h1')
        .eq(0)
        .text()
        .replaceAll(/[\n]|[\t]/g, '')
    );
    this.release.push(
      $('.movieInfo')
        .eq(0)
        .text()
        .match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)?.[0]
        ?.replaceAll('-', '_') || ''
    );
    $('.movieInfo a[href*="listpages/actor"]').each((index, ele) => {
      this.actresses.push($(ele).text());
    });
    $('.movieInfo a[href*="listpages/categ"]').each((index, ele) => {
      this.categories.push($(ele).text());
    });
    this.channels.push('Heyzo');
    cover = content.match(
      /en.heyzo.com[/]contents[/][0-9]{2,}[/][0-9]{2,}[/].*?jpg/gi
    )?.[0];
    // cover && this.cover.push("https://" + cover);
    return this;
  } catch (error) {
    console.log(error);
  }
}
function getTokyoHot() {
  if (!this.name.toLocaleLowerCase().match('tokyohot')) return this;
  const tokyohot_id = UrlFetchApp.fetch(
    `https://www.tokyo-hot.com/product/?q=${this.name
      .split('-')
      ?.pop()}&x=0&y=0`
  )
    .getContentText()
    .match(/<a href="[/]product[/]\d{3,}.*?[/]/)?.[0]
    ?.replace(/<a href="[/]product[/]/, '')
    ?.replace('/', '');
  if (!tokyohot_id) return {};

  data = UrlFetchApp.fetch(`https://www.tokyo-hot.com/product/${tokyohot_id}`)
    .getContentText()
    .replaceAll('\n', '');

  this.channels.push('Tokyohot');
  this.cover.push(
    data
      .match('<video.*?poster=".*?"')?.[0]
      ?.replace(/<video.*?poster="/, '')
      ?.replace(/"/, '')
  );
  this.categories = [
    ...this.categories,
    ...[
      ...new Set(
        data.matchAll(/<a href="[/]product[/][?]type=play&filter=.*?<[/]a>/g)
      ),
    ].map((element) => element?.[0]?.replaceAll(/<.*?>/g, '')),
  ];
  this.actresses = [
    ...this.actresses,
    ...([...new Set(data.matchAll(/<a href="[/]cast[/]\d{1,}.*?<[/]a>/g))].map(
      (element) => element?.[0]?.replaceAll(/<.*?>/g, '')
    ) || []),
  ];

  this.title.push(data.match(/<h2.*?<[/]h2>/)?.[0].replaceAll(regElements, ''));
  this.release.push(
    data.match(/\d{4}[/]\d{2}[/]\d{2}/)?.[0]?.replaceAll('/', '_')
  );

  return this;
}
function getMissav() {
  if (
    new RegExp(['tokyohot'].map((item) => `(${item})`).join('|')).test(
      this.name.toLocaleLowerCase()
    )
  )
    return this;
  try {
    const content = UrlFetchApp.fetch(
      `https://missav.com/en/${this.name}/`
    ).getContentText();
    if (!content) return this;
    const $ = Cheerio.load(content);
    // TODO

    this.cover.push($('meta[property="og:image"]')?.eq(0)?.attr('content'));
    this.title.push($('h1')?.text());
    this.description.push(
      $('div[x-show*="video_details"] > div:first-child > div:first-child')
        ?.text()
        ?.replaceAll(/[\n]{2,}/g, '')
        ?.replace('Show more', '')
    );
    this.release.push(
      $.text()
        ?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)?.[0]
        ?.replaceAll('-', '_')
    );
    $('[href*="/genres/"]').each((index, ele) => {
      this.categories.push($(ele).text());
    });
    if (this.name.toLocaleLowerCase().match('heyzo'))
      this.channels.push('Heyzo');
    else
      $('[href*="/makers/"]').each((index, ele) => {
        this.channels.push(
          $(ele)
            .text()
            ?.match(/[a-zA-Z0-9].*[a-zA-Z0-9]/)?.[0]
        );
      });
    $('[href*="/actors/"]').each((index, ele) => {
      this.actresses.push($(ele).text());
    });
    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
}
function runTest() {
  console.log(getInfor('ABW-018'));
}
function getInfor(e) {
  movie = new Movie(e);
  movie.getR18();
  movie.getJavLand();
  movie.getJavlibrary();
  movie.getJavDatabase();
  movie.getJavMost();
  movie.getMissav();
  movie.getJavgg();
  movie.getJavseen();
  movie.getHeyzo();
  movie.getTokyoHot();
  return movie.get({ insertSheet: true });
}
function Movie(name) {
  this.name = name;
  this.actresses = [];
  this.categories = [];
  this.channels = [];
  this.cover = [];
  this.description = [];
  this.gallery = [];
  this.release = [];
  this.title = [];
  this.demo = [];
}
Movie.prototype.getHeyzo = getHeyzo;
Movie.prototype.getJavDatabase = getJavDatabase;
Movie.prototype.getJavgg = getJavgg;
Movie.prototype.getJavLand = getJavLand;
Movie.prototype.getJavlibrary = getJavlibrary;
Movie.prototype.getJavMost = getJavMost;
Movie.prototype.getJavseen = getJavseen;
Movie.prototype.getMissav = getMissav;
Movie.prototype.getR18 = getR18;
Movie.prototype.getTokyoHot = getTokyoHot;

Movie.prototype.get = function get(option = {}) {
  try {
    const { isCombine = true, insertSheet = false } = option;
    if (isCombine) {
      Object.keys(this).forEach((key) => {
        if (Array.isArray(this[key])) {
          this[key] = [...new Set(this[key])];
          let temp = [];
          this[key].forEach((item) => {
            if (item) temp.push(item);
          });
          this[key] = temp;
        }
      });

      return insertSheet
        ? [
            [
              deepUnique(this.actresses).join('# '),
              unique(this.categories).join('# '),
              unique(this.channels).join('# '),
              unique(this.cover).join('# '),
              this.title?.[0],
              this.release?.[0],
              unique(this.gallery).join('# '),
              this.demo?.[0],
              unique(this.description).join('# '),
            ],
          ]
        : this;
    }

    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
};
function testActress() {
  actress = new Actress('tomomi nakama');
  actress.getJavdatabase();
  actress.getAsianscreens();
  console.log(actress.get({ insertSheet: true }));
}
function getActress(e) {
  actress = new Actress(e);
  actress.getJavdatabase();
  actress.getAsianscreens();
  return actress.get({ insertSheet: true });
}

function Actress(name) {
  this.name = name;
  this.born = [];
  this.avatar = [];
  this.cupSize = [];
  this.height = [];
}
Actress.prototype.get = function (option = {}) {
  try {
    const { isCombine = true, insertSheet = false } = option;
    if (isCombine) {
      Object.keys(this).forEach((key) => {
        if (Array.isArray(this[key])) {
          this[key] = [...new Set(this[key])];
          let temp = [];
          this[key].forEach((item) => {
            if (item) temp.push(item);
          });
          this[key] = temp;
        }
      });

      return insertSheet
        ? [
            [
              this.born.join('# '),
              this.avatar.join('# '),
              this.cupSize.join('# '),
              this.height.join('# '),
            ],
          ]
        : this;
    }

    return this;
  } catch (error) {
    console.log(error);
    return this;
  }
};
Actress.prototype.getJavdatabase = function () {
  if (!this.name) return this;
  try {
    const url = `https://www.javdatabase.com/?s=${this.name.replaceAll(
      ' ',
      '+'
    )}&wpessid=391488`;
    const content = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
    }).getContentText();
    if (!content) return '';
    const $ = Cheerio.load(content);
    const detected = $('h2')?.parent();
    object = {};
    $('.card-text figcaption', detected).each((index, item) => {
      object[$('span', item).text()] = $('a', item).text();
    });
    this.avatar.push($(detected).find('img').data('src'));
    Object.keys(object).forEach((key) => {
      switch (key) {
        case 'DOB: ':
          this.born.push(convertDate(object[key]));
          break;
        case 'Height: ':
          this.height.push(object[key]);
          break;
        case 'Cup Size: ':
          this.cupSize.push(object[key]);
          break;
        default:
          break;
      }
    });
    return this;
  } catch (error) {
    Logger.log(error);
  }
};
Actress.prototype.getAsianscreens = function () {
  if (!this.name) return this;
  try {
    const url =
      'https://www.asianscreens.com/' +
      this.name.toLocaleLowerCase().replaceAll(' ', '_') +
      '2.asp';
    const content = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
    }).getContentText();
    if (!content) return '';
    const $ = Cheerio.load(content);
    const detected = $('img[src*="product"]')?.parent()?.parent();
    object = {};
    $('table>tbody>tr', detected.eq(0)).each((index, ele) => {
      $(ele).each((i, el) => {
        // object[$('b',el).text()] = $('font',.text())
        if ($('td:nth-child(1)', el).text()) {
          object[$('td:nth-child(1)', el).text()] = $(
            'td:nth-child(2)',
            el
          ).text();
        }
      });
    });
    const avatar = $(detected).find('img').attr('src');
    avatar && this.avatar.push('https://www.asianscreens.com' + avatar);
    console.log(object);
    Object.keys(object).forEach((key) => {
      switch (key) {
        case 'DOB: ':
          this.born.push(convertDate(object[key]));
          break;
        case 'Height: ':
          this.height.push(object[key]);
          break;
        case 'Cup Size: ':
          if (object[key] !== 'n/a') this.cupSize.push(object[key]);
          break;
        default:
          break;
      }
    });
    return this;
  } catch (error) {
    Logger.log(error);
  }
};

function getActress1(e = 'Fukada Eimi') {
  e = e.split(' ').join('+');
  const content = UrlFetchApp.fetch(
    'https://jav.fandom.com/wiki/Special:Search?scope=internal&query=' +
      e +
      '&ns%5B0%5D=0'
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  const resultSearch = $('.unified-search__result__header a')
    .eq(0)
    .attr('href');
  const content1 = UrlFetchApp.fetch(resultSearch).getContentText();
  if (!content1) return '';
  const $$ = Cheerio.load(content1);
  actress = {};
  $$('#mw-content-text section div').each((index, item) => {
    element = $$('h3', item);
    name = element?.text();
    element?.remove();
    value = $$(item)
      ?.text()
      ?.replaceAll(/[\t]|[\n]/g, '');
    if (!name || !value) return;
    actress[name] = value;
  });
  return [
    [
      $$('#mw-content-text aside h2').eq(0).text(),
      $$('#mw-content-text aside img').eq(0).attr('src'),
      actress.Born.replace(/ [(].*/, ''),
    ],
  ];
}
function testFshare() {
  console.log(getFshare('IL6Q1NV5TE8O'));
  console.log(getFshare('W3C5IUHK4NLSVPP5'));
  // console.log(convertDate('',true))
}
function getFshare(id) {
  const content = UrlFetchApp.fetch(
    'https://www.fshare.vn/file/' + id
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  const title = $('title')?.text()?.replace(' - Fshare', '') || '';
  const size =
    $('#login_to_down_cus')?.text()?.split(' | ')?.[1]?.replace(/\n.*/, '') ||
    '';
  const size_bytes = convertToBytes(size);
  const type = /(leak)|(aimkv)|(uncen)|([ |.|_|-]un)|([ |.|_|-]ul)/.test(
    title.toLocaleLowerCase().replaceAll(/[^a-zA-Z0-9]/g, '')
  )
    ? 'Uncensored'
    : '';
  return [[title, size, size_bytes, type, convertDate('', true)]];
}
function getStatus(id) {
  const content = UrlFetchApp.fetch(
    'https://www.fshare.vn/file/' + id
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  const title = $('title')?.text()?.replace(' - Fshare', '') || '';
  const size =
    $('#login_to_down_cus')?.text()?.split(' | ')?.[1]?.replace(/\n.*/, '') ||
    '';
  const size_bytes = convertToBytes(size);
  const type = /(leak)|(aimkv)|(uncen)|([ |.|_|-]un)|([ |.|_|-]ul)/.test(
    title.toLocaleLowerCase().replaceAll(/[^a-zA-Z0-9]/g, '')
  )
    ? 'Uncensored'
    : '';
  return [[size ? convertDate('', true) : '']];
}
function doGet(e) {
  const { parameter } = e;
  switch (parameter.type) {
    case API_TYPES.categories.getAll:
      return getCategories(e);
    case API_TYPES.channels.getAll:
      return getChannels(e);
    case API_TYPES.movies.getAll:
      return getMovies(e);
    case API_TYPES.actresses.getAll:
      return getActresses(e);
    default:
      const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = spreadSheet.getSheetByName(SHEET_NAMES.movies);
      const header = getSheetHeader(sheet);
      fshareId = header.indexOf('file_id');
      fshareId = fshareId === -1 ? -1 : fshareId + 1;
      const fshareElement = sheet
        .getRange(2, fshareId, sheet.getLastRow(), 1)
        .getValues()
        .map((item) =>
          item?.[0]
            ? `<div><a href="https://www.fshare.vn/file/${item[0]}" target="_blank" class="fshare-id">${item[0]}</a></div>`
            : ''
        )
        .join('');
      return HtmlService.createHtmlOutput(
        `<h1>Check list support fshare links</h1>${fshareElement}`
      );
  }
}

function doPost(e) {
  const { dvd_id, actresses, categories, channels } = JSON.parse(
    e.postData.contents || '{}'
  );
  const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadSheet.getSheetByName(SHEET_NAMES.history);
  if (dvd_id || actresses || categories || channels) {
    const addRow = [
      dvd_id || '',
      actresses || '',
      categories || '',
      channels || '',
      Utilities.formatDate(new Date(), 'GMT+0700', 'yyyy_MM_dd HH_mm_ss'),
    ];
    sheet.appendRow(addRow);
    return serveJSON({ code: 200, addRow, e });
  }
  return serveJSON({ code: 400, e });
}

function addHistory(e) {
  let result = { historyId: 'SSIs-365', ...e?.parameter };
  const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
  const moviesSheet = spreadSheet.getSheetByName(SHEET_NAMES.movies);
  const sheet = spreadSheet.getSheetByName(SHEET_NAMES.history);
  const header = getSheetHeader(moviesSheet);
  const actressIndex = header.indexOf('actresses');
  const dvd_idIndex = header.indexOf('dvd_id');
  const cateIndex = header.indexOf('categories');
  const channelIndex = header.indexOf('channels');
  if (result.historyId) {
    const status = moviesSheet
      .getRange(1, 1, moviesSheet.getLastRow(), 1)
      .getValues()
      .findIndex((item) => item[0] === result.historyId.toUpperCase());
    const row = moviesSheet
      .getRange(status + 1, 1, 1, moviesSheet.getLastColumn())
      .getValues()?.[0];
    sheet.appendRow([
      row[dvd_idIndex],
      row[actressIndex],
      row[cateIndex],
      row[channelIndex],
      Utilities.formatDate(new Date(), 'GMT+0700', 'yyyy_MM_dd HH_mm_ss'),
    ]);
    return serveJSON({ code: 200 });
  }
  return serveJSON({ code: 400 });
}
function getCategories(e) {
  let result = { ...e.parameter };
  const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadSheet.getSheetByName(SHEET_NAMES.categories);
  const header = getSheetHeader(sheet);

  result['page'] = parseInt(result['page'], 10) || 0;
  result['pageSize'] = parseInt(result['pageSize'], 10) || 'all';
  result['total'] = sheet.getLastRow() - 1;
  result['types'] = [];

  const values = sheet
    .getRange(
      result.pageSize === 'all' ? 2 : result.page * result.pageSize + 2,
      1,
      result.pageSize === 'all' ? sheet.getLastRow() : result.pageSize,
      sheet.getLastColumn()
    )
    .getValues();
  result['types'] = arrayToJSON({
    header,
    dataList: values,
    uniqueField: 'type',
    groupField: ['no_files', 'name'],
    groupName: 'categories',
  });
  return serveJSON(result);
}
function getChannels(e) {
  let result = { ...e.parameter };
  const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadSheet.getSheetByName(SHEET_NAMES.channels);
  const header = getSheetHeader(sheet);

  result['page'] = parseInt(result['page'], 10) || 0;
  result['pageSize'] = parseInt(result['pageSize'], 10) || 'all';
  result['total'] = sheet.getLastRow() - 1;
  result['channels'] = [];

  const values = sheet
    .getRange(
      result.pageSize === 'all' ? 2 : result.page * result.pageSize + 2,
      1,
      result.pageSize === 'all' ? sheet.getLastRow() : result.pageSize,
      sheet.getLastColumn()
    )
    .getValues();
  result['channels'] = arrayToJSON({
    header,
    dataList: values,
    uniqueField: 'name',
  });
  return serveJSON(result);
}
function getActresses(e) {
  let result = { ...e.parameter };
  const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadSheet.getSheetByName(SHEET_NAMES.actresses);
  const header = getSheetHeader(sheet);

  result['page'] = parseInt(result['page'], 10) || 0;
  result['pageSize'] = parseInt(result['pageSize'], 10) || 'all';
  result['total'] = sheet.getLastRow() - 1;
  result['actresses'] = [];

  const values = sheet
    .getRange(
      result.pageSize === 'all' ? 2 : result.page * result.pageSize + 2,
      1,
      result.pageSize === 'all' ? sheet.getLastRow() : result.pageSize,
      sheet.getLastColumn()
    )
    .getValues();
  result['actresses'] = arrayToJSON({
    header,
    dataList: values,
    uniqueField: 'name',
  });
  return serveJSON(result);
}

function getMovies(e) {
  let result = { ...e.parameter };
  const spreadSheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadSheet.getSheetByName(SHEET_NAMES.movies);
  const header = getSheetHeader(sheet);

  result['page'] = parseInt(result['page'], 10) || 0;
  result['pageSize'] = parseInt(result['pageSize'], 10) || 'all';
  result['total'] = sheet.getLastRow() - 1;
  result['movies'] = [];

  const values = sheet
    .getRange(
      result.pageSize === 'all' ? 2 : result.page * result.pageSize + 2,
      1,
      result.pageSize === 'all' ? sheet.getLastRow() : result.pageSize,
      sheet.getLastColumn()
    )
    .getValues();

  result['movies'] = arrayToJSON({
    header,
    dataList: values,
    uniqueField: 'dvd_id',
    fieldList: ['channels', 'categories', 'actresses', 'gallery', 'cover'],
    splitBy: '# ',
    groupField: [
      'file_type',
      'file_size_bytes',
      'file_size',
      'file_name',
      'file_id',
    ],
    groupName: 'files',
    hidden: [
      'file_type',
      'file_size_bytes',
      'file_size',
      'file_name',
      'file_id',
    ],
  });

  return serveJSON(result);
}
// https://njav.tv
function crawNjJav(page) {
  if (!page) return '';
  const content = UrlFetchApp.fetch(
    'https://njav.tv/en/new-release?page=' + page
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  result = [];
  $('#page-list .detail>a').each((index, h4) => {
    result.push($(h4).text()?.replaceAll('\n', ''));
  });
  return result.join('<-●->');
}

// https://javvin.me
function crawlJavvin(page) {
  if (!page) return '';
  const content = UrlFetchApp.fetch(
    'https://javvin.me/category/censored/page-' + page
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  result = [];
  $('.videos-list a h4').each((index, h4) => {
    result.push($(h4).text()?.replaceAll('\n', ''));
  });
  console.log(result)
  return result.join('<-●->');
}

// https://hpjav.tv
function crawlHpjav(page) {
  if (!page) return '';
  const content = UrlFetchApp.fetch(
    'https://hpjav.tv/category/censored/page/' + page
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  result = [];
  $('.entry-title').each((index, link) => {
    result.push($(link).text()?.replaceAll('\n', ''));
  });
  return result.join('<-●->');
}

// https://missav.com
function crawlMissav(page) {
  if (!page) return '';
  const content = UrlFetchApp.fetch(
    'https://missav.com/en/release?page=' + page
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  result = [];
  $('a.text-secondary').each((index, link) => {
    result.push($(link).text()?.replaceAll('\n', ''));
  });
  return result.join('<-●->');
}

// https://www.r18.com
function crawlR18(page = 1) {
  if (!page) return '';
  const content = UrlFetchApp.fetch(
    'https://www.r18.com/videos/vod/movies/list/?page=' + page
  ).getContentText();
  if (!content) return '';
  const $ = Cheerio.load(content);
  result = [];
  $('.item-list img').each((index, link) => {
    result.push($(link).attr('alt')?.replaceAll('\n', ''));
  });
  console.log(result);
  return result.join('<-●->');
}
