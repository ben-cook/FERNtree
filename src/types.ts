export interface User {
  firstName: string;
  lastName: string;
  customCategories: { [categoryName: string]: string[] };
}
export interface Client {
  firstName: string;
  lastName: string;
}
