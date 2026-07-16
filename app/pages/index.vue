<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLunarDayInfo, convertLunar2Solar, convertSolar2Lunar, getYearCanChi, THANG, solarHolidays, lunarHolidays } from '~/utils/lunar'

const router = useRouter()

// Use useState to share initial render dates between server and client
const activeDate = useState('active-date', () => new Date())
const todayState = useState('today-state', () => new Date())

// Get Lunar Info for the active date
const activeLunarInfo = computed(() => {
  return getLunarDayInfo(activeDate.value)
})

// Handle date selection from Grid
function handleSelectDate(date) {
  const today = new Date()
  const isSelectedToday = date.getDate() === today.getDate() &&
                         date.getMonth() === today.getMonth() &&
                         date.getFullYear() === today.getFullYear()
                         
  if (isSelectedToday) {
    activeDate.value = date
  } else {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    router.push(`/ngay/${y}-${m}-${d}`)
  }
}

function selectToday() {
  activeDate.value = new Date()
}

// ================= COMPACT CONVERTER WIDGET DATA =================
const isSolarToLunar = ref(true)
const convDay = ref(todayState.value.getDate())
const convMonth = ref(todayState.value.getMonth() + 1)
const convYear = ref(todayState.value.getFullYear())

onMounted(() => {
  activeDate.value = new Date()
  todayState.value = new Date()
  
  const today = new Date()
  convDay.value = today.getDate()
  convMonth.value = today.getMonth() + 1
  convYear.value = today.getFullYear()
})

const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
const yearOptions = Array.from({ length: 101 }, (_, i) => 1970 + i)

// Calculate result instantly using reactive computed properties
const convResult = computed(() => {
  if (isSolarToLunar.value) {
    try {
      const res = convertSolar2Lunar(
        parseInt(convDay.value, 10),
        parseInt(convMonth.value, 10),
        parseInt(convYear.value, 10)
      )
      const formattedDate = `${convYear.value}-${String(convMonth.value).padStart(2, '0')}-${String(convDay.value).padStart(2, '0')}`
      return {
        success: true,
        outDay: res[0],
        outMonth: res[1],
        outYear: res[2],
        isLeap: res[3] === 1,
        url: `/ngay/${formattedDate}`
      }
    } catch (e) {
      return { success: false, msg: 'Ngày dương không hợp lệ' }
    }
  } else {
    try {
      const res = convertLunar2Solar(
        parseInt(convDay.value, 10),
        parseInt(convMonth.value, 10),
        parseInt(convYear.value, 10),
        0 // non-leap default for quick widget
      )
      if (res[0] === 0) return { success: false, msg: 'Ngày âm không tồn tại.' }
      const formattedDate = `${res[2]}-${String(res[1]).padStart(2, '0')}-${String(res[0]).padStart(2, '0')}`
      return {
        success: true,
        outDay: res[0],
        outMonth: res[1],
        outYear: res[2],
        isLeap: false,
        url: `/ngay/${formattedDate}`
      }
    } catch (e) {
      return { success: false, msg: 'Ngày âm không hợp lệ' }
    }
  }
})

// ================= COUNTDOWN DATA =================
const countdowns = computed(() => {
  const today = activeDate.value
  const currentYear = today.getFullYear()
  
  const results = []

  // Add Lunar countdowns
  lunarHolidays.forEach(evt => {
    let solarDate = getSolarDateForLunar(evt.day, evt.month, currentYear)
    if (solarDate < today) {
      solarDate = getSolarDateForLunar(evt.day, evt.month, currentYear + 1)
    }
    const timeDiff = solarDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
    results.push({
      name: evt.name,
      daysLeft,
      solarStr: `${solarDate.getDate()}/${solarDate.getMonth() + 1}/${solarDate.getFullYear()}`
    })
  })

  // Add Solar countdowns
  solarHolidays.forEach(evt => {
    let solarDate = new Date(currentYear, evt.month - 1, evt.day)
    if (solarDate < today) {
      solarDate = new Date(currentYear + 1, evt.month - 1, evt.day)
    }
    const timeDiff = solarDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
    results.push({
      name: evt.name,
      daysLeft,
      solarStr: `${solarDate.getDate()}/${solarDate.getMonth() + 1}/${solarDate.getFullYear()}`
    })
  })
  
  return results.sort((a, b) => a.daysLeft - b.daysLeft)
})

