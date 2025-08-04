import type { MapPoint } from '~/lib/types';

export type SideBarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  location?: MapPoint | null;
};

export const useSidebarStore = defineStore('useSidebarStore', () => {
  const sidebarItems = ref<SideBarItem[]>([]);
  const loading = ref(true);

  return {
    sidebarItems,
    loading,
  };
});
