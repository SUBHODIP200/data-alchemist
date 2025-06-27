import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { mapHeadersWithGemini } from './gemini';

async function mapHeaders(rows: any[], entityType: 'clients' | 'workers' | 'tasks') {
  const rawHeaders = Object.keys(rows[0] || {});
  const mapping = await mapHeadersWithGemini(rawHeaders, entityType);

  return rows.map((row) => {
    const newRow: any = {};
    for (const key in row) {
      const newKey = mapping[key] || key;
      newRow[newKey] = row[key];
    }
    return newRow;
  });
}

export async function parseCSVFile(file: File, entityType: 'clients' | 'workers' | 'tasks'): Promise<any[]> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: async (result) => {
        const mapped = await mapHeaders(result.data as any[], entityType);
        resolve(mapped);
      },
    });
  });
}

export async function parseExcelFile(file: File, entityType: 'clients' | 'workers' | 'tasks'): Promise<any[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      const mapped = await mapHeaders(json as any[], entityType);
      resolve(mapped);
    };
    reader.readAsArrayBuffer(file);
  });
}
