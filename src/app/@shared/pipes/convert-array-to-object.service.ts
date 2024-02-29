import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertArrayToObjectService {

  constructor() { }
  public convertToArrayOfObjects(data: any) {
    var keys = data.shift(),
      i = 0, k = 0,
      obj = null,
      output = [];

    for (i = 0; i < data.length; i++) {
      obj = {} as any;

      for (k = 0; k < keys.length; k++) {
        obj[keys[k]] = data[i][k];
      }
      output.push(obj);
    }
    return output;
  }
}
