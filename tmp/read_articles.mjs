import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const source = '/Users/anikakapasi/Downloads/Freelancing_Internship - Bay Area.xlsx';
const input = await FileBlob.load(source);
const workbook = await SpreadsheetFile.importXlsx(input);
const overview = await workbook.inspect({
  kind: 'workbook,sheet,table',
  maxChars: 18000,
  tableMaxRows: 100,
  tableMaxCols: 20,
  tableMaxCellChars: 240,
});
console.log(overview.ndjson);
const region = await workbook.inspect({
  kind: 'region',
  sheetId: 'ws/fwqq0t',
  range: 'A1:G27',
  include: 'values,formulas',
  maxChars: 24000,
});
console.log(region.ndjson);
