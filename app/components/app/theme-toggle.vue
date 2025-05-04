<script lang="ts" setup>
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light';
  },
});
</script>

<template>
  <label class="swap swap-rotate mx-4">
    <input v-model="isDark" type="checkbox">
    <Icon
      name="tabler:sun"
      class="swap-on h-10 w-10 fill-current"
      size="24"
    />
    <Icon
      name="tabler:moon-filled"
      class="swap-off h-10 w-10 fill-current"
      size="24"
    />
  </label>
</template>

<style scoped>

</style>
