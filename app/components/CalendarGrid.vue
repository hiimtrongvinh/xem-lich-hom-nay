<script setup>
import { computed, ref, watch } from 'vue'
import { convertSolar2Lunar, TUAN, isHoangDaoDay, isHacDaoDay, getHoliday } from '../utils/lunar'

const props = defineProps({
  activeDate: {
    type: Date,
    required: true
  },
  hasActiveHighlight: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select-date', 'change-view'])

const todayState = useState('today-state', () => new Date())

const viewYear = ref(props.activeDate.getFullYear())
const viewMonth = ref(props.activeDate.getMonth())

const selectedMonth = ref(props.activeDate.getMonth())
const selectedYear = ref(props.activeDate.getFullYear())

const yearOptions = Array.from({ length: 101 }, (_, i) => 1970 + i)

watch(() => props.activeDate, (newDate) => {
  viewYear.value = newDate.getFullYear()
  viewMonth.value = newDate.getMonth()
})

watch([viewMonth, viewYear], ([newM, newY]) => {
  selectedMonth.value = newM
  selectedYear.value = newY
})

const monthNames = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

const weekHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const gridDays = computed(() => {
  const days = []
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  let startDayOfWeek = firstDay.getDay()
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  const lastDay = new Date(viewYear.value, viewMonth.value + 1, 0)
  const totalDaysInMonth = lastDay.getDate()
  const prevMonthLastDay = new Date(viewYear.value, viewMonth.value, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(viewYear.value, viewMonth.value - 1, day)
    days.push({ date, dayNum: day, isCurrentMonth: false, lunar: getLunarDayInfo(date) })
  }
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const date = new Date(viewYear.value, viewMonth.value, i)
    days.push({ date, dayNum: i, isCurrentMonth: true, lunar: getLunarDayInfo(date) })
  }
  const N = startDayOfWeek + totalDaysInMonth
  const totalCells = Math.ceil(N / 7) * 7
  const remaining = totalCells - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(viewYear.value, viewMonth.value + 1, i)
    days.push({ date, dayNum: i, isCurrentMonth: false, lunar: getLunarDayInfo(date) })
  }
  return days
})

function getLunarDayInfo(date) {
  const sd = date.getDate()
  const sm = date.getMonth() + 1
  const sy = date.getFullYear()
  const lunar = convertSolar2Lunar(sd, sm, sy)
  const lMonth = lunar[1]
  const jd = lunar[4]
  const dayChiIndex = (jd + 1) % 12
  const lDay = lunar[0]
  const isLeap = lunar[3] === 1
  return {
    day: lDay,
    month: lMonth,
    isLeap: isLeap,
    jd: jd,
    isHoangDao: isHoangDaoDay(lMonth, dayChiIndex),
    isHacDao: isHacDaoDay(lMonth, dayChiIndex),
    isHoliday: !!getHoliday(sd, sm, lDay, lMonth, isLeap)
  }
}

function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}
function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

watch([viewMonth, viewYear], ([newM, newY]) => {
  emit('change-view', { month: newM, year: newY })
})

function goToMonthYear() {
  viewMonth.value = parseInt(selectedMonth.value, 10)
  viewYear.value = parseInt(selectedYear.value, 10)
}
function selectDay(day) { emit('select-date', day.date) }
function isToday(date) {
  return date.getDate() === todayState.value.getDate() &&
         date.getMonth() === todayState.value.getMonth() &&
         date.getFullYear() === todayState.value.getFullYear()
}
function isActive(date) {
  if (!props.hasActiveHighlight) return false
  return date.getDate() === props.activeDate.getDate() &&
         date.getMonth() === props.activeDate.getMonth() &&
         date.getFullYear() === props.activeDate.getFullYear()
}
function isSpecialLunarDay(day) {
  return day.lunar.day === 15 || day.lunar.day === 1
}
</script>

