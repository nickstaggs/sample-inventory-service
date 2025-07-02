export interface Product extends WithId, WithAuditFields {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory extends WithId, WithAuditFields {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface WithId {
  id: string;
}

export interface WithAuditFields {
  createdAt: string;
  updatedAt: string;
}
