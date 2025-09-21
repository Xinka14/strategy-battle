<script setup lang="ts">
import type { Strategy } from '../strategies';

interface Props {
  candidates: Strategy[];
  no: number;
}
withDefaults(defineProps<Props>(), {
  candidates: () => [],
  no: 1,
});
const value = defineModel<Strategy | null>();
</script>

<template>
  <div class="tw:space-y-2">
    <div>玩家{{ no }}</div>
    <select v-model="value" class="form-select">
      <option disabled :value="null">请选择</option>
      <option v-for="candidate in candidates" :key="candidate.name" :value="candidate">{{ candidate.name }}</option>
    </select>
    <div class="tw:whitespace-pre-line tw:p-1">{{ value?.description }}</div>
  </div>
</template>
