<script setup lang="ts">
import { ref, computed, watch, toRaw, nextTick } from 'vue';
import { BOARD_SIZE } from '../constants';
import { RoundHistory } from '../engine/histories/roundHistory';
import type { Action, Direction, Position } from '../engine/types';
import { assertNotNull, getDistance, sleep } from '../utils';
import { MoveAction } from '../engine/actions/moveAction';
import { DetectAction } from '../engine/actions/detectAction';
import { AttackAction } from '../engine/actions/attackAction';

interface Props {
  roundCount: number;
  roundHistory: RoundHistory;
}
const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'nextRound'): void;
}>();
function nextRound() {
  emits('nextRound');
}

interface PlayerState {
  position: Position;
  direction: Direction;
  hitPoints: number;
}
interface Radar {
  top: number;
  left: number;
  visible: boolean;
}
interface AttackRange {
  top: number;
  left: number;
  visible: boolean;
}
interface Damage {
  top: number;
  left: number;
  value: number;
}

const states = ref<PlayerState[]>([]);
const currentTrunNo = ref(0);
const radar = ref<Radar>({
  top: 0,
  left: 0,
  visible: false,
});
const attackRange = ref<AttackRange>({
  top: 0,
  left: 0,
  visible: false,
});
const damage = ref<Damage>({
  top: 0,
  left: 0,
  value: 0,
});

watch(
  () => props.roundHistory,
  async () => {
    states.value = getInitStates();
    await replayTurns();
  },
  { immediate: true },
);
function getInitStates(): PlayerState[] {
  return [
    {
      position: structuredClone(toRaw(props.roundHistory.playerTurnHistories[0].position)),
      direction: props.roundHistory.playerTurnHistories[0].direction,
      hitPoints: props.roundHistory.playerTurnHistories[0].hitPoints,
    },
    {
      position: structuredClone(toRaw(props.roundHistory.playerTurnHistories[1].position)),
      direction: props.roundHistory.playerTurnHistories[1].direction,
      hitPoints: props.roundHistory.playerTurnHistories[1].hitPoints,
    },
  ];
}

const tankStyles = computed(() => (no: number) => {
  const top = states.value[no].position.y * 64;
  const left = states.value[no].position.x * 64;
  const degree = getRotateDegree(states.value[no].direction);

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: `rotate(${degree}deg)`,
  };
});
function getRotateDegree(direction: Direction): number {
  switch (direction) {
    case 'up':
      return 180;
    case 'down':
      return 0;
    case 'left':
      return 90;
    case 'right':
      return 270;
  }
}
const radarStyles = computed(() => {
  return {
    top: `${radar.value.top}px`,
    left: `${radar.value.left}px`,
    display: radar.value.visible ? 'block' : 'none',
  };
});
const rangeStyles = computed(() => {
  return {
    top: `${attackRange.value.top}px`,
    left: `${attackRange.value.left}px`,
    display: attackRange.value.visible ? 'block' : 'none',
  };
});
const damageStyles = computed(() => {
  return {
    top: `${damage.value.top}px`,
    left: `${damage.value.left}px`,
    display: damage.value.value > 0 ? 'flex' : 'none',
  };
});
const historyStyles = computed(() => (no: number) => {
  let color;

  if (no === 0) {
    color = 'red';
  } else {
    color = 'green';
  }

  return {
    color,
  };
});

async function replayTurns() {
  await sleep(500);
  await replayTurn(0);
  await sleep(500);
  await replayTurn(1);
}
async function replayTurn(no: number) {
  currentTrunNo.value = no;
  const actions = props.roundHistory.playerTurnHistories[no].actions;
  for (const action of actions) {
    replayAction(no, action);
    await sleep(1900);
    await nextTick();
    stopAction(action);
    await nextTick();
  }
}
function replayAction(no: number, action: Action) {
  if (action instanceof MoveAction) {
    replayMove(no, action);
  } else if (action instanceof DetectAction) {
    replayDetect(no);
  } else if (action instanceof AttackAction) {
    replayAttack(action);
  }
}
function replayMove(no: number, action: MoveAction) {
  assertNotNull(action.result);
  states.value[no].direction = action.direction;
  if (action.result.isSucceed) {
    assertNotNull(action.result.position);
    states.value[no].position = structuredClone(toRaw(action.result.position));
  }
}
function replayDetect(no: number) {
  radar.value.top = states.value[no].position.y * 64;
  radar.value.left = states.value[no].position.x * 64;
  radar.value.visible = true;
}
function replayAttack(action: AttackAction) {
  assertNotNull(action.result);
  attackRange.value.top = (action.target.y - 1) * 64;
  attackRange.value.left = (action.target.x - 1) * 64;
  attackRange.value.visible = true;
  damage.value.top = action.target.y * 64;
  damage.value.left = action.target.x * 64;
  damage.value.value = action.result.damage ?? 0;
}
function stopAction(action: Action) {
  if (action instanceof DetectAction) {
    stopDetect();
  } else if (action instanceof AttackAction) {
    stopAttack();
  }
}
function stopDetect() {
  radar.value.top = 0;
  radar.value.left = 0;
  radar.value.visible = false;
}
function stopAttack() {
  attackRange.value.top = 0;
  attackRange.value.left = 0;
  attackRange.value.visible = false;
  damage.value.top = 0;
  damage.value.left = 0;
  damage.value.value = 0;
}

