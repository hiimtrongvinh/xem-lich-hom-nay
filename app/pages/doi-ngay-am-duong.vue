<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { convertSolar2Lunar, convertLunar2Solar, getYearCanChi, THANG, getLunarDayInfo } from '~/utils/lunar'

const router = useRouter()

const isSolarToLunar = ref(true)

const todayState = useState('today-state', () => new Date())

// Solar Inputs
const solarDay = ref(todayState.value.getDate())
const solarMonth = ref(todayState.value.getMonth() + 1)
const solarYear = ref(todayState.value.getFullYear())

// Lunar Inputs
const lunarDay = ref(15)
const lunarMonth = ref(8)
const lunarYear = ref(todayState.value.getFullYear())
const lunarLeap = ref(false)

onMounted(() => {
  todayState.value = new Date()
  
  const today = new Date()
  solarDay.value = today.getDate()
  solarMonth.value = today.getMonth() + 1
  solarYear.value = today.getFullYear()
  lunarYear.value = today.getFullYear()
})

// Options arrays
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
const yearOptions = Array.from({ length: 101 }, (_, i) => 1970 + i) // 1970 to 2070

// Get resulting Solar Date from inputs
const targetSolarDate = computed(() => {
  if (isSolarToLunar.value) {
    const d = parseInt(solarDay.value, 10)
    const m = parseInt(solarMonth.value, 10) - 1
    const y = parseInt(solarYear.value, 10)
    const date = new Date(y, m, d)
    if (isNaN(date.getTime())) return null
    return date
  } else {
    // Convert Lunar to Solar
    const leapVal = lunarLeap.value ? 1 : 0
    const res = convertLunar2Solar(
      parseInt(lunarDay.value, 10),
      parseInt(lunarMonth.value, 10),
      parseInt(lunarYear.value, 10),
      leapVal
    )
    if (res[0] === 0) return null
    return new Date(res[2], res[1] - 1, res[0])
  }
})

// Lunar Info for target date
const targetLunarInfo = computed(() => {
  if (!targetSolarDate.value) return null
  return getLunarDayInfo(targetSolarDate.value)
})

// Result computed
const conversionResult = computed(() => {
  if (!targetSolarDate.value || !targetLunarInfo.value) {
    return { success: false, msg: 'Ngày đã chọn không hợp lệ hoặc không tồn tại.' }
  }

  const info = targetLunarInfo.value
  
  if (isSolarToLunar.value) {
    const nhuan = info.isLeap ? ' (Nhuận)' : ''
    return {
      success: true,
      inputStr: `Dương lịch: Ngày ${solarDay.value}/${solarMonth.value}/${solarYear.value}`,
      outputStr: `Âm lịch: Ngày ${info.lunarDay} tháng ${THANG[info.lunarMonth - 1]}${nhuan} năm ${info.yearCanChi} (${info.lunarYear})`,
      formattedDate: `${info.solarYear}-${String(info.solarMonth).padStart(2, '0')}-${String(info.solarDay).padStart(2, '0')}`
    }
  } else {
    const nhuan = lunarLeap.value ? ' (Nhuận)' : ''
    return {
      success: true,
      inputStr: `Âm lịch: Ngày ${lunarDay.value} tháng ${THANG[lunarMonth.value - 1]}${nhuan} năm ${getYearCanChi(lunarYear.value)} (${lunarYear.value})`,
      outputStr: `Dương lịch: Ngày ${info.solarDay} tháng ${info.solarMonth} năm ${info.solarYear}`,
      formattedDate: `${info.solarYear}-${String(info.solarMonth).padStart(2, '0')}-${String(info.solarDay).padStart(2, '0')}`
    }
  }
})

useSeoMeta({
  title: 'Đổi Ngày Âm Dương - Lịch Vạn Niên Vệ Tinh',
  description: 'Công cụ chuyển đổi ngày dương lịch sang ngày âm lịch và ngược lại nhanh chóng, chính xác bằng thuật toán JS.'
})
</script>

