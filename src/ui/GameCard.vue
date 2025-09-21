<script setup lang="ts">
import { ref, computed } from 'vue';
import { Game } from '../engine/game';

import GameBoard from './GameBoard.vue';

interface Props {
  game: Game;
}
const props = defineProps<Props>();

const visible = ref(false);
function toggleHistoriesVisible() {
  visible.value = !visible.value;
}

const currentRoundNo = ref(1);
const currentRoundHistory = computed(() => {
  return props.game.roundHistories.find((r) => r.round === currentRoundNo.value);
});

function onNextRound() {
  if (currentRoundNo.value >= props.game.roundHistories.length) {
    return;
  }

  currentRoundNo.value += 1;
}
</script>

<template>
  <div class="tw:space-y-1 tw:cursor-pointer" @click.stop="toggleHistoriesVisible">
    <div class="tw:grid tw:grid-cols-[100px_1fr]">
      <span>{{ `第${game.no}局` }}</span>
      <span>{{ game.result.text }}</span>
    </div>
    <div v-if="visible">
      <GameBoard v-if="currentRoundHistory" :round-count="game.roundHistories.length" :round-history="currentRoundHistory" @next-round="onNextRound" />
    </div>
  </div>
</template>
