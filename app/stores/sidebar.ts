export type SideBarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

export const useSidebarStore = defineStore('useSidebarStore', () => {
  const sidebarItems = ref<SideBarItem[]>([]);
  const loading = ref(true);

  return {
    sidebarItems,
    loading,
  };
});