<template>
  <div class="glass-panel rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
    <!-- Header Navigation -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
      
      <!-- Mobile Helper: Prev + Next buttons -->
      <div class="flex items-center justify-between gap-2 w-full sm:w-auto order-2 sm:order-none">
        <button 
          @click="prevMonth" 
          class="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl transition-all text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Tháng trước
        </button>
        <button 
          @click="nextMonth" 
          class="sm:hidden flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl transition-all text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
        >
          Tháng sau
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      
      <!-- Middle Controls -->
      <div class="flex items-center justify-center gap-2 order-1 sm:order-none w-full sm:w-auto">
        <select 
          v-model="selectedMonth" 
          class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:border-amber-500 focus:outline-none transition-colors custom-select"
        >
          <option v-for="(name, index) in monthNames" :key="index" :value="index">
            {{ name }}
          </option>
        </select>

        <div class="relative w-24">
          <input 
            v-model="selectedYear" 
            list="years-list"
            class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:border-amber-500 focus:outline-none transition-colors custom-select"
            @change="goToMonthYear"
          />
          <datalist id="years-list">
            <option v-for="y in yearOptions" :key="y" :value="y">Năm {{ y }}</option>
          </datalist>
        </div>

        <button 
          @click="goToMonthYear" 
          class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-md shadow-amber-500/10 transition-all text-xs"
        >
          Di chuyển
        </button>
      </div>

      <!-- Next Month Button (Desktop) -->
      <button 
        @click="nextMonth" 
        class="hidden sm:flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl transition-all text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
      >
        Tháng sau
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

    <!-- Calendar Body -->
    <div class="flex-grow flex flex-col justify-center py-2">
      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-1.5 text-center mb-2 justify-items-center">
        <div 
          v-for="header in weekHeaders" 
          :key="header" 
          class="w-10 xs:w-12 sm:w-14 text-center text-xs font-bold text-slate-500 dark:text-slate-400 py-2 tracking-wider"
        >
          {{ header }}
        </div>
      </div>

      <!-- Calendar Grid Cells -->
      <div class="grid grid-cols-7 gap-1.5 justify-items-center">
        <button 
          v-for="(day, index) in gridDays" 
          :key="index"
          @click="selectDay(day)"
          class="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-xl p-1 flex flex-col justify-between transition-all border relative"
          :class="[
            day.isCurrentMonth 
              ? (day.lunar.isHoliday ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-800 dark:text-slate-200') 
              : 'text-slate-400 dark:text-slate-600 border-transparent opacity-30',
            isActive(day.date)
              ? 'glass-card-active border-amber-500/40 text-amber-600 dark:text-amber-400 font-semibold' 
              : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600',
            isToday(day.date) && !isActive(day.date) ? 'border-red-500/45 bg-red-50/50 dark:bg-red-900/10' : ''
          ]"
        >
          <!-- Today Indicator dot -->
          <span 
            v-if="isToday(day.date)" 
            class="absolute w-1.5 h-1.5 rounded-full bg-red-500 top-1 right-1"
          ></span>

          <!-- Solar day -->
          <div class="text-sm xs:text-base sm:text-lg font-extrabold text-left pl-1 leading-tight">
            {{ day.dayNum }}
          </div>

          <!-- Indicators Row -->
          <div class="absolute bottom-1 left-1 sm:left-1.5 flex items-center gap-0.5 pointer-events-none">
            <span v-if="day.lunar.isHoliday" class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-500"></span>
            <span v-if="day.lunar.isHoangDao" class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500"></span>
            <span v-if="day.lunar.isHacDao" class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
          </div>

          <!-- Lunar day -->
          <div 
            class="text-[10.5px] xs:text-[11.5px] sm:text-xs text-right pr-0.5 font-mono font-bold leading-tight"
            :class="[
              isSpecialLunarDay(day) ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400 dark:text-slate-500'
            ]"
          >
            {{ day.lunar.day === 1 ? `${day.lunar.day}/${day.lunar.month}` : day.lunar.day }}
          </div>
        </button>
      </div>
    </div>

    <!-- Calendar Legend -->
    <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold shrink-0">
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-red-500"></span>
        <span>Hôm nay</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded bg-amber-500/20 border border-amber-500"></span>
        <span>Đang chọn</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Hoàng đạo</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
        <span>Hắc đạo</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
        <span>Ngày lễ</span>
      </div>
    </div>
  </div>
</template>
