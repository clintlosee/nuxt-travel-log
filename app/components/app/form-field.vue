<script lang="ts" setup>
defineProps<{
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'number';
  error?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <Field
      :as="type === 'textarea' ? type : type === 'number' ? '' : 'input'"
      :name="name"
      :type="type || 'text'"
      :disabled="disabled"
      class="w-full"
      :class="{
        'input-error': error,
        'input': !type || type === 'text' || type === 'number',
        'textarea': type === 'textarea',
      }"
    />
    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>

<style scoped>

</style>
