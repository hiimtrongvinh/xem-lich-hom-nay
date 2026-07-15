<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLunarDayInfo, solarHolidays, lunarHolidays } from '~/utils/lunar'

const route = useRoute()
const router = useRouter()

// Parse route param: yyyy-mm
const monthData = computed(() => {
  const monthStr = route.params.month
  let year = new Date().getFullYear()
  let month = new Date().getMonth() + 1 // 1-indexed
  
  if (monthStr) {
    try {
      const parts = monthStr.split('-')
      if (parts.length === 2) {
        year = parseInt(parts[0], 10)
        month = parseInt(parts[1], 10)
      }
    } catch (e) {}
  }
  return { year, month }
})

// Set activeDate to the 1st of that month to feed the CalendarGrid
const activeDate = computed(() => {
  return new Date(monthData.value.year, monthData.value.month - 1, 1)
})

// Generate list of days in the month
const daysInMonth = computed(() => {
  const list = []
  const { year, month } = monthData.value
  const totalDays = new Date(year, month, 0).getDate()
  
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month - 1, d)
    list.push(getLunarDayInfo(date))
  }
  return list
})

// Filter good (Hoàng đạo) and bad (Hắc đạo) days
const hoangDaoDays = computed(() => {
  return daysInMonth.value.filter(day => day.isHoangDao)
})

const hacDaoDays = computed(() => {
  return daysInMonth.value.filter(day => day.isHacDao)
})

// Find holidays in current month
const holidaysInMonth = computed(() => {
  const currentMonthHolidays = []
  const { year, month } = monthData.value

  solarHolidays.forEach(h => {
    if (h.month === month) {
      currentMonthHolidays.push({
        day: h.day,
        name: h.name,
        type: 'solar',
        dateStr: `Dương lịch: Ngày ${h.day}/${h.month}`
      })
    }
  })

  daysInMonth.value.forEach(day => {
    lunarHolidays.forEach(h => {
      if (day.lunarDay === h.day && day.lunarMonth === h.month && !day.isLeap) {
        currentMonthHolidays.push({
          day: day.solarDay,
          name: h.name,
          type: 'lunar',
          dateStr: `Âm lịch: Ngày ${day.lunarDay}/${day.lunarMonth}`
        })
      }
    })
  })

  return currentMonthHolidays.sort((a, b) => a.day - b.day)
})

// Sync URL when viewed month changes in grid
function handleGridChange({ month, year }) {
  const routeM = String(month + 1).padStart(2, '0')
  const newPath = `/thang/${year}-${routeM}`
  if (route.path !== newPath) {
    router.push(newPath)
  }
}

// Redirect to day view when select-date is emitted
function handleSelectDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  router.push(`/ngay/${y}-${m}-${d}`)
}

useSeoMeta({
  title: () => `Lịch âm tháng ${monthData.value.month} năm ${monthData.value.year} - Xem Ngày Tốt Xấu`,
  description: () => `Tra cứu lịch vạn niên và âm lịch tháng ${monthData.value.month}/${monthData.value.year}. Xem tổng hợp ngày hoàng đạo tốt, ngày hắc đạo, các ngày lễ lớn trong tháng.`
})
</script>