<template>
  <div class="space-y-10 pt-2">
    <!-- Switch and Input panel layout (Left: Day Block col-span-5, Right: Converter col-span-7) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <!-- Calendar Day Block (Left 5 columns) - Shifted to bottom on mobile -->
      <div class="lg:col-span-5 flex flex-col order-2 lg:order-1">
        <div class="flex-grow">
          <div v-if="targetLunarInfo" class="h-full">
            <CalendarBlock :info="targetLunarInfo" @go-today="router.push('/')" />
          </div>
          <div v-else class="glass-panel rounded-3xl p-10 border border-slate-200 border-dashed text-slate-450 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto opacity-40 mb-3 text-slate-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h3 class="font-bold text-slate-700 text-base mb-1">Chưa có thông tin ngày</h3>
            <p class="text-xs max-w-[220px] leading-relaxed">
              Vui lòng nhập ngày tháng năm ở bảng bên cạnh để xem luận giải chi tiết.
            </p>
          </div>
        </div>
      </div>

      <!-- Input Panel / Conversion Tool (Right 7 columns) - Displayed first on mobile -->
      <div class="lg:col-span-7 flex flex-col order-1 lg:order-2">
        <div class="glass-panel rounded-3xl p-6 shadow-xl border border-slate-200 h-full flex flex-col justify-between space-y-6">
          
          <!-- HÀNG 1: Tiêu đề Widget & Mô tả ngắn -->
          <div>
            <h2 class="text-xl font-bold text-slate-900 leading-tight">Công Cụ Đổi Ngày Âm Dương</h2>
            <p class="text-slate-500 text-xs mt-1">Chuyển đổi qua lại giữa lịch âm và lịch dương cực kỳ nhanh chóng kèm thông tin chi tiết</p>
          </div>

          <!-- HÀNG 2: Công tắc chuyển đổi Dương -> Âm / Âm -> Dương -->
          <div class="flex justify-start">
            <div class="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex gap-1 w-full max-w-xs">
              <button 
                @click="isSolarToLunar = true"
                class="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all"
                :class="isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
              >
                Dương → Âm
              </button>
              <button 
                @click="isSolarToLunar = false"
                class="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all"
                :class="!isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
              >
                Âm → Dương
              </button>
            </div>
          </div>

          <!-- HÀNG 3: Nhập ngày đầu vào -->
          <div class="space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-[12.5px] font-bold text-slate-500 tracking-wider">Nhập ngày cần chuyển đổi</span>
              
              <!-- Leap Month Checkbox (Moved next to Nhập ngày header) -->
              <div v-if="!isSolarToLunar" class="flex items-center gap-1.5">
                <input 
                  type="checkbox" 
                  id="lunar-leap-chk" 
                  v-model="lunarLeap" 
                  class="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 bg-slate-100 border-slate-200"
                />
                <label for="lunar-leap-chk" class="text-[11.5px] text-slate-500 select-none cursor-pointer font-bold">
                  Tháng nhuận âm lịch
                </label>
              </div>
            </div>
            
            <!-- Solar Inputs -->
            <div v-if="isSolarToLunar" class="grid grid-cols-3 gap-3">
              <div class="space-y-1 relative">
                <label class="text-[11.5px] text-slate-400 font-bold block tracking-wider">Ngày dương</label>
                <input v-model.number="solarDay" list="solar-days" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none text-xs font-semibold custom-select" />
                <datalist id="solar-days">
                  <option v-for="d in dayOptions" :key="d" :value="d" />
                </datalist>
              </div>
              <div class="space-y-1 relative">
                <label class="text-[11.5px] text-slate-400 font-bold block tracking-wider">Tháng dương</label>
                <input v-model.number="solarMonth" list="solar-months" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none text-xs font-semibold custom-select" />
                <datalist id="solar-months">
                  <option v-for="m in monthOptions" :key="m" :value="m">Tháng {{ m }}</option>
                </datalist>
              </div>
              <div class="space-y-1 relative">
                <label class="text-[11.5px] text-slate-400 font-bold block tracking-wider">Năm dương</label>
                <input v-model.number="solarYear" list="solar-years" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none text-xs font-semibold custom-select" />
                <datalist id="solar-years">
                  <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
                </datalist>
              </div>
            </div>

            <!-- Lunar Inputs -->
            <div v-else class="space-y-3">
              <div class="grid grid-cols-3 gap-3">
                <div class="space-y-1 relative">
                  <label class="text-[11.5px] text-slate-400 font-bold block tracking-wider">Ngày âm</label>
                  <input v-model.number="lunarDay" list="lunar-days" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none text-xs font-semibold custom-select" />
                  <datalist id="lunar-days">
                    <option v-for="d in dayOptions.slice(0, 30)" :key="d" :value="d" />
                  </datalist>
                </div>
                <div class="space-y-1 relative">
                  <label class="text-[11.5px] text-slate-400 font-bold block tracking-wider">Tháng âm</label>
                  <input v-model.number="lunarMonth" list="lunar-months" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none text-xs font-semibold custom-select" />
                  <datalist id="lunar-months">
                    <option v-for="m in monthOptions" :key="m" :value="m">Tháng {{ THANG[m - 1] }}</option>
                  </datalist>
                </div>
                <div class="space-y-1 relative">
                  <label class="text-[11.5px] text-slate-400 font-bold block tracking-wider">Năm âm</label>
                  <input v-model.number="lunarYear" list="lunar-years" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none text-xs font-semibold custom-select" />
                  <datalist id="lunar-years">
                    <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          <!-- HÀNG 4: Kết quả đầu ra với Nút Xem Chi Tiết -->
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span class="text-[12.5px] font-bold text-slate-500 tracking-wider block mb-1">Tổng quan kết quả</span>
              <div v-if="conversionResult.success" class="space-y-1">
                <span class="text-xs text-slate-400 block leading-tight">{{ conversionResult.inputStr }}</span>
                <div class="text-base sm:text-lg font-extrabold text-amber-600 leading-snug">
                  {{ conversionResult.outputStr }}
                </div>
              </div>
              <div class="text-red-500 text-sm font-semibold" v-else>
                {{ conversionResult.msg }}
              </div>
            </div>
            
            <div v-if="conversionResult.success" class="shrink-0 w-full sm:w-auto">
              <NuxtLink 
                :to="`/ngay/${conversionResult.formattedDate}`" 
                class="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/10 text-center block"
              >
                Xem Lịch Ngày
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Interpretation right below the converter widgets -->
    <div v-if="targetLunarInfo && conversionResult.success" class="glass-panel rounded-3xl p-8 border border-slate-200 space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-amber-500 rounded-full"></span>
          Luận Giải Ngày Đã Chuyển Đổi ({{ targetLunarInfo.solarDay }}/{{ targetLunarInfo.solarMonth }}/{{ targetLunarInfo.solarYear }})
        </h3>
        <p class="text-xs text-slate-400 mt-1">Nội dung chi tiết luận đoán phong thủy ngày âm dương</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-600">
        <div class="space-y-4">
          <p>
            Ngày dương lịch là ngày <strong>{{ targetLunarInfo.solarDay }}/{{ targetLunarInfo.solarMonth }}/{{ targetLunarInfo.solarYear }}</strong>. 
            Ngày âm lịch tương ứng: Ngày <strong>{{ targetLunarInfo.lunarDay }} tháng {{ targetLunarInfo.lunarMonth }}</strong> năm <strong>{{ targetLunarInfo.yearCanChi }}</strong>.
          </p>
          <p>
            Đây là ngày có Can Chi <strong>{{ targetLunarInfo.dayCanChi }}</strong> (Thiên can <strong>{{ targetLunarInfo.dayCanChi.split(' ')[0] }}</strong> kết hợp với địa chi <strong>{{ targetLunarInfo.dayCanChi.split(' ')[1] }}</strong>). 
            Ngày hôm nay được xếp vào hàng ngũ ngày <strong>{{ targetLunarInfo.dayType }}</strong> và nằm trong tiết khí <strong>{{ targetLunarInfo.tietKhi }}</strong>.
          </p>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-semibold text-slate-800 text-base">Xem giờ hoàng đạo cát lợi</h4>
          <p>
            Trong ngày này, bạn nên ưu tiên làm các việc lớn vào những cung giờ hoàng đạo cát lành sau:
            <span class="block mt-2 font-semibold text-amber-600">
              {{ targetLunarInfo.hoangDaoList.map(h => `${h.chiName} (${h.range})`).join(', ') }}.
            </span>
            Khai sự vào giờ tốt lành giúp đem lại nhiều hỷ tài cát khí và may mắn.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
