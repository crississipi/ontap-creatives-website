import { JSX } from "react";

export interface ReceiptItem {
  imgUrl: string;
  frontImg: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
  logo: string;
}

export interface ReceiptData {
  orderID: string;
  customerName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  deliveryAddress: string;
  items: {
    imgUrl: string;
    frontImg: string;
    name: string;
    qty: number;
    price: number;
    subtotal: number;
    logo: string;
  }[];
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  discount: number;
  subtotal: number;
  total: number;
  orderDate: string;
}

export type PaymentInfo = {
  title: string;
  image: JSX.Element;
  label: string;
  digit: number;
};