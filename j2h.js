var fs = require('fs');

String.prototype.graft = function() {
    let self = this;
    if (arguments.length == 1 && typeof arguments[0] == 'object' && !Array.isArray(arguments[0])) {
        for (let arg in arguments[0]) {
            self = self.replace(new RegExp('\\[' + arg + '\\]', 'g'), arguments[0][arg]);
        }
    } else {
        for (let i = 0; i < arguments.length; i++) {
            self = self.replace(new RegExp('\\[' + i + '\\]', 'g'), arguments[i]);
        }
    }
    return self;
};

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/file");
    process.exit(-1);
}

const SelfClosingTag = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
const NoClosingTag = ['!doctype'];

var dataFilePath = process.argv[2];

function getFileName(filePath) {
    return filePath.substring(0, filePath.lastIndexOf('.'));
}

function getFileExtension(filePath) {
    return filePath.substring(filePath.lastIndexOf('.'));
}

function isIn(item, list) {
    return (list.indexOf(item.toLowerCase()) > -1);
}

function getTagAttributes(data) {
    let o = '',
        attributes = data['@'];
    if (!!attributes) {
        let list = [];
        for (let k in attributes) {
            let attribute = attributes[k]
            if (Array.isArray(attribute)) {
                attribute = attribute.join(' ');
            }
            if (!!k) {
            	list.push('[0]="[1]"'.graft(k, attribute));
            } else {
                list.push(attribute);
            }
        }
        o = (list.length > 0) ? ' ' + list.join(' ') : '';
    }
    return o;
}

function convertJsonToHtml(data) {
   	let o = '';
    switch (typeof(data)) {
        case 'object':
            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    o += convertJsonToHtml(data[i]);
                }
            } else {
                for (let i in data) {
                    if (i == '') {
                        o += data[i];
                    } else if (i == '//') {
                        o += '<!-- [0] -->'.graft(data[i]);
                    } else if (!!i && i != '@') {
                        let beginTag = '<[0][1][2]>'.graft(i,
                            getTagAttributes(data[i]),
                            (isIn(i, SelfClosingTag)) ? '/' : ''
                        );
                        let closeTag = (isIn(i, SelfClosingTag) || isIn(i, NoClosingTag)) ? '' : '</[0]>'.graft(i);
                        o += beginTag + convertJsonToHtml(data[i]) + closeTag;
                    }
                }
            }
            break;
        case 'string':
            o += data;
            break;
    }
    return o;
}

if (getFileExtension(dataFilePath) == '.json') {
    fpJson = dataFilePath;
    fs.readFile(fpJson, 'utf8', function(err, content) {
        if (err) {
            console.log(err)
        }
        console.log('Loaded:', fpJson);
        fpHtml = getFileName(dataFilePath) + '.html';
        htmlText = convertJsonToHtml(JSON.parse(content));
        fs.writeFile(fpHtml, htmlText, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('Generated:', fpHtml);
        });
    });
    console.log('Done!');
} else {
    console.log('Error: Invalid file format');
}