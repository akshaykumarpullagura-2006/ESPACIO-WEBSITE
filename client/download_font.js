import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import https from 'https';

const url = 'https://dl.dafont.com/dl/?f=lucy_the_cat';
const destDir = 'c:/Users/aksha/OneDrive/Desktop/finalespacio/client/public/fonts';
const outTtfPath = path.join(destDir, 'lucy_the_cat.ttf');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Downloading zip from:', url);
https.get(url, (res) => {
  if (res.statusCode === 302 || res.statusCode === 301) {
    // Follow redirect
    console.log('Redirecting to:', res.headers.location);
    https.get(res.headers.location, handleResponse);
  } else {
    handleResponse(res);
  }
}).on('error', (err) => {
  console.error('Download error:', err.message);
});

function handleResponse(res) {
  let chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log('Downloaded size:', buffer.length, 'bytes');
    let offset = 0;
    let found = false;

    while (offset < buffer.length) {
      // Look for Local File Header Signature: 0x04034b50 (PK\x03\x04)
      const sig = buffer.readUInt32LE(offset);
      if (sig !== 0x04034b50) {
        break;
      }

      const compMethod = buffer.readUInt16LE(offset + 8);
      const compSize = buffer.readUInt32LE(offset + 18);
      const uncompSize = buffer.readUInt32LE(offset + 22);
      const fileNameLen = buffer.readUInt16LE(offset + 26);
      const extraFieldLen = buffer.readUInt16LE(offset + 28);
      const fileName = buffer.toString('utf8', offset + 30, offset + 30 + fileNameLen);
      
      const dataOffset = offset + 30 + fileNameLen + extraFieldLen;
      const compressedData = buffer.slice(dataOffset, dataOffset + compSize);
      
      if (fileName.toLowerCase().endsWith('.ttf') || fileName.toLowerCase().endsWith('.otf')) {
        console.log('Found Font File:', fileName);
        let decompressed;
        if (compMethod === 0) {
          decompressed = compressedData;
        } else if (compMethod === 8) {
          decompressed = zlib.inflateRawSync(compressedData);
        } else {
          console.error('Unsupported compression method:', compMethod);
          return;
        }
        
        fs.writeFileSync(outTtfPath, decompressed);
        console.log('Successfully saved to:', outTtfPath);
        found = true;
        break;
      }
      
      offset = dataOffset + compSize;
    }

    if (!found) {
      console.error('Could not find font in ZIP file.');
    }
  });
}