<template>
  <div class="space-y-10 pt-2">
    <!-- 2-Column Hero Layout matching Home and Day pages -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <!-- Blank Left Column (Col-span-5) to prevent jumping shift when selecting a day -->
      <div class="lg:col-span-5 flex flex-col justify-center">
        <div class="glass-panel rounded-3xl p-8 border border-slate-200 border-dashed text-slate-400 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto opacity-40 mb-3 text-slate-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 15.172a8.959 8.959 0 00-9.75-9.75M11.25 11.25l.041-.02a.75.75 0 11.026.04l-.067-.02z" />
          </svg>
          <h3 class="font-bold text-slate-700 text-base mb-1">Tra cứu ngày chi tiết</h3>
          <p class="text-xs max-w-[240px] leading-relaxed">
            Chọn một ngày bất kỳ từ bảng lịch tháng bên phải để xem luận giải phong thủy chi tiết.
          </p>
        </div>
      </div>

      <!-- Monthly Calendar Grid (Right 7 columns) -->
      <div class="lg:col-span-7 flex flex-col">
        <div class="flex-grow">
          <CalendarGrid 
            :active-date="activeDate" 
            @change-view="handleGridChange"
            @select-date="handleSelectDate"
          />
        </div>
      </div>
    </div>

    <!-- Good / Bad Days and Holidays Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Good & Bad Days (Left 7 columns) -->
      <div class="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-200 space-y-6">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span class="w-1 h-5 bg-amber-500 rounded-full"></span>
          Đánh Giá Ngày Tốt & Xấu Trong Tháng {{ monthData.month }}/{{ monthData.year }}
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <!-- Good days (Hoàng Đạo) -->
          <div class="space-y-3">
            <h4 class="font-bold text-emerald-600 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Ngày Hoàng Đạo (Tốt lành)
            </h4>
            <div class="max-h-[300px] overflow-y-auto pr-2 space-y-2">
              <NuxtLink 
                v-for="day in hoangDaoDays" 
                :key="day.solarDay"
                :to="`/ngay/${day.solarYear}-${String(day.solarMonth).padStart(2, '0')}-${String(day.solarDay).padStart(2, '0')}`"
                class="block p-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl transition-all"
              >
                <div class="font-semibold text-slate-800">
                  Dương: {{ day.solarDay }}/{{ day.solarMonth }} - {{ day.dayOfWeek }}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  Âm: {{ day.lunarDay }}/{{ day.lunarMonth }} (Ngày {{ day.dayCanChi }})
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Bad days (Hắc Đạo) -->
          <div class="space-y-3">
            <h4 class="font-bold text-rose-600 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Ngày Hắc Đạo (Cần thận trọng)
            </h4>
            <div class="max-h-[300px] overflow-y-auto pr-2 space-y-2">
              <NuxtLink 
                v-for="day in hacDaoDays" 
                :key="day.solarDay"
                :to="`/ngay/${day.solarYear}-${String(day.solarMonth).padStart(2, '0')}-${String(day.solarDay).padStart(2, '0')}`"
                class="block p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all"
              >
                <div class="font-semibold text-slate-700">
                  Dương: {{ day.solarDay }}/{{ day.solarMonth }} - {{ day.dayOfWeek }}
                </div>
                <div class="text-xs text-slate-400 mt-0.5">
                  Âm: {{ day.lunarDay }}/{{ day.lunarMonth }} (Ngày {{ day.dayCanChi }})
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Holidays in the month (Right 5 columns) -->
      <div class="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-200 flex flex-col">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <span class="w-1 h-5 bg-red-500 rounded-full"></span>
          Ngày Lễ & Sự Kiện Trong Tháng
        </h3>
        
        <div v-if="holidaysInMonth.length > 0" class="space-y-3 flex-grow max-h-[360px] overflow-y-auto pr-2">
          <div 
            v-for="h in holidaysInMonth" 
            :key="h.name" 
            class="flex items-start gap-3 p-3 bg-slate-100/50 border border-slate-200 rounded-xl"
          >
            <span class="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 font-bold text-sm flex items-center justify-center font-mono">
              {{ String(h.day).padStart(2, '0') }}
            </span>
            <div>
              <h4 class="font-bold text-sm text-slate-800 leading-snug">{{ h.name }}</h4>
              <span class="text-[10px] text-slate-400 mt-0.5 block">{{ h.dateStr }}</span>
            </div>
          </div>
        </div>

        <div v-else class="text-slate-400 text-sm flex-grow flex items-center justify-center py-10 border border-dashed border-slate-200 rounded-xl">
          Không có sự kiện lớn nào được liệt kê trong tháng này.
        </div>
      </div>

    </div>
  </div>
</template>
