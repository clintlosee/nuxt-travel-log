export const useLocationsStore = defineStore('useLocationStore', () => {
  const { data, status, refresh } = useLazyFetch('/api/locations');

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.map((location: { id: string; name: string }) => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: 'tabler:map-pin-filled',
        href: '#',
      }));

      mapStore.mapPoints = data.value.map((location: { id: string; name: string; lat: number; long: number }) => {
        return {
          id: location.id,
          label: location.name,
          lat: location.lat,
          long: location.long,
        };
      });
    }
    sidebarStore.loading = status.value === 'pending';
  });

  return {
    locations: data,
    status,
    refresh,
  };
});
