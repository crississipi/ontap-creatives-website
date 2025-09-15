export interface ProductProps {
    setInquireItem: (inquire: boolean) => void;
    inquire: boolean;
}

export interface ProductCardProps {
    imgUrl: string;
    productName: string;
    productDesc: string;
    size: string;
    hoverable: boolean;
    setClickedItem?: (clickedItem: { imgUrl: string; name: string; desc: string }) => void;
}

export interface ObserverProps { isInView: boolean; }