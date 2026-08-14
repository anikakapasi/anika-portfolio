import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const source = '/Users/anikakapasi/Downloads/Freelancing_Internship - Bay Area.xlsx';
const input = await FileBlob.load(source);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);
const values = sheet.getRange('A1:G27').values;

const xml = execFileSync('unzip', ['-p', source, 'xl/worksheets/sheet1.xml'], { encoding: 'utf8' });
const rels = execFileSync('unzip', ['-p', source, 'xl/worksheets/_rels/sheet1.xml.rels'], { encoding: 'utf8' });
const relTargets = Object.fromEntries([...rels.matchAll(/Id="([^"]+)"[^>]+Target="([^"]+)"/g)].map((m) => [m[1], m[2].replaceAll('&amp;', '&')]));
const links = Object.fromEntries([...xml.matchAll(/<hyperlink ref="(A\d+)" r:id="([^"]+)"/g)].map((m) => [m[1], relTargets[m[2]]]));

const publications = new Set(['The Daily Free Press', 'The Los Gatan', 'Los Altos Town Crier', 'Outlook']);
const articles = [];
let publication = '';
for (let row = 2; row <= 27; row += 1) {
  const cells = values[row - 1];
  const title = String(cells[0] ?? '').trim();
  if (!title) continue;
  if (publications.has(title)) {
    publication = title === 'The Los Gatan' ? 'Los Gatan' : title;
    continue;
  }
  articles.push({
    id: `article-${row}`,
    title,
    date: String(cells[1] ?? '').trim(),
    publication,
    url: links[`A${row}`] ?? '',
    storyType: String(cells[2] ?? '').trim(),
    beats: [cells[3], cells[4]].map((v) => String(v ?? '').trim()).filter(Boolean),
    favorite: String(cells[5] ?? '').trim().toLowerCase() === 'favorites',
  });
}

await fs.mkdir('data', { recursive: true });
await fs.writeFile('data/articles.js', `window.ARTICLES = ${JSON.stringify(articles, null, 2)};\n`);
console.log(JSON.stringify({ articles: articles.length, linked: articles.filter((a) => a.url).length, publications: [...new Set(articles.map((a) => a.publication))] }, null, 2));
