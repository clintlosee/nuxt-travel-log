<script lang="ts" setup>
import type { MglEvent } from '@indoorequal/vue-maplibre-gl';
import type { LngLat } from 'maplibre-gl';

import { CENTER_USA } from '~/lib/constants';

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => colorMode.value === 'dark' ? '/styles/dark.json' : 'https://tiles.openfreemap.org/styles/liberty');
const zoom = 3;

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat;
    mapStore.addedPoint.long = location.lng;
  }
}

function onDoubleClick(mglEvent: MglEvent<'dblclick'>) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
  }
}

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <div :class="$attrs.class" class="map-container">
    <MglMap
      :map-style="style"
      :center="CENTER_USA"
      :zoom="zoom"
      @map:dblclick="onDoubleClick"
    >
      <MglNavigationControl />
      <MglMarker
        v-if="mapStore.addedPoint"
        :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
        draggable
        @update:coordinates="updateAddedPoint"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top tooltip-open hover:cursor-pointer tooltip::before:z-99"
            data-tip="Drag to your desired location"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="35"
              class="text-warning"
            />
          </div>
        </template>
      </MglMarker>

      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top hover:cursor-pointer tooltip::before:z-99"
            :class="{
              'tooltip-open': mapStore.selectedPoint?.id === point.id,
            }"
            :data-tip="point.name"
            @mouseenter="mapStore.selectedPoint = point"
            @mouseleave="mapStore.selectedPoint = null"
          >
            <!-- @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
            @mouseleave="mapStore.selectPointWithoutFlyTo(null)" -->
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              :class="mapStore.selectedPoint?.id === point.id ? 'text-accent' : 'text-secondary'"
            />
          </div>
        </template>
        <MglPopup>
          <h3 class="text-xl">
            {{ point.name }}
          </h3>
          <p v-if="point.description">
            {{ point.description }}
          </p>
        </MglPopup>
      </MglMarker>
    </MglMap>
  </div>
</template>

<style scoped>

</style>
