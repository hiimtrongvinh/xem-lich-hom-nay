<script setup>
import { computed, ref, watch } from 'vue'
import { convertSolar2Lunar, TUAN } from '../utils/lunar'

const props = defineProps({
  activeDate: {
    type: Date,
    required: true
  }
})

const emit = defineEmits(['select-date', 'change-view'])

// The month and year currently viewed in the grid
const viewYear = ref(props.activeDate.getFullYear())
const viewMonth = ref(props.activeDate.getMonth()) // 0-indexed

// Select binds
const selectedMonth = ref(props.activeDate.getMonth())
const selectedYear = ref(props.activeDate.getFullYear())

const yearOptions = Array.from({ length: 101 }, (_, i) => 1970 + i) // 1970 to 2070

// Update view when activeDate prop changes
watch(() => props.activeDate, (newDate) => {
  viewYear.value = newDate.getFullYear()
  viewMonth.value = newDate.getMonth()
})

// Sync selectors when viewMonth or viewYear changes internally
watch([viewMonth, viewYear], ([newM, newY]) => {
  selectedMonth.value = newM
  selectedYear.value = newY
})

const monthNames = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

// Day headers: Mon to Sun
const weekHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

// Generate days for the grid
const gridDays = computed(() => {
  const days = []
  
  // First day of current month
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  
  // Day of week of the first day (0 = Sun, 1 = Mon, ..., 6 = Sat)
  let startDayOfWeek = firstDay.getDay()
  // Adjust so Monday is 0 and Sunday is 6
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  // Last day of current month
  const lastDay = new Date(viewYear.value, viewMonth.value + 1, 0)
  const totalDaysInMonth = lastDay.getDate()

  // Days of previous month to fill prefix
  const prevMonthLastDay = new Date(viewYear.value, viewMonth.value, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(viewYear.value, viewMonth.value - 1, day)
    days.push({
      date,
      dayNum: day,
      isCurrentMonth: false,
      lunar: getLunarDayInfo(date)
    })
  }

  // Days of current month
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const date = new Date(viewYear.value, viewMonth.value, i)
    days.push({
      date,
      dayNum: i,
      isCurrentMonth: true,
      lunar: getLunarDayInfo(date)
    })
  }

  // Calculate necessary cells (multiple of 7)
  const N = startDayOfWeek + totalDaysInMonth
  const totalCells = Math.ceil(N / 7) * 7

  // Days of next month to fill suffix
  const remaining = totalCells - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(viewYear.value, viewMonth.value + 1, i)
    days.push({
      date,
      dayNum: i,
      isCurrentMonth: false,
      lunar: getLunarDayInfo(date)
    })
  }

  return days
})

function getLunarDayInfo(date) {
  const lunar = convertSolar2Lunar(date.getDate(), date.getMonth() + 1, date.getFullYear())
  return {
    day: lunar[0],
    month: lunar[1],
    isLeap: lunar[3] === 1,
    jd: lunar[4]
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

// Emits route updates when navigating internally
watch([viewMonth, viewYear], ([newM, newY]) => {
  emit('change-view', { month: newM, year: newY })
})

function goToMonthYear() {
  viewMonth.value = parseInt(selectedMonth.value, 10)
  viewYear.value = parseInt(selectedYear.value, 10)
}

function selectDay(day) {
  emit('select-date', day.date)
}

function isToday(date) {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

function isActive(date) {
  return date.getDate() === props.activeDate.getDate() &&
         date.getMonth() === props.activeDate.getMonth() &&
         date.getFullYear() === props.activeDate.getFullYear()
}

// Check if it is a major lunar day (Rằm = 15, Mùng 1 = 1)
function isSpecialLunarDay(day) {
  return day.lunar.day === 15 || day.lunar.day === 1
}
</script>

<template>
  <div class="glass-panel rounded-3xl p-6 shadow-xl border border-slate-200 h-full flex flex-col justify-between">
    <!-- Header Navigation Layout: < Tháng trước | Chọn tháng | Chọn năm | Di chuyển | Tháng sau > -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
      
      <!-- Prev Month Button -->
      <button 
        @click="prevMonth" 
        class="flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl transition-all text-slate-700 hover:text-amber-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Tháng trước
      </button>
      
      <!-- Middle Controls (Dropdowns + Button) -->
      <div class="flex items-center justify-center gap-2">
        <!-- Month Dropdown -->
        <select 
          v-model="selectedMonth" 
          class="bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-2 text-xs font-medium focus:border-amber-500 focus:outline-none transition-colors custom-select"
        >
          <option v-for="(name, index) in monthNames" :key="index" :value="index">
            {{ name }}
          </option>
        </select>

        <!-- Year Dropdown (Combobox style allowing typing) -->
        <div class="relative w-24">
          <input 
            v-model="selectedYear" 
            list="years-list"
            class="w-full bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-2 text-xs font-medium focus:border-amber-500 focus:outline-none transition-colors custom-select"
            @change="goToMonthYear"
          />
          <datalist id="years-list">
            <option v-for="y in yearOptions" :key="y" :value="y">Năm {{ y }}</option>
          </datalist>
        </div>

        <!-- Go Button -->
        <button 
          @click="goToMonthYear" 
          class="bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 font-bold px-4 py-2 rounded-xl shadow-md shadow-amber-500/10 transition-all text-xs"
        >
          Di chuyển
        </button>
      </div>

      <!-- Next Month Button -->
      <button 
        @click="nextMonth" 
        class="flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl transition-all text-slate-700 hover:text-amber-600"
      >
        Tháng sau
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

    <!-- Calendar Body wrapper to center grid elements and remove vertical gaps -->
    <div class="flex-grow flex flex-col justify-center py-2">
      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-1.5 text-center mb-2 justify-items-center">
        <div 
          v-for="header in weekHeaders" 
          :key="header" 
          class="w-10 xs:w-12 sm:w-14 text-center text-xs font-bold text-slate-500 py-2 uppercase tracking-wider"
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
            day.isCurrentMonth ? 'text-slate-800' : 'text-slate-400 border-transparent opacity-30',
            isActive(day.date)
              ? 'glass-card-active border-amber-500/40 text-amber-600 font-semibold' 
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300',
            isToday(day.date) && !isActive(day.date) ? 'border-red-500/45 bg-red-50/50' : ''
          ]"
        >
          <!-- Today Indicator dot -->
          <span 
            v-if="isToday(day.date)" 
            class="absolute w-1.5 h-1.5 rounded-full bg-red-500 top-1 right-1"
          ></span>

          <!-- Solar day (big) -->
          <div class="text-sm xs:text-base sm:text-lg font-extrabold text-left pl-1 leading-tight">
            {{ day.dayNum }}
          </div>

          <!-- Lunar day (small) -->
          <div 
            class="text-[9px] xs:text-[10px] sm:text-xs text-right pr-0.5 font-mono font-bold leading-tight"
            :class="[
              isSpecialLunarDay(day) ? 'text-amber-600 font-bold' : 'text-slate-400'
            ]"
          >
            <!-- Show Month/Day if it's the 1st of the lunar month -->
            {{ day.lunar.day === 1 ? `${day.lunar.day}/${day.lunar.month}` : day.lunar.day }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
