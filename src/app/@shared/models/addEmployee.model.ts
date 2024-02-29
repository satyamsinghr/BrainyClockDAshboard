export interface addEmployeeItemDto {
  company_id: string,
  firstName: string,
  lastName: string,
  email:string,
  password:string
  shifts:any,
  department_id: string,
  location_id: string,
}

export class addBulkEmployeeDto {
  collection: any[] = [];
  constructor(item: any[]) {
    item.forEach((ele: any) => {
      let a: addEmployeeItemDto = {
        company_id: ele[0],
        firstName: ele[1],
        lastName: ele[2],
        email: ele[3],
        password: ele[4],
        shifts: ele[5],
        department_id:ele[6],
        location_id:ele[7]
      };
      if (a.company_id !== undefined) this.collection.push(a);
    });
  }
}
export interface APIResponse {
  data: Array<any>;
  isError: Boolean;
  message: string;
}
