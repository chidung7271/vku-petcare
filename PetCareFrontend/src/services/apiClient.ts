/**
 * PetCare Backend REST API Client
 * Production-ready HTTP client connected to NestJS Backend (/api/v1)
 * Supports JWT auth token persistence, auto-refresh, and unified responses.
 */

const API_BASE_URL = ((import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) || 'http://localhost:3000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string = API_BASE_URL;

  private getAccessToken(): string | null {
    return localStorage.getItem('petcare_access_token');
  }

  private setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem('petcare_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('petcare_refresh_token', refreshToken);
    }
  }

  private clearTokens() {
    localStorage.removeItem('petcare_access_token');
    localStorage.removeItem('petcare_refresh_token');
    localStorage.removeItem('petcare_user');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = this.getAccessToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - Attempt Token Refresh
      if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry request once with new token
          headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
          const retryResponse = await fetch(url, { ...options, headers });
          return retryResponse.json();
        } else {
          this.clearTokens();
        }
      }

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || `Lỗi yêu cầu (${response.status})`);
      }
      return json;
    } catch (error: any) {
      console.warn(`[PetCare API] Error on ${endpoint}:`, error.message);
      throw error;
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('petcare_refresh_token');
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.accessToken) {
          this.setTokens(data.data.accessToken, data.data.refreshToken);
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to refresh token:', e);
    }
    return false;
  }

  // --- HEALTH CHECK ---
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl.replace('/api/v1', '')}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- AUTH ---
  async login(email: string, password: string) {
    const res = await this.request<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
    );
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    localStorage.setItem('petcare_user', JSON.stringify(res.data.user));
    return res.data;
  }

  async register(name: string, email: string, password: string, phone?: string) {
    const res = await this.request<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      },
    );
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    localStorage.setItem('petcare_user', JSON.stringify(res.data.user));
    return res.data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // --- PETS ---
  async getPets() {
    return this.request<any[]>('/pets');
  }

  async getPet(id: string) {
    return this.request<any>(`/pets/${id}`);
  }

  async createPet(petData: any) {
    return this.request<any>('/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  async updatePet(id: string, petData: any) {
    return this.request<any>(`/pets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(petData),
    });
  }

  async deletePet(id: string) {
    return this.request<any>(`/pets/${id}`, { method: 'DELETE' });
  }

  async exportPetHealthProfile(id: string) {
    return this.request<any>(`/pets/${id}/export`);
  }

  // --- GROWTH & WEIGHT ---
  async getWeightRecords(petId: string) {
    return this.request<any[]>(`/growth/weights?petId=${petId}`);
  }

  async addWeightRecord(data: { petId: string; weight: number; recordedAt?: string; notes?: string }) {
    return this.request<any>('/growth/weights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGrowthPhotos(petId: string) {
    return this.request<any[]>(`/growth/photos?petId=${petId}`);
  }

  async addGrowthPhoto(data: { petId: string; photoUrl: string; caption?: string; date?: string; tag?: string }) {
    return this.request<any>('/growth/photos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- HEALTH RECORDS ---
  async getHealthRecords(petId?: string, type?: string) {
    const params = new URLSearchParams();
    if (petId) params.append('petId', petId);
    if (type) params.append('type', type);
    return this.request<any[]>(`/health-records?${params.toString()}`);
  }

  async createHealthRecord(data: any) {
    return this.request<any>('/health-records', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- VACCINATIONS ---
  async getVaccinations(petId?: string) {
    const query = petId ? `?petId=${petId}` : '';
    return this.request<any[]>(`/vaccinations${query}`);
  }

  async getUpcomingVaccinations(days = 30) {
    return this.request<any[]>(`/vaccinations/upcoming?days=${days}`);
  }

  async createVaccination(data: any) {
    return this.request<any>('/vaccinations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- MEDICATIONS ---
  async getMedications(petId?: string, activeOnly = false) {
    const params = new URLSearchParams();
    if (petId) params.append('petId', petId);
    if (activeOnly) params.append('activeOnly', 'true');
    return this.request<any[]>(`/medications?${params.toString()}`);
  }

  async createMedication(data: any) {
    return this.request<any>('/medications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- REMINDERS ---
  async getReminders(petId?: string) {
    const query = petId ? `?petId=${petId}` : '';
    return this.request<any[]>(`/reminders${query}`);
  }

  async getUpcomingReminders(days = 7) {
    return this.request<any[]>(`/reminders/upcoming?days=${days}`);
  }

  async createReminder(data: any) {
    return this.request<any>('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async completeReminder(id: string) {
    return this.request<any>(`/reminders/${id}/complete`, {
      method: 'POST',
    });
  }

  async deleteReminder(id: string) {
    return this.request<any>(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // --- EMERGENCY & TRIAGE ---
  async evaluateEmergencyTriage(data: { problem: string; symptoms?: string; petSpecies?: string; suspectedSubstance?: string }) {
    return this.request<any>('/emergency/triage', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmergencyCases() {
    return this.request<any[]>('/emergency/cases');
  }

  // --- AI HEALTH ASSISTANT ---
  async askAiHealth(query: string, petContext?: any) {
    return this.request<any>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ query, petContext }),
    });
  }

  // --- LOCATIONS ---
  async getLocations(type?: 'clinic' | 'store', isEmergency24h?: boolean) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (isEmergency24h !== undefined) params.append('isEmergency24h', String(isEmergency24h));
    return this.request<any[]>(`/locations?${params.toString()}`);
  }

  async getNearbyLocations(params?: { lat?: number; lng?: number; radius?: number; type?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.lat !== undefined) query.append('lat', params.lat.toString());
    if (params?.lng !== undefined) query.append('lng', params.lng.toString());
    if (params?.radius !== undefined) query.append('radius', params.radius.toString());
    if (params?.type && params.type !== 'all') query.append('type', params.type);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<any[]>(`/locations/nearby${queryString}`);
  }

  // --- LOST & FOUND PETS ---
  async getLostPets(type?: 'lost' | 'found') {
    const query = type ? `?type=${type}` : '';
    return this.request<any[]>(`/lost-pets${query}`);
  }

  async createLostPetReport(data: any) {
    return this.request<any>('/lost-pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLostPetPoster(id: string) {
    return this.request<any>(`/lost-pets/${id}/poster`);
  }

  // --- AI HEALTH ASSISTANT ---
  async askAIHealthAssistant(
    question: string, 
    context?: Record<string, any>, 
    history?: { role: 'user' | 'model'; text: string }[],
    petId?: string
  ) {
    return this.request<any>('/ai/health-assistant', {
      method: 'POST',
      body: JSON.stringify({ question, context, history, petId }),
    });
  }

  // --- KNOWLEDGE & VIDEOS ---
  async getKnowledgeArticles(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return this.request<any[]>(`/knowledge?${params.toString()}`);
  }

  async getVideos(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<any[]>(`/videos${query}`);
  }

  // --- COMMUNITY ---
  async getCommunityPosts(options?: { category?: string; postType?: string; search?: string; verifiedOnly?: boolean }) {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.postType && options.postType !== 'all') params.append('postType', options.postType);
    if (options?.search) params.append('search', options.search);
    if (options?.verifiedOnly) params.append('verifiedOnly', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/community/posts${query}`);
  }

  async createCommunityPost(data: {
    title: string;
    content: string;
    category?: string;
    postType?: string;
    videoUrl?: string;
    images?: string[];
    tags?: string[];
  }) {
    return this.request<any>('/community/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCommunityPost(id: string, data: any) {
    return this.request<any>(`/community/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCommunityPost(id: string) {
    return this.request<any>(`/community/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async likeCommunityPost(postId: string) {
    return this.request<any>(`/community/posts/${postId}/like`, { method: 'POST' });
  }

  async addCommunityComment(postId: string, content: string) {
    return this.request<any>(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // --- NOTIFICATIONS ---
  async getNotifications(unreadOnly = false) {
    return this.request<{ items: any[]; unreadCount: number }>(
      `/notifications?unreadOnly=${unreadOnly}`,
    );
  }

  async markNotificationAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsAsRead() {
    return this.request<any>('/notifications/read-all', { method: 'POST' });
  }

  // --- UPLOADS ---
  async uploadImage(file: File, folder = 'pets') {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<{ url: string; filename: string; size: number }>(
      `/uploads/image?folder=${folder}`,
      {
        method: 'POST',
        body: formData,
      },
    );
  }
}

export const apiClient = new ApiClient();
export default apiClient;
