export interface User {
    id: string;
    email: string;
    username: string;
    display_name: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    category: LocationCategory;
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    rating?: number;
    price_level?: number;
    tags: string[];
    image_url?: string;
    website_url?: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Guide {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    city: string;
    is_public: boolean;
    location_ids: string[];
    created_at: string;
    updated_at: string;
    user?: User;
}

export enum LocationCategory {
    RESTAURANT = 'restaurant',
    CAFE = 'cafe',
    BAR = 'bar',
    SHOPPING = 'shopping',
    PARK = 'park',
    HIKE = 'hike',
    MUSEUM = 'museum',
    ENTERTAINMENT = 'entertainment',
    BEACH = 'beach',
    VIEWPOINT = 'viewpoint',
    OTHER = 'other'
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    display_name: string;
    password: string;
}

export interface CreateLocationRequest {
    name: string;
    description?: string;
    category: LocationCategory;
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    rating?: number;
    price_level?: number;
    tags: string[];
    image_url?: string;
    website_url?: string;
}

export interface LocationsResponse {
    locations: Location[];
    count: number;
}

export interface UserLocationsResponse {
    user: User;
    locations: Location[];
    count: number;
} 