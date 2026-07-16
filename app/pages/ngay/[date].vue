<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLunarDayInfo } from '~/utils/lunar'

const route = useRoute()
const router = useRouter()

const todayState = useState('today-state', () => new Date())

onMounted(() => {
  todayState.value = new Date()
})

// Parse route date parameter (format: yyyy-mm-dd)
const activeDate = computed(() => {
  const dateStr = route.params.date
  if (!dateStr) return todayState.value
  
  try {
    const parts = dateStr.split('-')
    if (parts.length !== 3) return todayState.value
    
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    
    const date = new Date(year, month, day)
    // Check if valid date
    if (isNaN(date.getTime())) return todayState.value
    return date
  } catch (e) {
    return todayState.value
  }
})

// Get lunar day info
const activeLunarInfo = computed(() => {
  return getLunarDayInfo(activeDate.value)
})

// Format Date back to YYYY-MM-DD
function formatDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Emitted date selection from Grid
function handleSelectDate(newDate) {
  router.push(`/ngay/${formatDateStr(newDate)}`)
}
</script>

<template>
  <div class="space-y-10 pt-2">
    <!-- Calendar View (Aligned exactly with the homepage to prevent layout shift) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Calendar Day Block (Left 5 columns) -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="flex-grow">
          <CalendarBlock :info="activeLunarInfo" @go-today="router.push('/')" />
        </div>
      </div>

      <!-- Calendar Month Grid (Right 7 columns) -->
      <div class="lg:col-span-7 flex flex-col">
        <div class="flex-grow">
          <CalendarGrid 
            :active-date="activeDate" 
            @select-date="handleSelectDate" 
          />
        </div>
      </div>
    </div>

    <!-- SEO Content Section -->
    <div class="glass-panel rounded-3xl p-8 border border-slate-200 space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-amber-500 rounded-full"></span>
          Luận Giải Chi Tiết Ngày {{ activeLunarInfo.solarDay }}/{{ activeLunarInfo.solarMonth }}/{{ activeLunarInfo.solarYear }}
        </h3>
        <p class="text-xs text-slate-400 mt-1">Thông tin luận giải lịch pháp phong thủy theo can chi</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-600">
        <div class="space-y-4">
          <p>
            Ngày dương lịch là ngày <strong>{{ activeLunarInfo.solarDay }} tháng {{ activeLunarInfo.solarMonth }} năm {{ activeLunarInfo.solarYear }}</strong>. 
            Ngày âm lịch tương ứng là ngày <strong>{{ activeLunarInfo.lunarDay }} tháng {{ activeLunarInfo.lunarMonth }}</strong> năm <strong>{{ activeLunarInfo.yearCanChi }}</strong>.
          </p>
          <p>
            Đây là ngày <strong>{{ activeLunarInfo.dayCanChi }}</strong>. 
            Mặt Can Chi phản ánh quy luật vận hành của ngũ hành trong ngày, cụ thể là sự phối hợp thiên can <strong>{{ activeLunarInfo.dayCanChi.split(' ')[0] }}</strong> và địa chi <strong>{{ activeLunarInfo.dayCanChi.split(' ')[1] }}</strong>.
          </p>
        </div>
        <div class="space-y-4">
          <h4 class="font-semibold text-slate-800 text-base">Xem giờ lành hành sự (Giờ Hoàng Đạo)</h4>
          <p>
            Trong ngày hôm nay, các khung giờ hoàng đạo cát lợi bao gồm:
            <span class="block mt-2 font-semibold text-amber-600">
              {{ activeLunarInfo.hoangDaoList.map(h => `${h.chiName} (${h.range})`).join(', ') }}.
            </span>
            Khi thực hiện công việc trọng đại, quý bản mệnh nên cân nhắc chọn các khung giờ này để gặp nhiều may mắn và suôn sẻ.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
