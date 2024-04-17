import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  getAllEmployee: () => void;

  constructor() { }
}
