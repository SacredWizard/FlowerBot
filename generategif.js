const r2 = require("r2");
const SvgGif = require('./SvgGif');

const width = 3000;
const height = 3000;


const gifconverter = async (svgImageString, fileName) => {
    
    const gif = new SvgGif({
        width,
        height,
        fileName
    });
    
    console.log(`Generating...`);
    
    
    await gif.addFrame(svgImageString, 42);
    await gif.addFrame(svgImageString, 84);
    await gif.addFrame(svgImageString, 126);
    // await gif.addFrame(svgImageString, 168);
    // await gif.addFrame(svgImageString, 210);
    // await gif.addFrame(svgImageString, 252);
    // await gif.addFrame(svgImageString, 336);
    // await gif.addFrame(svgImageString, 378);
    // await gif.addFrame(svgImageString, 420);
    // await gif.addFrame(svgImageString, 462);
    // await gif.addFrame(svgImageString, 420);
    // await gif.addFrame(svgImageString, 504);
    // await gif.addFrame(svgImageString, 546);
    // await gif.addFrame(svgImageString, 630);
    // await gif.addFrame(svgImageString, 672);
    // await gif.addFrame(svgImageString, 714);
    // await gif.addFrame(svgImageString, 756);
    // await gif.addFrame(svgImageString, 798);
    // await gif.addFrame(svgImageString, 840);
    // await gif.addFrame(svgImageString, 882);
    // await gif.addFrame(svgImageString, 924);
    // await gif.addFrame(svgImageString, 966);
    // await gif.addFrame(svgImageString, 1008);
    
    gif.finish();
    console.log(`Done, generating ${fileName}`);
}


const getData = async url => {
    try {
        return r2(url).json;
    } catch (error) {
        console.log(error);
    }
};

(async function () {
    
    
    for (i=1; i<4097; i++) {
        const uri = `https://api.opensea.io/asset/0x5A876ffc6E75066f5ca870e20FCa4754C1EfE91F/${i}/validate/`;
        result = await getData(uri);
        base64String = result.token_uri.replace('data:application/json;base64,','');
        let buff = new Buffer.from(base64String, 'base64');
        svgImageData = JSON.parse(buff.toString());
        svgImage = new Buffer.from(svgImageData.image.replace('data:image/svg+xml;base64,',''), 'base64');
        try {
            await gifconverter(svgImage.toString(), `generatedassets/asset${i}.gif`);
        }
        catch(e) {
            console.error(e);
        }
        
    }
    
})();





