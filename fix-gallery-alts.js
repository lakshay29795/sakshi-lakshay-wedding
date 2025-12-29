const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/gallery-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of alt: `${coupleNames} - filename', with alt: getAltText('filename'),
content = content.replace(/alt: `\$\{coupleNames\} - ([^']+)',/g, "alt: getAltText('$1'),");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed all alt texts in gallery-data.ts');


