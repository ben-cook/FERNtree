export interface User {
  firstName: string;
  lastName: string;
  customCategories: { categoryName: CustomCategory }[];
}

export interface CustomCategory {
  notes: string;
  customFields: string[];
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
}
