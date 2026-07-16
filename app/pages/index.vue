<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLunarDayInfo, convertLunar2Solar, convertSolar2Lunar, getYearCanChi, THANG } from '~/utils/lunar'

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
      const nhuan = res[3] === 1 ? ' (Nhuận)' : ''
      const canChiYear = getYearCanChi(res[2])
      const formattedDate = `${convYear.value}-${String(convMonth.value).padStart(2, '0')}-${String(convDay.value).padStart(2, '0')}`
      return {
        success: true,
        outputStr: `Âm lịch: Ngày ${res[0]} tháng ${THANG[res[1] - 1]}${nhuan} năm ${canChiYear}`,
        url: `/ngay/${formattedDate}`
      }
    } catch (e) {
      return { success: false, msg: 'Ngày dương lịch không hợp lệ' }
    }
  } else {
    try {
      const res = convertLunar2Solar(
        parseInt(convDay.value, 10),
        parseInt(convMonth.value, 10),
        parseInt(convYear.value, 10),
        0 // non-leap default for quick widget
      )
      if (res[0] === 0) return { success: false, msg: 'Ngày âm lịch không tồn tại.' }
      const formattedDate = `${res[2]}-${String(res[1]).padStart(2, '0')}-${String(res[0]).padStart(2, '0')}`
      return {
        success: true,
        outputStr: `Dương lịch: Ngày ${res[0]}/${res[1]}/${res[2]}`,
        url: `/ngay/${formattedDate}`
      }
    } catch (e) {
      return { success: false, msg: 'Ngày âm lịch không hợp lệ' }
    }
  }
})

