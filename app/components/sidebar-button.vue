<script lang="ts" setup>
defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
  iconColor?: 'text-accent' | 'text-secondary' | 'text-primary';
}>();

const route = useRoute();
</script>

<template>
  <div
    class="tooltip-right"
    :class="{ tooltip: !showLabel }"
    :data-tip="showLabel ? undefined : label"
  >
    <NuxtLink
      :to="href"
      :class="{ 'bg-base-200': route.path === href, 'justify-center': !showLabel, 'justify-start': showLabel }"
      class="flex  gap-2 p-2 hover:bg-base-300 hover:cursor-pointer flex-nowrap"
    >
      <Icon
        :name="icon"
        size="24"
        :class="iconColor"
      />
      <Transition name="grow">
        <span v-if="showLabel">
          {{ label }}
        </span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.1s;
}
.grow-leave-active {
  animation: grow 0.1s reverse;
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
