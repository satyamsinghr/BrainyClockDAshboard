import { Injectable } from '@angular/core';
import { WorkBook, WorkSheet, AOA2SheetOpts, read, BookType, writeFile, utils } from 'xlsx';
import { EXPORT_EXCEL_DATA } from '../constants/excel.constants';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  public importFromFile(bstr: string): AOA2SheetOpts {
    /* read workbook */
    const wb: WorkBook = read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    /* save data */
    const data = <AOA2SheetOpts>utils.sheet_to_json(ws, { header: 1 });
    return data;
  }

  public exportToFile(type: string) {
    let ws = utils.json_to_sheet(EXPORT_EXCEL_DATA);
    const workbook: WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    let writeType: BookType = 'xlsx';
    if (type === 'csv') writeType = 'csv';
    writeFile(workbook, `Admin_Sample_${new Date(Date.now()).toLocaleString().split(',')[0]}.${writeType}`, {
      bookType: writeType,
    });
  }

  public exportDataToExcelFile(type: string, name: string, data: any) {
    let ws = utils.json_to_sheet(data);
    delete ws[0];
    const workbook: WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    let writeType: BookType = 'xlsx';
    if (type === 'csv') writeType = 'csv';
    writeFile(workbook, `${name}_${new Date(Date.now()).toLocaleString().split(',')[0]}.${writeType}`, {
      bookType: writeType,
    });
  }

  public exportToFileForcontact(type: string, Contactdata: any) {
    let ws = utils.json_to_sheet(Contactdata);
    const workbook: WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    let writeType: BookType = 'xlsx';
    if (type === 'csv') writeType = 'csv';
    writeFile(workbook, `Admin_Sample_${new Date(Date.now()).toLocaleString().split(',')[0]}.${writeType}`, {
      bookType: writeType,
    });
  }
  public exportToFileForClient(type: string, Clientdata: any) {
    let ws = utils.json_to_sheet(Clientdata);
    const workbook: WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    let writeType: BookType = 'xlsx';
    if (type === 'csv') writeType = 'csv';
    writeFile(workbook, `ClientDetails_${new Date(Date.now()).toLocaleString().split(',')[0]}.${writeType}`, {
      bookType: writeType,
    });
  }
}
