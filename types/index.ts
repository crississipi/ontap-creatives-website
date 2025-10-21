export interface HeaderProps {
    setPage: (page: number) => void;
};

export interface Product {
  productID: number;
  name: string;
  price: number;
  customPrice?: number | null;
  description: string;
  frontUrl?: string | null;
  backUrl?: string | null;
  imgUrl?: string | null;
  variableFrontImg?: string | null;
  variableBackImg?: string | null;
  category?: string;
  dateAdded: Date;
}

// Keep your existing interfaces for backward compatibility
export interface ProductProps extends Product {
  // This extends the Product interface for component props
}

export interface ProductCardProps {
  product?: Product;
  imgUrl?: string;
  productName?: string;
  productDesc?: React.ReactNode;
  size?: string;
  setInquireItem?: (inquire: boolean) => void;
  hoverable?: boolean;
  setClickedItem?: (item: any) => void;
  frontImg?: string;
  backImg?: string;
  price?: { ontap: number; custom?: number };
  variableBackImg?: string;
  variableFrontImg?: string;
  inquire?: boolean;
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