// ================= COUNTDOWN DATA =================
const countdowns = computed(() => {
  const today = activeDate.value
  const currentYear = today.getFullYear()
  
  const lunarEvents = [
    { name: 'Tết Nguyên Đán (Mùng 1/1)', lDay: 1, lMonth: 1 },
    { name: 'Tết Nguyên tiêu (15/1)', lDay: 15, lMonth: 1 },
    { name: 'Giỗ Tổ Hùng Vương (10/3)', lDay: 10, lMonth: 3 },
    { name: 'Lễ Phật Đản (15/4)', lDay: 15, lMonth: 4 },
    { name: 'Tết Đoan Ngọ (5/5)', lDay: 5, lMonth: 5 },
    { name: 'Lễ Vu Lan (Rằm tháng 7)', lDay: 15, lMonth: 7 },
    { name: 'Tết Trung Thu (Rằm tháng 8)', lDay: 15, lMonth: 8 },
    { name: 'Tết Ông Táo (23/12)', lDay: 23, lMonth: 12 }
  ]

  const solarEvents = [
    { name: 'Tết Dương Lịch', sDay: 1, sMonth: 1 },
    { name: 'Lễ Tình Nhân (Valentine)', sDay: 14, sMonth: 2 },
    { name: 'Giải Phóng Miền Nam (30/4)', sDay: 30, sMonth: 4 },
    { name: 'Quốc Tế Lao Động (1/5)', sDay: 1, sMonth: 5 },
    { name: 'Quốc Khánh Việt Nam (2/9)', sDay: 2, sMonth: 9 },
    { name: 'Ngày Nhà Giáo Việt Nam (20/11)', sDay: 20, sMonth: 11 },
    { name: 'Lễ Giáng Sinh (25/12)', sDay: 25, sMonth: 12 }
  ]
  
  const results = []

  // Add Lunar countdowns
  lunarEvents.forEach(evt => {
    let solarDate = getSolarDateForLunar(evt.lDay, evt.lMonth, currentYear)
    if (solarDate < today) {
      solarDate = getSolarDateForLunar(evt.lDay, evt.lMonth, currentYear + 1)
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
  solarEvents.forEach(evt => {
    let solarDate = new Date(currentYear, evt.sMonth - 1, evt.sDay)
    if (solarDate < today) {
      solarDate = new Date(currentYear + 1, evt.sMonth - 1, evt.sDay)
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
    <div class="glass-panel rounded-3xl p-8 border border-slate-200 space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-amber-500 rounded-full"></span>
          Luận Giải Chi Tiết Ngày {{ activeLunarInfo.solarDay }}/{{ activeLunarInfo.solarMonth }}/{{ activeLunarInfo.solarYear }}
        </h3>
        <p class="text-xs text-slate-400 mt-1">Nội dung giải luận lịch pháp phong thủy tham khảo</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-600">
        <div class="space-y-4">
          <p>
            Ngày dương lịch là ngày <strong>{{ activeLunarInfo.solarDay }} tháng {{ activeLunarInfo.solarMonth }} năm {{ activeLunarInfo.solarYear }}</strong>. 
            Xét theo âm lịch, đây là ngày <strong>{{ activeLunarInfo.lunarDay }} tháng {{ activeLunarInfo.lunarMonth }}</strong> năm <strong>{{ activeLunarInfo.yearCanChi }}</strong>.
          </p>
          <p>
            Về mặt hệ thống Can Chi, ngày hôm nay là ngày <strong>{{ activeLunarInfo.dayCanChi }}</strong>. 
            Sự kết hợp giữa thiên can <strong>{{ activeLunarInfo.dayCanChi.split(' ')[0] }}</strong> và địa chi <strong>{{ activeLunarInfo.dayCanChi.split(' ')[1] }}</strong> mang đặc trưng ngũ hành riêng, hỗ trợ đắc lực khi xem tuổi hợp khắc và luận giải các cát tinh tốt lành.
          </p>
        </div>
        <div class="space-y-4">
          <h4 class="font-semibold text-slate-800 text-base">Khung giờ cát lành hành sự</h4>
          <p>
            Các khung giờ hoàng đạo thích hợp để khởi công, đi lại hay thực hiện các ký kết quan trọng trong ngày:
            <span class="block mt-2 font-semibold text-amber-600">
              {{ activeLunarInfo.hoangDaoList.map(h => `${h.chiName} (${h.range})`).join(', ') }}.
            </span>
            Lựa chọn giờ lành hoàng đạo sẽ giúp mọi sự hanh thông và đem lại kết quả viên mãn nhất cho quý gia chủ.
          </p>
        </div>
      </div>
    </div>

    <!-- SECTION 3: Widget đổi ngày âm dương nhanh (Theo đúng sơ đồ cấu trúc của người dùng) -->
    <div class="glass-panel rounded-3xl p-6 border border-slate-200 space-y-4">
      
      <!-- HÀNG 1: Tên Widget | Công tắc dương -> âm / âm -> dương -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">ĐỔI NGÀY ÂM DƯƠNG NHANH</h3>
        
        <!-- Switch Button Group -->
        <div class="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button 
            @click="isSolarToLunar = true" 
            class="px-3.5 py-1 rounded-md text-[11.5px] font-bold transition-all"
            :class="isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500'"
          >
            Dương → Âm
          </button>
          <button 
            @click="isSolarToLunar = false" 
            class="px-3.5 py-1 rounded-md text-[11.5px] font-bold transition-all"
            :class="!isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500'"
          >
            Âm → Dương
          </button>
        </div>
      </div>

      <!-- HÀNG 2: Ngày tháng năm đầu vào | Ngày tháng năm đầu ra | Nút xem Chi tiết -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <!-- Cột đầu vào (col-span-5) -->
        <div class="md:col-span-5 flex items-center gap-2">
          <div class="flex-1 relative">
            <label class="text-[11px] text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Ngày</label>
            <input 
              v-model.number="convDay" 
              list="conv-days"
              class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 custom-select"
            />
            <datalist id="conv-days">
              <option v-for="d in dayOptions" :key="d" :value="d" />
            </datalist>
          </div>
          <div class="flex-1 relative">
            <label class="text-[11px] text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Tháng</label>
            <input 
              v-model.number="convMonth" 
              list="conv-months"
              class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 custom-select"
            />
            <datalist id="conv-months">
              <option v-for="m in monthOptions" :key="m" :value="m">Tháng {{ m }}</option>
            </datalist>
          </div>
          <div class="flex-grow relative">
            <label class="text-[11px] text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Năm</label>
            <input 
              v-model.number="convYear" 
              list="conv-years"
              class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 custom-select"
            />
            <datalist id="conv-years">
              <option v-for="y in yearOptions" :key="y" :value="y">Năm {{ y }}</option>
            </datalist>
          </div>
        </div>

        <!-- Mũi tên ngăn cách trên Desktop (col-span-1) -->
        <div class="hidden md:flex justify-center text-slate-350 col-span-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>

        <!-- Cột đầu ra - Hiển thị kết quả trực tiếp tại chỗ (col-span-4) -->
        <div 
          class="md:col-span-4 bg-slate-50 rounded-xl p-3 border border-slate-200 min-h-[46px] flex items-center justify-start text-xs font-bold leading-snug"
          :class="convResult.success ? 'text-amber-700' : 'text-rose-500'"
        >
          {{ convResult.outputStr || convResult.msg }}
        </div>

        <!-- Nút xem Chi tiết (col-span-2) -->
        <div class="md:col-span-2">
          <NuxtLink 
            v-if="convResult.success"
            :to="convResult.url" 
            class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/10 text-center block"
          >
            Chi Tiết
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- SECTION 4: Đếm ngược các sự kiện tiếp theo -->
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span class="w-1 h-5 bg-red-500 rounded-full"></span>
        Sự kiện sắp tới
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="evt in countdowns.slice(0, 4)" 
          :key="evt.name" 
          class="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-200 flex flex-col justify-between"
        >
          <div>
            <span class="text-xs text-slate-400 block">Đếm ngược sự kiện</span>
            <h4 class="font-bold text-sm text-slate-700 mt-1 leading-snug">{{ evt.name }}</h4>
          </div>
          <div class="mt-4 flex items-baseline justify-between">
            <span class="text-2xl font-black text-amber-500">{{ evt.daysLeft }}</span>
            <span class="text-slate-400 text-[11.5px]">ngày {{ evt.solarStr }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
