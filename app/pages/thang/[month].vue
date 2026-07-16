<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLunarDayInfo, solarHolidays, lunarHolidays } from '~/utils/lunar'

const route = useRoute()
const router = useRouter()

const todayState = useState('today-state', () => new Date())
const activeTab = ref('good')

onMounted(() => {
  todayState.value = new Date()
})

// Parse route param: yyyy-mm
const monthData = computed(() => {
  const monthStr = route.params.month
  let year = todayState.value.getFullYear()
  let month = todayState.value.getMonth() + 1 // 1-indexed
  
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
</script><template>
  <div class="space-y-6 pt-2">
    <!-- 2-Column Layout matching Home and Day pages -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <!-- Left Column (Col-span-5) - Tabbed Day Summary to prevent scrolling -->
      <div class="lg:col-span-5 flex flex-col order-2 lg:order-1">
        <div class="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 h-full flex flex-col min-h-[440px]">
          <!-- Title -->
          <div class="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span class="w-1.5 h-5 bg-amber-500 rounded-full"></span>
              Tổng quan tháng {{ monthData.month }}/{{ monthData.year }}
            </h3>
          </div>

          <!-- Tabs Header -->
          <div class="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 text-xs font-bold w-full shrink-0">
            <button 
              @click="activeTab = 'good'"
              class="flex-1 py-2 rounded-lg transition-all"
              :class="activeTab === 'good' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
            >
              Ngày Tốt
            </button>
            <button 
              @click="activeTab = 'bad'"
              class="flex-1 py-2 rounded-lg transition-all"
              :class="activeTab === 'bad' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
            >
              Ngày Xấu
            </button>
            <button 
              @click="activeTab = 'holiday'"
              class="flex-1 py-2 rounded-lg transition-all"
              :class="activeTab === 'holiday' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
            >
              Ngày Lễ ({{ holidaysInMonth.length }})
            </button>
          </div>

          <!-- Tabs Body (Uses flex-grow and overflow-y-auto to avoid page scroll) -->
          <div class="flex-grow overflow-hidden relative min-h-[280px]">
            
            <!-- Ngày Hoàng Đạo Tab -->
            <div v-show="activeTab === 'good'" class="absolute inset-0 overflow-y-auto pr-1 space-y-3">
              <p class="text-[11.5px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/10 leading-relaxed shrink-0">
                <strong>Ngày Hoàng Đạo:</strong> Là ngày cát lành có sao tốt hộ trì, thích hợp tiến hành đại sự như cưới hỏi, khởi công, khai trương để thuận lợi cát tường.
              </p>
              <div class="grid grid-cols-2 gap-2">
                <NuxtLink 
                  v-for="day in hoangDaoDays" 
                  :key="day.solarDay"
                  :to="`/ngay/${day.solarYear}-${String(day.solarMonth).padStart(2, '0')}-${String(day.solarDay).padStart(2, '0')}`"
                  class="block p-2 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-emerald-500/10 rounded-xl transition-all"
                >
                  <div class="flex items-center justify-between gap-1 flex-wrap">
                    <span class="font-bold text-xs text-slate-800 dark:text-slate-200">Dương: {{ day.solarDay }}/{{ day.solarMonth }}</span>
                    <span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/50 dark:bg-emerald-950/60 px-1 py-0.5 rounded shrink-0">
                      {{ day.dayOfWeek }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                    Âm: {{ day.lunarDay }}/{{ day.lunarMonth }} ({{ day.dayCanChi }})
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- Ngày Hắc Đạo Tab -->
            <div v-show="activeTab === 'bad'" class="absolute inset-0 overflow-y-auto pr-1 space-y-3">
              <p class="text-[11.5px] text-rose-800 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/10 leading-relaxed shrink-0">
                <strong>Ngày Hắc Đạo:</strong> Là ngày chịu sự chi phối của hung tinh. Tránh khởi sự các công việc quan trọng, chỉ nên làm việc thường nhật để tránh trắc trở.
              </p>
              <div class="grid grid-cols-2 gap-2">
                <NuxtLink 
                  v-for="day in hacDaoDays" 
                  :key="day.solarDay"
                  :to="`/ngay/${day.solarYear}-${String(day.solarMonth).padStart(2, '0')}-${String(day.solarDay).padStart(2, '0')}`"
                  class="block p-2 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
                >
                  <div class="flex items-center justify-between gap-1 flex-wrap">
                    <span class="font-bold text-xs text-slate-700 dark:text-slate-200">Dương: {{ day.solarDay }}/{{ day.solarMonth }}</span>
                    <span class="text-[9px] text-rose-600 dark:text-rose-400 font-bold bg-rose-100/50 dark:bg-rose-950/60 px-1 py-0.5 rounded shrink-0">
                      {{ day.dayOfWeek }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                    Âm: {{ day.lunarDay }}/{{ day.lunarMonth }} ({{ day.dayCanChi }})
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- Ngày Lễ Tab -->
            <div v-show="activeTab === 'holiday'" class="absolute inset-0 overflow-y-auto pr-1 space-y-3">
              <p class="text-[11.5px] text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/10 leading-relaxed shrink-0">
                <strong>Ngày Lễ & Kỷ Niệm:</strong> Các ngày Tết cổ truyền, ngày lễ truyền thống hoặc ngày kỷ niệm quốc tế nổi bật diễn ra trong tháng.
              </p>
              <div v-if="holidaysInMonth.length > 0" class="space-y-2">
                <div 
                  v-for="h in holidaysInMonth" 
                  :key="h.name" 
                  class="flex items-start gap-2.5 p-2 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <span class="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                    {{ String(h.day).padStart(2, '0') }}
                  </span>
                  <div>
                    <h4 class="font-bold text-xs text-slate-800 dark:text-slate-200 leading-snug">{{ h.name }}</h4>
                    <span class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block font-medium">{{ h.dateStr }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-slate-400 dark:text-slate-500 text-xs text-center py-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                Không có sự kiện lớn nào được liệt kê trong tháng này.
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Monthly Calendar Grid (Right 7 columns) -->
      <div class="lg:col-span-7 flex flex-col order-1 lg:order-2">
        <div class="flex-grow">
          <CalendarGrid 
            :active-date="activeDate" 
            :has-active-highlight="false"
            @change-view="handleGridChange"
            @select-date="handleSelectDate"
          />
        </div>
      </div>
    </div>
  </div>
</template>
