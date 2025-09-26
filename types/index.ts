import { JSX } from "react";

export interface HeaderProps {
    setPage: (page: number) => void;
};

export interface ProductProps {
    setInquireItem: (inquire: boolean) => void;
    inquire: boolean;
}

export interface ProductCardProps {
    imgUrl: string;
    productName: string;
    productDesc: JSX.Element;
    size: string;
    hoverable: boolean;
    setClickedItem?: (clickedItem: { imgUrl?: string; front?: string; back?: string; varFront?: string; varBack?: string; name: string; desc: JSX.Element, price: {ontap: number; custom?: number; }, ratings: number, sold: number }) => void;
    frontImg: string;
    backImg: string;
    tags: string[];
    price: {
      ontap: number;
      custom?: number;
    },
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