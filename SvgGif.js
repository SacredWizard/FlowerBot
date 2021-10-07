const fs = require('fs');
const GifEncoder = require('gif-encoder');
const { convert } = require('convert-svg-to-png');
const Png = require('png-js');

function decode(data) {
    return new Promise((resolve) => {
        new Png(data).decode((pixels) => {
            resolve(pixels);
        });
    });
}

class SvgGif {
    constructor({ width, height, fileName = 'img.gif', repeat = 0 }) {
        // Create GIF
        this.gif = new GifEncoder(width, height);
        this.gif.setRepeat(0);
        this.gif.on('error', (err) => console.log(err));

        // Collect output
        const file = fs.createWriteStream(fileName);
        this.gif.pipe(file);
        this.gif.writeHeader();
    }

    async addFrame(svg, delay = 1000) {
        this.gif.setDelay(delay);
        const data = await convert(svg, {width: 3000, height: 3000});
        const pixels = await decode(data);
        this.gif.addFrame(pixels);
    }

    finish() {
        this.gif.finish();
    }
}

module.exports = SvgGif;