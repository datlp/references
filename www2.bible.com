async function recursion (url,count=0 ){
    if(!url) return;
    await fetch(url).then(res=>res.json()).then((result) =>{
        const {reference,next,content,...rest} = result ;
        index = `000000${count}`.slice(-7);
        count++;
        title = `${reference.version_id}.${index}.${reference.usfm.join(' ').replaceAll(/[.][\d]{1,}/g, found => {
    return found.replace(/[\d]{1,}/,"0000$&").replace(/[\d]{1,}/,found1=>found1.slice(-3))
})}`;
        delete(result.content);
        download(title+'.json',JSON.stringify(result)+',\n');
        download(title+'.html',content+'\n');
        recursion(`https://nodejs.bible.com/api/bible/chapter/3.1?id=${next.version_id}&reference=${next.usfm?.[0]}`,count)
    })
} 

await recursion('https://nodejs.bible.com/api/bible/chapter/3.1?id=193&reference=GEN.1',0)
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

chapter = document.querySelector('.chapter')
    chapter.outerHTML=`<span>≤→${chapter.dataset.usfm}←</span>${chapter.outerHTML}<span>≥</span>`
document.querySelectorAll('.verse').forEach(verse=>{
    const label = verse.querySelector('.label')?.innerText||'';
    label && verse.querySelector('.label')?.remove();
    verse.querySelectorAll('.content').forEach(content=>{
    content.innerText = `«┌${label}┘→${verse.dataset.usfm}←${content.innerText}»`
    })
})
text = document.querySelector('.chapter').innerText.replaceAll('\n','«<br/>»').replaceAll('\t','')
text.match(/«.*?»/gi)
