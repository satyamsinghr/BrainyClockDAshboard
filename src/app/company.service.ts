
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  getAllCompany: () => void;
  constructor() { }
}
