document.querySelectorAll('.verse>.label,.note').forEach(item=>item.remove())
document.querySelectorAll('.chapter').forEach(chapter=>{
    [...chapter.children].forEach(child=>{
        if(child.querySelectorAll('.verse').length===0) child.remove()
    })
})
document.querySelectorAll('.chapter').forEach(chapter=>{
    chapter.dataset.chapter = chapter.dataset.usfm.replace(/[.].*/,'')
    
})
vid = document.querySelector('.version').dataset.vid
let result = {vid,books:[]};
    [...new Set([...document.querySelectorAll('.chapter')].map(chapter=>chapter.dataset.chapter))].map((chapterName,status) => {
        obj = {status};
        obj['id']=chapterName;
        obj["content"]=[...document.querySelectorAll(`.chapter[data-chapter="${chapterName}"]`)].map(item=>item.innerText).join('\n')
        result.books.push(obj)
    })
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', new Date().getTime() + ' ' + filename + '.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
download(vid+'.json',JSON.stringify(result))
