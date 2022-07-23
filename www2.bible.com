function download(filename, text) {

    if(!filename) return;
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}
async function recursion (url,count=0 ){
    if(!url) return;
    await fetch(url).then(res=>res.json()).then((result) =>{
        const {reference,next,...rest} = result ;
        index = `000000${count}`.slice(-7);
        count++;
        download(`${reference.version_id}.${index}.${reference.usfm.join(' ').replaceAll(/[.][\d]{1,}/g, found => {
    return found.replace(/[\d]{1,}/,"0000$&").replace(/[\d]{1,}/,found1=>found1.slice(-3))
})}.json`,JSON.stringify(result))
        recursion(`https://nodejs.bible.com/api/bible/chapter/3.1?id=${next.version_id}&reference=${next.usfm?.[0]}`,count)
    })
} 

await recursion('https://nodejs.bible.com/api/bible/chapter/3.1?id=8&reference=GEN.1',0)
