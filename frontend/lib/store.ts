import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User, Card, CardLayout } from "./types";
import { DEFAULT_THEME } from "./utils";

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        // Keep cookie in sync with store
        if (token) {
          Cookies.set("dd_token", token, { expires: 30 });
        } else {
          Cookies.remove("dd_token");
        }
        set({ token });
      },
      logout: () => {
        Cookies.remove("dd_token");
        set({ user: null, token: null });
      },
    }),
    { name: "dd-auth" }
  )
);

// ─── Card Builder Store ───────────────────────────────────────────────────────
interface BuilderState {
  activeCard: Card | null;
  layout: CardLayout;
  selectedSectionId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  setActiveCard: (card: Card) => void;
  setLayout: (layout: CardLayout) => void;
  updateSection: (sectionId: string, data: unknown) => void;
  selectSection: (id: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;
  reorderSections: (oldIndex: number, newIndex: number) => void;
  addSection: (section: CardLayout["sections"][0]) => void;
  removeSection: (sectionId: string) => void;
  updateTheme: (theme: Partial<CardLayout["theme"]>) => void;
}

const defaultLayout: CardLayout = {
  sections: [],
  theme: DEFAULT_THEME,
  meta: { title: "", description: "" },
};

export const useBuilderStore = create<BuilderState>()((set, get) => ({
  activeCard: null,
  layout: defaultLayout,
  selectedSectionId: null,
  isDirty: false,
  isSaving: false,

  setActiveCard: (card) =>
    set({ activeCard: card, layout: card.layout, isDirty: false }),

  setLayout: (layout) => set({ layout, isDirty: true }),

  updateSection: (sectionId, data) => {
    const { layout } = get();
    const sections = layout.sections.map((s) =>
      s.id === sectionId ? { ...s, data: { ...s.data, ...(data as object) } } : s
    );
    set({ layout: { ...layout, sections }, isDirty: true });
  },

  selectSection: (id) => set({ selectedSectionId: id }),

  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),

  reorderSections: (oldIndex, newIndex) => {
    const { layout } = get();
    const sections = [...layout.sections];
    const [moved] = sections.splice(oldIndex, 1);
    sections.splice(newIndex, 0, moved);
    const reindexed = sections.map((s, i) => ({ ...s, position: i }));
    set({ layout: { ...layout, sections: reindexed }, isDirty: true });
  },

  addSection: (section) => {
    const { layout } = get();
    set({
      layout: {
        ...layout,
        sections: [...layout.sections, { ...section, position: layout.sections.length }],
      },
      isDirty: true,
    });
  },

  removeSection: (sectionId) => {
    const { layout } = get();
    const sections = layout.sections
      .filter((s) => s.id !== sectionId)
      .map((s, i) => ({ ...s, position: i }));
    set({ layout: { ...layout, sections }, isDirty: true, selectedSectionId: null });
  },

  updateTheme: (theme) => {
    const { layout } = get();
    set({ layout: { ...layout, theme: { ...layout.theme, ...theme } }, isDirty: true });
  },
}));

// ─── UI Store ─────────────────────────────────────────────────────────────────
interface UIState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: "dd-ui" }
  )
);
