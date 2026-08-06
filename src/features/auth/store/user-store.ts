import { create } from 'zustand';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  setUser: (data: { id: string; name: string; email: string; role: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  name: null,
  email: null,
  role: null,
  
  setUser: (data) => set({ id: data.id, name: data.name, email: data.email, role: data.role }),
  clearUser: () => set({ id: null, name: null, email: null, role: null }),
}));