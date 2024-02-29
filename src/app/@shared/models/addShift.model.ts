export interface addShiftItemDto {
  companyId: string,
  department_id: string,
  created_by: number,
  name: string,
  days:Array<string>,
  clockInTime:any,
  clockOutTime:any
}
