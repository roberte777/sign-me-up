import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Event {
  id: string;
  name: string;
  date_time: string;
  group_size_limit: number;
  location: string;
  created_at: string;
}

export interface Group {
  id: number;
  event_id: string;
  creator_name: string;
  creator_email: string;
  group_name: string;
  accepts_others: boolean;
  project_description: string | null;
  created_at: string;
  members: GroupMember[];
}

export interface GroupMember {
  id: number;
  group_id: number;
  name: string;
  email?: string;
}

export interface CreateEventData {
  name: string;
  date_time: string;
  group_size_limit: number;
  location: string;
}

export interface CreateGroupData {
  event_id: string;
  creator_name: string;
  creator_email: string;
  group_name: string;
  accepts_others: boolean;
  project_description?: string;
  members: Omit<GroupMember, "id" | "group_id">[];
}

export const EventAPI = {
  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    const { data } = await api.post<Event>("/events", eventData);
    return data;
  },

  getEvent: async (eventId: string): Promise<Event> => {
    const { data } = await api.get<Event>(`/events/${eventId}`);
    return data;
  },
};

export const GroupAPI = {
  getGroups: async (eventId: string): Promise<Group[]> => {
    const { data } = await api.get<Group[]>(`/events/${eventId}/groups`);
    return data;
  },

  createGroup: async (groupData: CreateGroupData): Promise<Group> => {
    const { data } = await api.post<Group>("/groups", groupData);
    return data;
  },

  updateGroup: async (
    groupId: number,
    groupData: Partial<CreateGroupData>,
  ): Promise<Group> => {
    const { data } = await api.put<Group>(`/groups/${groupId}`, groupData);
    return data;
  },

  getGroup: async (groupId: number): Promise<Group> => {
    const { data } = await api.get<Group>(`/groups/${groupId}`);
    return data;
  },
};

