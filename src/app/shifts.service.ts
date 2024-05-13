import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  getAllShift: () => void;
  constructor() { }
}
