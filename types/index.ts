import { JSX } from "react";

export interface HeaderProps {
    setPage: (page: number) => void;
};

export interface ProductProps {
  productID: number;
  price: any;
  customPrice: any;
  tags: any;
  backUrl: any;
  variableBackImg: any;
  variableFrontImg: any;
  category: string;
  frontUrl: any;
  description: any;
  name: any;
  imgUrl: any;
  setInquireItem: (inquire: boolean) => void;
  inquire: boolean;
}

export interface ProductCardProps {
  productID: number;
  imgUrl: string;
  productName: string;
  productDesc: JSX.Element;
  size: string;
  hoverable: boolean;
  setClickedItem?: (productID: number) => void; // Now only passing ID
  frontImg: string;
  backImg: string;
  tags: string[];
  price: {
    price: number;
    customPrice?: number;
  };
  ratings: number;
  sold: number;
  variableBackImg?: string;
  variableFrontImg?: string;
}

export interface ObserverProps { isInView: boolean; }

export interface Country {
  icon: string;
  country: string;
  code: string;
  regex: RegExp;
  format: (value: string) => string;
  placeholder: string;
  maxDigits: number;
}

export interface AdminPageProps {
  showAdminLogin: (admin: boolean) => void;
}

export interface EditProps {
  editable: boolean;
}