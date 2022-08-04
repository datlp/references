vid = document.querySelector('.version').dataset.vid
hashBible = {"37":"CEB","42":"CPDV","55":"DRC1752","431":"GNBDK","1":"KJV","8":"AMPC","12":"ASV","19":"BD2011","59":"ESV","68":"GNT","193":"VIE1925","3034":"BSB","3345":"LSB","69":"GNTD","416":"GNBDC","1204":"WEBBE","1922":"RV1895","2015":"NRSVCI","2017":"RSVCI","2407":"WBMS","206":"engWEBUS","303":"CEVDCI","546":"KJVAAE","463":"NABRE","70":"GW","72":"HCSB","90":"LEB","97":"MSG","100":"NASB1995","105":"NCV","107":"NET","110":"NIrV","111":"NIV11","113":"NIVUK11","114":"NKJV","116":"NLT","130":"TOJB2011","151":"VIE2010","205":"BPT","294":"CEVUK","296":"GNBUK","314":"TLV","316":"TS2009","392":"CEV","406":"ERV","449":"NVB","477":"RV1885","478":"DARBY","547":"KJVAE","821":"YLT98","1077":"JUB","1171":"MEV","1207":"WMBBE","1209":"WMB","1275":"CJB","1359":"ICB","1588":"AMP","1638":"VCB","1713":"CSB","1932":"FBV","2016":"NRSV","2020":"RSV","2079":"EASY","2135":"NMV","2163":"enggnv","2692":"NASB2020","1849":"TPT","2753":"RAD","31":"BOOKS","3051":"MP1781","2530":"PEV","1047":"GWC","1365":"MP1650","3010":"TEG"}
version = hashBible[vid]
document.querySelectorAll('.note').forEach(item=>item.remove());
document.querySelectorAll('.chapter').forEach(chapter=>{
    [...chapter.children].forEach(child=>{
        if(child.querySelectorAll('.verse').length===0) child.remove()
    })
});
document.querySelectorAll('.verse').forEach(verse=>{
    const usfm = verse.dataset.usfm
    verse.querySelectorAll('.label').forEach((label,index) =>{
        label.innerText = `<sup id="${usfm}">${label.innerText}</sup>`
    })
    verse.querySelectorAll('.content').forEach((content,index) =>{
        if(content.innerText) content.innerText = `<span data-verse="${usfm}">${content.innerText}</span>`
    })
})