function getRoadIcon(x: number, y: number): string {
  let sx: string, sy: string;

  if (x === 0) {
    sx = '0';
  } else if (x === BOARD_SIZE - 1) {
    sx = 'b';
  } else {
    sx = 'x';
  }

  if (y === 0) {
    sy = '0';
  } else if (y === BOARD_SIZE - 1) {
    sy = 'b';
  } else {
    sy = 'x';
  }

  const striped = getDistance({ x: 0, y: 0 }, { x, y }) % 2;

  return `icon-road-${sx}-${sy}-${striped}`;
}
</script>

<template>
  <div class="tw:flex tw:gap-x-[10px]">
    <div class="tw:relative tw:overflow-hidden">
      <table class="tw:flex-none" :class="$style.fixed">
        <tbody>
          <tr v-for="(_, y) in 10" :key="y">
            <td v-for="(_, x) in 10" :key="x" class="icon" :class="getRoadIcon(x, y)"></td>
          </tr>
        </tbody>
      </table>
      <div :class="$style.tank" :style="tankStyles(0)">
        <div class="icon icon-tank-1"></div>
      </div>
      <div :class="$style.tank" :style="tankStyles(1)">
        <div class="icon icon-tank-2"></div>
      </div>
      <div :class="$style.radar" :style="radarStyles"></div>
      <div :class="$style.explosions" :style="rangeStyles">
        <div :class="$style.explosion" class="icon icon-explosion-1"></div>
        <div :class="$style.explosion" class="icon icon-explosion-2"></div>
        <div :class="$style.explosion" class="icon icon-explosion-3"></div>
        <div :class="$style.explosion" class="tw:grid tw:gird-rows-3 tw:grid-cols-3 tw:justify-items-center tw:items-center">
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
          <div class="icon icon-explosion-4"></div>
        </div>
        <div :class="$style.explosion" class="tw:grid tw:gird-rows-3 tw:grid-cols-3 tw:justify-items-center tw:items-center">
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
          <div class="icon icon-explosion-5"></div>
        </div>
      </div>
      <div :class="$style.damage" :style="damageStyles">-{{ damage.value }}</div>
    </div>
    <div class="tw:flex tw:flex-col tw:gap-[1px]">
      <span>{{ roundHistory.title(roundCount) }}</span>
      <template v-for="(turnHistory, i) in roundHistory.playerTurnHistories" :key="i">
        <div v-if="currentTrunNo >= i" class="tw:flex tw:flex-col tw:gap-[1px]" :style="historyStyles(i)">
          <span>{{ turnHistory.title }}</span>
          <span v-for="(action, j) in turnHistory.actions" :key="j" class="tw:pl-4">{{ action.description }}</span>
        </div>
      </template>
      <button :disabled="roundHistory.round === roundCount" class="btn btn-primary" @click.stop="nextRound">下一回合</button>
    </div>
  </div>
</template>

<style module>
.fixed {
  table-layout: fixed;
  width: 640px;

  td {
    width: 64px;
    height: 64px;
  }
}

.tank {
  width: 64px;
  height: 64px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    top 1s ease,
    left 1s ease;
}

.radar {
  background-color: lightyellow;
  width: 64px;
  height: 64px;
  position: absolute;
  border-radius: 50%;
  animation: ping 1s ease-in-out infinite;
}

@keyframes ping {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  80% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.explosions {
  position: absolute;
  width: 192px;
  height: 192px;

  div:nth-child(1) {
    animation-delay: 0s;
  }
  div:nth-child(2) {
    animation-delay: 0.4s;
  }
  div:nth-child(3) {
    animation-delay: 0.7s;
  }
  div:nth-child(4) {
    animation-delay: 1s;
  }
  div:nth-child(5) {
    animation-delay: 1.3s;
  }
}

.explosion {
  position: absolute;
  inset: 0;
  margin: auto;
  opacity: 0;
  animation: fade 2s linear infinite;
}

@keyframes fade {
  0%,
  10% {
    opacity: 1;
  }
  20%,
  100% {
    opacity: 0;
  }
}

.damage {
  position: absolute;
  width: 64px;
  height: 64px;
  color: red;
  font-size: 2rem;
  font-style: italic;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: translateY(30px);
  animation: slide-fade 2s ease infinite;
  animation-delay: 1s;
}

@keyframes slide-fade {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(0);
  }
  50%,
  100% {
    opacity: 0;
    transform: translateY(0);
  }
}
</style>
