export interface User {
  firstName: string;
  lastName: string;
  customCategories: { [categoryName: string]: string[] };
  userTags: string[];
}
export interface Client {
  firstName: string;
  lastName: string;
  business: string;
  address: string;
  email: string;
  phone: string;
  payRate: string;
  jobStatus: string;
  notes: string;
  tags: string[];
}
