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
          Luận giải chi tiết ngày {{ activeLunarInfo.solarDay }}/{{ activeLunarInfo.solarMonth }}/{{ activeLunarInfo.solarYear }}
        </h3>
        <p class="text-xs text-slate-400 mt-1">Nội dung giải luận lịch pháp phong thủy tham khảo</p>
      </div>

      <div class="space-y-4 text-[13.5px] sm:text-[14.5px] leading-relaxed text-slate-600">
        <!-- Đoạn 1: Dương lịch, âm lịch, can chi, cát hung -->
        <p>
          Đây là ngày <strong>{{ activeLunarInfo.solarDay }} tháng {{ activeLunarInfo.solarMonth }} năm {{ activeLunarInfo.solarYear }}</strong> dương lịch, 
          tức ngày <strong>{{ activeLunarInfo.lunarDay }} tháng {{ activeLunarInfo.lunarMonth }}</strong> âm lịch (ngày {{ activeLunarInfo.monthName }}), 
          thuộc ngày <strong>{{ activeLunarInfo.dayCanChi }}</strong>, tháng <strong>{{ activeLunarInfo.monthCanChi }}</strong>, năm <strong>{{ activeLunarInfo.yearCanChi }}</strong>. 
          Đây cũng là ngày <strong>{{ activeLunarInfo.dayType.toLowerCase() }}</strong>, 
          <span v-if="activeLunarInfo.isHoangDao">quý bản mệnh nên ưu tiên tiến hành các công việc quan trọng như khởi công, động thổ, ký kết hay cưới hỏi để thu hút cát khí tốt lành.</span>
          <span v-else-if="activeLunarInfo.isHacDao">quý bản mệnh nên hạn chế thực hiện các giao dịch lớn, khai trương hay các việc đại sự để phòng tránh trắc trở phát sinh.</span>
          <span v-else>quý bản mệnh có thể tiến hành các công việc thường nhật và giao dịch nhỏ một cách bình hòa và suôn sẻ.</span>
        </p>

        <!-- Đoạn 2 (Nếu có ngày lễ/sự kiện): Mô tả sự kiện -->
        <p v-if="activeLunarInfo.holidayParagraph" class="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-xl text-rose-800 font-medium">
          {{ activeLunarInfo.holidayParagraph }}
        </p>

        <!-- Đoạn 3: Tiết khí và mô tả hoàn chỉnh -->
        <p>
          {{ activeLunarInfo.tietKhiParagraph }}
        </p>
        
        <!-- Đoạn 4: Giờ hoàng đạo và dẫn dắt -->
        <p>
          Giờ hoàng đạo trong ngày này bao gồm: 
          <strong class="text-amber-700">
            {{ activeLunarInfo.hoangDaoList.map(h => `${h.chiName} (${h.range})`).join(', ') }}
          </strong>. 
          Quý bản mệnh chú ý lựa chọn để mọi công việc hanh thông và viên mãn.
        </p>
      </div>
    </div>
  </div>
</template>
