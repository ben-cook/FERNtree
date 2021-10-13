export interface IAddTagData {
  clientID: string;
  tag: string;
}

export interface IDeleteTagData {
  clientID: string;
  tag: string;
}

export interface User {
  firstName: string;
  lastName: string;
  userTags: string[];
}

export interface CustomCategory {
  notes: string;
  customFields: string[];
}

export type ClientConcreteValues = {
  firstName: string;
  lastName: string;
  address: string;
  category: string;
  email: string;
  phone: string;

  notes: string;
};

export type ClientTags = {
  tags: string[];
};

// This means that it's a dictionary with string keys and string
export type ClientCustomFields = Record<string, string>;

export type Client = ClientConcreteValues & ClientTags & ClientCustomFields;
// export type Client = ClientConcreteValues & ClientTags;
