REG_MOVIE_EXTENSIONS =
    /[.](avi|mpg|mpe|mpeg|asf|wmv|mov|qt|rm|mp4|flv|m4v|webm|ogv|ogg|mkv|ts|tsv)\t/;
CODES = `stars`;

function genCode(code = 'star') {
    text = Array(10).fill(code).map((code, index) => `${code}-${index} ${code}_${index} ${code}${index} ${code}00${index}`).join(' ') + ` ${code}0000 ${code}`;
    return (text || '').split(' ');
};

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', new Date().getTime() + ' ' + filename + '.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

CODES = CODES.split('\n').filter((code) => code);
async function recursion(index = 0) {
    if (!CODES[index]) return;
    arr = [];
    values = await Promise.all(
        genCode(CODES[index]).map((item) =>
            fetch('https://api.timfshare.com/v1/string-query-search?query=' + item, {
                headers: {
                    accept: '*/*',
                    'accept-language': 'en-US,en;q=0.9',
                    authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiZnNoYXJlIiwidXVpZCI6IjcxZjU1NjFkMTUiLCJ0eXBlIjoicGFydG5lciIsImV4cGlyZXMiOjAsImV4cGlyZSI6MH0.WBWRKbFf7nJ7gDn1rOgENh1_doPc07MNsKwiKCJg40U',
                    'content-type': 'application/json',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                },
                referrer: 'https://timfshare.com/',
                referrerPolicy: 'strict-origin-when-cross-origin',
                body: null,
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((res) =>
                res.data.map(({
                    id,
                    name
                }, index) => {
                    arr = [...new Set([...arr, `${name}\t${id}\t\n`])];
                })
            )
        )
    );
    str = '';
    arr.forEach((item) => {
        try {
            const text = item.toLowerCase();
            if (REG_MOVIE_EXTENSIONS.test(text)) {
                codeExtracted = text.split('\t')[0]
                    .match(new RegExp(`${CODES[index].toLowerCase()}(-| |_|)[0-9]{2,}`, 'gi'));
                    
                    
                if (Array.isArray(codeExtracted)) { 
                 extracted = codeExtracted.join('\t')
                .replaceAll(new RegExp(CODES[index].toLowerCase() + '(-| |_|)','gi'),CODES[index].toUpperCase()+'-')
              
                str = `${str}${item.replace(/\n/,'')}${extracted}\n`
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
    download(CODES[index], str);
    await recursion(index + 1);
}

(async () => console.log(await recursion(0)))();
