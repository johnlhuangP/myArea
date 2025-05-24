import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    Location,
    LocationsResponse,
    CreateLocationRequest,
    User,
    UserLocationsResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        // Initialize token from localStorage if available
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Add any additional headers from options
        if (options.headers) {
            const optionsHeaders = options.headers as Record<string, string>;
            Object.assign(headers, optionsHeaders);
        }

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        }
    }

    getToken(): string | null {
        return this.token;
    }

    // Auth endpoints
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        this.setToken(response.token);
        return response;
    }

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        this.setToken(response.token);
        return response;
    }

    async getProfile(): Promise<User> {
        return this.request<User>('/auth/me');
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        return this.request<User>('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    logout() {
        this.setToken(null);
    }

    // Location endpoints
    async getLocations(city?: string, category?: string): Promise<LocationsResponse> {
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (category) params.append('category', category);

        const query = params.toString();
        const endpoint = `/locations${query ? `?${query}` : ''}`;

        return this.request<LocationsResponse>(endpoint);
    }

    async getLocation(id: string): Promise<Location> {
        return this.request<Location>(`/locations/${id}`);
    }

    async createLocation(data: CreateLocationRequest): Promise<Location> {
        return this.request<Location>('/locations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateLocation(id: string, data: Partial<CreateLocationRequest>): Promise<Location> {
        return this.request<Location>(`/locations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteLocation(id: string): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/locations/${id}`, {
            method: 'DELETE',
        });
    }

    async getUserLocations(username: string): Promise<UserLocationsResponse> {
        return this.request<UserLocationsResponse>(`/users/${username}/locations`);
    }
}

export const apiClient = new ApiClient(API_BASE_URL); 