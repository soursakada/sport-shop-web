// @/app/utils/type.ts

export interface ProductImage {
    id: number;
    documentId: string;
    name: string;
    url: string;
}

export interface ProductVariant {
    id: number;
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
}

export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: {
        url: string;
    };
    tags?: Tag[]; // optional if nested
}

export interface Tag {
    id: number;
    documentId: string;
    name: string;
    slug: string;
}

export interface Product {
    id: number;
    documentId: string;
    title: string;           // This is the correct field!
    slug: string;
    subtitle?: string;
    description?: string;
    price: number;
    original_price?: number;
    currency?: string;
    allow_customization?: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;

    // Relations
    category?: Category | null;
    tags?: Tag[];
    variants?: ProductVariant[];
    images?: ProductImage[];
    customization_template?: any;
}