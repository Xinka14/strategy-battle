<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { MATCH_GAMES } from './constants';
import { Game } from './engine/game';
import { Player } from './engine/player';
import { sleep } from './utils';

import PlayerCard from './ui/PlayerCard.vue';
import GameCard from './ui/GameCard.vue';

import type { Strategy } from './strategies';
import Random from './strategies/random';
import Cannon from './strategies/cannon';
import Sniper from './strategies/sniper';
const candidates = ref([new Random(), new Cannon(), new Sniper()]);

const strategy1 = ref<Strategy | null>(null);
const strategy2 = ref<Strategy | null>(null);
const games = ref<Game[]>([]);
const scores = ref({
  1: 0,
  2: 0,
});

async function startMatch() {
  if (strategy1.value === null || strategy2.value === null) {
    return;
  }

  games.value = [];
  scores.value[1] = 0;
  scores.value[2] = 0;

  const player1 = new Player(1, strategy1.value);
  const player2 = new Player(2, strategy2.value);

  for (let i = 0; i < 2; i++) {
    const players: [Player, Player] = i === 0 ? [player1, player2] : [player2, player1];
    for (let j = 1; j <= MATCH_GAMES; j++) {
      const game = new Game(i * MATCH_GAMES + j, players);
      games.value.push(game);
      if (game.winner !== null) {
        scores.value[game.winner.no] += 1;
      }
      await sleep(5);
      await nextTick();
    }
  }
}
</script>

<template>
  <div class="tw:bg-black tw:h-dvh tw:p-px">
    <div class="tw:h-full tw:grid tw:grid-flow-col tw:grid-rows-2 tw:grid-cols-[400px_1fr] tw:gap-[1px]">
      <div class="tw:bg-white tw:p-1">
        <PlayerCard :candidates="candidates" :no="1" v-model="strategy1" />
      </div>
      <div class="tw:bg-white tw:p-1">
        <PlayerCard :candidates="candidates" :no="2" v-model="strategy2" />
      </div>
      <div class="tw:bg-white tw:row-span-2 tw:p-2 tw:flex tw:flex-col tw:gap-y-1">
        <div class="tw:space-x-2">
          <button class="btn btn-primary" :disabled="strategy1 === null || strategy2 === null" @click.stop="startMatch">开始对局</button>
          <span>{{ `玩家1获胜${scores[1]}次` }}</span>
          <span>{{ `玩家2获胜${scores[2]}次` }}</span>
        </div>
        <div class="tw:flex-1 tw:gap-[1px] tw:overflow-y-auto">
          <template v-for="game in games" :key="game.no">
            <GameCard :game="game" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
