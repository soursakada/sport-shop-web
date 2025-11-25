// types.ts

export interface Tag {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
}

export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    subtitle?: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
    tags?: Tag[];
    products?: Product[];
    image?: {
        id: number;
        documentId: string;
        name: string;
        url: string;
    }
}

export interface Variant {
    id: number;
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
}

export interface CustomizationTemplate {
    id: number;
    previewConfig: any | null;
    fields?: CustomField[];
}

export interface CustomField {
    key: string;
    label: string;
    type: "text" | "number" | "select" | "boolean";
    required?: boolean;
    maxLength?: number;
    options?: any;
}

export interface Product {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    stock: number;
    description: string | null;
    subtitle?: string | null;
    price: number;
    currency: string;
    allow_customization: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
    category?: Category;
    tags?: Tag[];
    variants?: Variant[];
    customization_template?: CustomizationTemplate;
    images?: {
        id: number;
        documentId: string;
        name: string;
        url: string;
    }[];
}
