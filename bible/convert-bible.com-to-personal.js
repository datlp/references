document.querySelectorAll('.chapter .p .verse:last-child .content:last-child').forEach(node=>node.dataset.break=true);
document.querySelectorAll('.chapter .p .verse .content').forEach(node=>node.dataset.uuid=`${node.parentNode.dataset.usfm}`);
document.querySelectorAll('.chapter .heading').forEach((node,order)=>node.dataset.uuid=`heading-${order}`);
obj = {};
document.querySelectorAll('.chapter .heading,.chapter .verse .content').forEach((node,order)=>{
    isBreak = node.dataset.break)
    if(obj[node.dataset.uuid]) {
        obj[node.dataset.uuid].content += ` ${node.innerText}`;
        obj[node.dataset.uuid].isBreak = isBreak;
    } else {
        obj[node.dataset.uuid] = {
            content:node.innerText,
            order,
            isBreak
        }
    }
})
JSON.stringify(obj)