function getSolarDateForLunar(lDay, lMonth, sYear) {
  const solar = convertLunar2Solar(lDay, lMonth, sYear, 0)
  return new Date(solar[2], solar[1] - 1, solar[0])
}

useSeoMeta({
  title: 'Xem lịch hôm nay - Lịch Âm Dương Vạn Niên',
  description: 'Tra cứu lịch âm dương hôm nay chính xác nhất, xem ngày hoàng đạo, giờ tốt lành phong thủy và chuyển đổi ngày âm dương nhanh.'
})
</script>

<template>
  <div class="space-y-10">
    <!-- SECTION 1: Hero Section (Block Lịch + Lưới Lịch Tháng) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
      <!-- Calendar Day Block (Left 5 columns) -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="flex-grow">
          <CalendarBlock :info="activeLunarInfo" @go-today="selectToday" />
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

    <!-- SECTION 2: Thông tin luận giải chi tiết (Nội dung SEO) -->
    <div class="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
      <div class="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-amber-500 rounded-full"></span>
          Luận giải chi tiết ngày {{ activeLunarInfo.solarDay }}/{{ activeLunarInfo.solarMonth }}/{{ activeLunarInfo.solarYear }}
        </h3>
        <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Nội dung giải luận lịch pháp phong thủy tham khảo</p>
      </div>

      <div class="space-y-4 text-[13.5px] sm:text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          Đây là ngày <strong>{{ activeLunarInfo.solarDay }} tháng {{ activeLunarInfo.solarMonth }} năm {{ activeLunarInfo.solarYear }}</strong> dương lịch, 
          tức ngày <strong>{{ activeLunarInfo.lunarDay }} tháng {{ activeLunarInfo.lunarMonth }}</strong> âm lịch (ngày {{ activeLunarInfo.monthName }}), 
          thuộc ngày <strong>{{ activeLunarInfo.dayCanChi }}</strong>, tháng <strong>{{ activeLunarInfo.monthCanChi }}</strong>, năm <strong>{{ activeLunarInfo.yearCanChi }}</strong>. 
          Đây cũng là ngày <strong>{{ activeLunarInfo.dayType.toLowerCase() }}</strong>, 
          <span v-if="activeLunarInfo.isHoangDao">quý bản mệnh nên ưu tiên tiến hành các công việc quan trọng như khởi công, động thổ, ký kết hay cưới hỏi để thu hút cát khí tốt lành.</span>
          <span v-else-if="activeLunarInfo.isHacDao">quý bản mệnh nên hạn chế thực hiện các giao dịch lớn, khai trương hay các việc đại sự để phòng tránh trắc trở phát sinh.</span>
          <span v-else>quý bản mệnh có thể tiến hành các công việc thường nhật và giao dịch nhỏ một cách bình hòa và suôn sẻ.</span>
        </p>

        <p v-if="activeLunarInfo.holidayParagraph" class="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-3.5 rounded-r-xl text-rose-800 dark:text-rose-300 font-medium">
          {{ activeLunarInfo.holidayParagraph }}
        </p>

        <p>
          {{ activeLunarInfo.tietKhiParagraph }}
        </p>
        
        <p>
          Giờ hoàng đạo trong ngày này bao gồm: 
          <strong class="text-amber-700 dark:text-amber-400">
            {{ activeLunarInfo.hoangDaoList.map(h => `${h.chiName} (${h.range})`).join(', ') }}
          </strong>. 
          Quý bản mệnh chú ý lựa chọn để mọi công việc hanh thông và viên mãn.
        </p>
      </div>
    </div>

    <!-- SECTION 3: Widget đổi ngày âm dương nhanh (Đầu vào, Đầu ra, Nút Chi tiết trên 1 hàng ngang) -->
    <div class="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
      
      <!-- HÀNG 1: Tên Widget | Công tắc dương -> âm / âm -> dương -->
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h3 class="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-wide">Đổi ngày âm dương nhanh</h3>
        
        <!-- Switch Button Group -->
        <div class="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button 
            @click="isSolarToLunar = true" 
            class="px-3 py-1 rounded-md text-[11px] font-bold transition-all"
            :class="isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400'"
          >
            Dương lịch → Âm lịch
          </button>
          <button 
            @click="isSolarToLunar = false" 
            class="px-3 py-1 rounded-md text-[11px] font-bold transition-all"
            :class="!isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400'"
          >
            Âm lịch → Dương lịch
          </button>
        </div>
      </div>

      <!-- HÀNG 2: Đầu vào, Đầu ra và Nút Chi tiết trên cùng 1 hàng ngang -->
      <div class="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
        
        <!-- Tổ hợp Đầu vào + Mũi tên + Đầu ra -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto justify-center xl:justify-start">
          
          <!-- Cụm Đầu vào -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Ngày -->
            <div class="flex items-center gap-1">
              <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">Ngày</span>
              <input 
                v-model.number="convDay" 
                list="conv-days"
                class="w-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <!-- Tháng -->
            <div class="flex items-center gap-1">
              <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">Tháng</span>
              <input 
                v-model.number="convMonth" 
                list="conv-months"
                class="w-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <!-- Năm -->
            <div class="flex items-center gap-1">
              <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">Năm</span>
              <input 
                v-model.number="convYear" 
                list="conv-years"
                class="w-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <!-- Mũi tên kết nối -->
          <div class="hidden sm:block text-slate-300 dark:text-slate-700 shrink-0 mx-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>

          <!-- Cụm Đầu ra (Các ô hiển thị kết quả) -->
          <div v-if="convResult.success" class="flex items-center gap-2 shrink-0">
            <!-- Ngày -->
            <div class="flex items-center gap-1">
              <span class="text-sm text-slate-400 dark:text-slate-500 font-medium">Ngày</span>
              <input 
                readonly 
                :value="String(convResult.outDay).padStart(2, '0')"
                class="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-base font-black text-center text-amber-600 dark:text-amber-500 focus:outline-none cursor-default"
              />
            </div>
            <!-- Tháng -->
            <div class="flex items-center gap-1">
              <span class="text-sm text-slate-400 dark:text-slate-500 font-medium">Tháng</span>
              <input 
                readonly 
                :value="String(convResult.outMonth).padStart(2, '0')"
                class="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-base font-black text-center text-amber-600 dark:text-amber-500 focus:outline-none cursor-default"
              />
            </div>
            <!-- Năm -->
            <div class="flex items-center gap-1">
              <span class="text-sm text-slate-400 dark:text-slate-500 font-medium">Năm</span>
              <input 
                readonly 
                :value="convResult.outYear"
                class="w-20 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-base font-black text-center text-amber-600 dark:text-amber-500 focus:outline-none cursor-default"
              />
            </div>
            <span v-if="convResult.isLeap" class="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded ml-1">
              Nhuận
            </span>
          </div>
          <div v-else class="text-sm font-bold text-rose-500">
            {{ convResult.msg }}
          </div>
        </div>

        <!-- Nút Xem Chi Tiết -->
        <div class="shrink-0 w-full xl:w-auto">
          <NuxtLink 
            v-if="convResult.success"
            :to="convResult.url" 
            class="w-full xl:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 font-bold px-6 py-2 rounded-xl text-sm transition-all shadow-md shadow-amber-500/10 text-center block"
          >
            Chi Tiết
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- SECTION 4: Đếm ngược các sự kiện tiếp theo -->
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <span class="w-1 h-5 bg-red-500 rounded-full"></span>
        Sự kiện sắp tới
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="evt in countdowns.slice(0, 4)" 
          :key="evt.name" 
          class="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <!-- Tên ngày lễ/sự kiện (chữ vừa in đậm) -->
            <h4 class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-snug">{{ evt.name }}</h4>
            <!-- Ngày dương lịch (chữ nhỏ) -->
            <span class="text-[11.5px] text-slate-400 dark:text-slate-500 block mt-1">Dương lịch: {{ evt.solarStr }}</span>
          </div>
          <!-- Còn N ngày. (N chữ lớn màu vàng) -->
          <div class="mt-4 flex items-baseline gap-1.5 text-slate-600 dark:text-slate-400 text-sm font-bold">
            <span>Còn</span>
            <span class="text-3xl font-black text-amber-500 leading-none">{{ evt.daysLeft }}</span>
            <span>ngày.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>