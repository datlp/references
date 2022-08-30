index  = 1;
function recursion () {
    books = [...new Set([...document.querySelectorAll('.book')].map(node=>[...node.classList].map(item=>'.'+item).join('')))];
    if(books.length===0) return ;
document.querySelectorAll(books[0]).forEach(bookNode=>{
     bookNode.querySelectorAll('.chapter>.label').forEach(node=>{node.innerText = `<strong class="label" data-level="chapter" id="${node.parentNode.dataset.usfm}">Chương ${node.innerText}</strong>`})
bookNode.querySelectorAll('.chapter .heading').forEach(node=>{node.innerText = `<strong class="heading" data-level="chapter">${node.innerText}</strong>`})
bookNode.querySelectorAll('.chapter .verse > .label').forEach(node=>{node.innerText = `<sup class="label" data-level="verse" id="${node.parentNode.dataset.usfm}">${node.innerText}</sup>`})
bookNode.querySelectorAll('.chapter .verse').forEach(verse=>{
    verse.querySelectorAll('.verse .content').forEach(content=>{
        content.innerText = `<span class="content" data-level="verse" data-usfm="${verse.dataset.usfm}">${content.innerText}</span>`
    })
})
});
txt = `<div class="book" id="${books[0].match(/bk.*/)?.[0]}">` +[...document.querySelectorAll(books[0])].map(node=>node.innerText).join('').replaceAll('\n','<br>') + `</div>`;
    document.querySelectorAll(books[0]).forEach(node=>node.remove())
    download(`000${index}`.slice(-3)+'-'+books[0]+'.html',txt)
    index++;
recursion()
}
recursion()
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
