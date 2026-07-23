import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/tumur/OneDrive/Desktop/espacio';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === '.gemini') return;
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (stat.mtime > new Date(Date.now() - 20 * 60 * 1000)) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(dir);
files.forEach(f => {
  const stat = fs.statSync(f);
  console.log(`${path.relative(dir, f)} - ${stat.size} bytes - ${stat.mtime}`);
});
