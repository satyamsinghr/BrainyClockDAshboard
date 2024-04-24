import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  getDepartmentById: () => void;
  constructor() { }
}
