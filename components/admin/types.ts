export interface StatusColumn {
    id: string;
    label: string;
    description?: string;
}

export interface OrderRecord {
    id: string;
    dbOrderId?: number;
    reference: string;
    clientName: string;
    total: number;
    currency?: string;
    thumbnail: string;
    placedAt: string;
    statusId: string;
    archived?: boolean;
}

