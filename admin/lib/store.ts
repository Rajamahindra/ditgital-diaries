import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface AdminUser { id: string; email: string; name: string; plan: string; }

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  setAuth: (user: AdminUser, token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        Cookies.set("dd_admin_token", token, { expires: 7 });
        set({ user, token });
      },
      logout: () => {
        Cookies.remove("dd_admin_token");
        set({ user: null, token: null });
      },
    }),
    { name: "dd-admin-auth" }
  )
);
