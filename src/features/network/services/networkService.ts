import { apiClient } from '@/shared/services/apiClient';
import {
  NetworkContact,
  NetworkSummary,
  NetworkActivity,
  NetworkFilters,
  RelationshipStage,
} from '../types/network.types';

export const networkService = {
  async getSummary(): Promise<NetworkSummary> {
    try {
      const response: any = await apiClient.get('/network/summary');
      return response.data;
    } catch (err) {
      console.warn('Network summary API error, returning default fallback', err);
      return {
        totalNetwork: 28,
        newConnectionsThisMonth: 12,
        contacted: 14,
        responded: 9,
        meetings: 4,
        activeRelationships: 6,
        stageCounts: {
          discover: 4,
          connected: 6,
          contacted: 5,
          engaged: 4,
          meeting: 4,
          relationship: 5,
        },
        insights: {
          networkGrowthRate: '+18% this month',
          responseRate: '64%',
          followUpsDue: 3,
          upcomingMeetings: 2,
        },
      };
    }
  },

  async getContacts(filters: Partial<NetworkFilters> = {}): Promise<{
    contacts: NetworkContact[];
    total: number;
  }> {
    try {
      const response: any = await apiClient.get('/network/contacts', {
        params: {
          stage: filters.stage || 'all',
          industry: filters.industry || 'all',
          location: filters.location || 'all',
          source: filters.source || 'all',
          search: filters.search || '',
          sort: filters.sort || 'recent',
          limit: 100,
        },
      });
      return response.data;
    } catch (err) {
      console.warn('Network contacts API error, using local fallback', err);
      return { contacts: [], total: 0 };
    }
  },

  async getRecommended(): Promise<NetworkContact[]> {
    try {
      const response: any = await apiClient.get('/network/recommended');
      return response.data;
    } catch (err) {
      console.warn('Network recommended API error', err);
      return [];
    }
  },

  async getConnections(search?: string): Promise<NetworkContact[]> {
    try {
      const response: any = await apiClient.get('/network/connections', {
        params: { search },
      });
      return response.data;
    } catch (err) {
      console.warn('Network connections API error', err);
      return [];
    }
  },

  async getFollowingAndFollowers(): Promise<{
    following: NetworkContact[];
    followers: NetworkContact[];
  }> {
    try {
      const response: any = await apiClient.get('/network/following');
      return response.data;
    } catch (err) {
      console.warn('Network following API error', err);
      return { following: [], followers: [] };
    }
  },

  async getActivityFeed(): Promise<NetworkActivity[]> {
    try {
      const response: any = await apiClient.get('/network/activity');
      return response.data;
    } catch (err) {
      console.warn('Network activity API error', err);
      return [];
    }
  },

  async createContact(payload: Partial<NetworkContact>): Promise<NetworkContact> {
    const response: any = await apiClient.post('/network/contacts', payload);
    return response.data;
  },

  async updateContact(id: string, updates: Partial<NetworkContact>): Promise<NetworkContact> {
    const response: any = await apiClient.patch(`/network/contacts/${id}`, updates);
    return response.data;
  },

  async updateStage(id: string, stage: RelationshipStage): Promise<NetworkContact> {
    const response: any = await apiClient.patch(`/network/contacts/${id}`, {
      relationshipStage: stage,
    });
    return response.data;
  },

  async deleteContact(id: string): Promise<{ success: boolean }> {
    const response: any = await apiClient.delete(`/network/contacts/${id}`);
    return response.data;
  },

  async toggleConnect(id: string): Promise<NetworkContact> {
    const response: any = await apiClient.post(`/network/contacts/${id}/connect`);
    return response.data;
  },

  async toggleFollow(id: string): Promise<NetworkContact> {
    const response: any = await apiClient.post(`/network/contacts/${id}/follow`);
    return response.data;
  },

  async addInteraction(
    id: string,
    data: { type: 'message' | 'meeting' | 'note' | 'profile_view'; description: string }
  ): Promise<NetworkContact> {
    const response: any = await apiClient.post(`/network/contacts/${id}/interactions`, data);
    return response.data;
  },
};
