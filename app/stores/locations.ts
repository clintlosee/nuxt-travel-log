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
        location,
      }));

      // mapStore.mapPoints = data.value.map((location: { id: string; name: string; lat: number; long: number; description: string }) => {
      //   return {
      //     id: location.id,
      //     name: location.name,
      //     description: location.description,
      //     lat: location.lat,
      //     long: location.long,
      //   };
      // });
      mapStore.mapPoints = data.value;
    }
    sidebarStore.loading = status.value === 'pending';
  });

  return {
    locations: data,
    status,
    refresh,
  };
});
