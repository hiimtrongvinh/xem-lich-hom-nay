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
    return { success: false, msg: 'Ngày đã chọn không hợp lệ.' }
  }

  const info = targetLunarInfo.value
  
  if (isSolarToLunar.value) {
    return {
      success: true,
      inDay: solarDay.value,
      inMonth: solarMonth.value,
      inYear: solarYear.value,
      outDay: info.lunarDay,
      outMonth: info.lunarMonth,
      outYear: info.lunarYear,
      isLeap: info.isLeap,
      formattedDate: `${info.solarYear}-${String(info.solarMonth).padStart(2, '0')}-${String(info.solarDay).padStart(2, '0')}`
    }
  } else {
    return {
      success: true,
      inDay: lunarDay.value,
      inMonth: lunarMonth.value,
      inYear: lunarYear.value,
      isLeap: lunarLeap.value,
      outDay: info.solarDay,
      outMonth: info.solarMonth,
      outYear: info.solarYear,
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
  <div class="space-y-5 pt-0.5">
    <!-- Switch and Input panel layout (Left: Day Block col-span-5, Right: Converter col-span-7) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <!-- Calendar Day Block (Left 5 columns) - Shifted to bottom on mobile -->
      <div class="lg:col-span-5 flex flex-col order-2 lg:order-1">
        <div class="flex-grow">
          <div v-if="targetLunarInfo" class="h-full">
            <CalendarBlock :info="targetLunarInfo" @go-today="router.push('/')" />
          </div>
          <div v-else class="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 border-dashed text-slate-500 dark:text-slate-400 text-center flex flex-col items-center justify-center h-full min-h-[320px]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto opacity-40 mb-1 text-slate-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h3 class="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1">Chưa có thông tin ngày</h3>
            <p class="text-xs max-w-[220px] leading-relaxed">
              Vui lòng nhập ngày tháng năm ở bảng bên cạnh để xem luận giải chi tiết.
            </p>
          </div>
        </div>
      </div>

      <!-- Input Panel / Conversion Tool (Right 7 columns) - Displayed first on mobile -->
      <div class="lg:col-span-7 flex flex-col order-1 lg:order-2">
        <div class="glass-panel rounded-3xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between space-y-4">
          
          <!-- HÀNG 1: Tiêu đề Widget tăng kích thước cỡ chữ -->
          <div>
            <h1 class="text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-wide">Công Cụ Đổi Ngày Âm Dương</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">Chuyển đổi qua lại giữa lịch âm và lịch dương cực kỳ nhanh chóng kèm thông tin chi tiết</p>
          </div>

          <!-- HÀNG 2: Công tắc chuyển đổi (Tăng size phím và khoảng chạm) -->
          <div class="flex justify-start">
            <div class="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-1 w-full max-w-sm">
              <button 
                @click="isSolarToLunar = true"
                class="flex-1 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all"
                :class="isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
              >
                Dương lịch → Âm lịch
              </button>
              <button 
                @click="isSolarToLunar = false"
                class="flex-1 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all"
                :class="!isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
              >
                Âm lịch → Dương lịch
              </button>
            </div>
          </div>

          <!-- HÀNG 3: Đầu vào & Đầu ra căn thẳng hàng dọc, dãn rộng hết cỡ sang bên phải -->
          <div class="space-y-4">
            <!-- 3.1: Nhập đầu vào -->
            <div class="space-y-2">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Nhập ngày {{ isSolarToLunar ? 'dương lịch' : 'âm lịch' }}
                </span>
                
                <!-- Leap Month Checkbox -->
                <div v-if="!isSolarToLunar" class="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    id="lunar-leap-chk" 
                    v-model="lunarLeap" 
                    class="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                  <label for="lunar-leap-chk" class="text-[11.5px] text-slate-500 dark:text-slate-400 select-none cursor-pointer font-bold">
                    Tháng nhuận
                  </label>
                </div>
              </div>
              
              <!-- Flex dãn rộng tối đa (max-w-2xl) với các ô kích thước cố định vừa vặn trên mobile -->
              <div class="flex flex-wrap items-center gap-1.5 sm:gap-3 max-w-2xl w-full">
                <!-- Ngày đầu vào -->
                <div class="flex items-center gap-1">
                  <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium shrink-0">Ngày</span>
                  <input 
                    v-if="isSolarToLunar"
                    v-model.number="solarDay" 
                    list="solar-days" 
                    class="w-10 sm:w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
                  />
                  <input 
                    v-else
                    v-model.number="lunarDay" 
                    list="lunar-days" 
                    class="w-10 sm:w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
                  />
                </div>

                <!-- Tháng đầu vào -->
                <div class="flex items-center gap-1">
                  <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium shrink-0">Tháng</span>
                  <input 
                    v-if="isSolarToLunar"
                    v-model.number="solarMonth" 
                    list="solar-months" 
                    class="w-10 sm:w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
                  />
                  <input 
                    v-else
                    v-model.number="lunarMonth" 
                    list="lunar-months" 
                    class="w-10 sm:w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
                  />
                </div>

                <!-- Năm đầu vào -->
                <div class="flex items-center gap-1">
                  <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium shrink-0">Năm</span>
                  <input 
                    v-if="isSolarToLunar"
                    v-model.number="solarYear" 
                    list="solar-years" 
                    class="w-16 sm:w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
                  />
                  <input 
                    v-else
                    v-model.number="lunarYear" 
                    list="lunar-years" 
                    class="w-16 sm:w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-extrabold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
                  />
                </div>
              </div>
            </div>

            <!-- 3.2: Kết quả đầu ra dãn rộng thẳng hàng dọc -->
            <div class="space-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span class="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                Kết quả {{ isSolarToLunar ? 'âm lịch' : 'dương lịch' }}
              </span>
              
              <div v-if="conversionResult.success" class="flex items-center gap-2 sm:gap-3 flex-wrap">
                <!-- Flex kết quả tương đương các ô nhập -->
                <div class="flex items-center gap-1.5 sm:gap-3 max-w-2xl w-full">
                  <!-- Ngày đầu ra -->
                  <div class="flex items-center gap-1">
                    <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium shrink-0">Ngày</span>
                    <input 
                      readonly 
                      :value="String(conversionResult.outDay).padStart(2, '0')"
                      class="w-10 sm:w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-black text-center text-amber-600 dark:text-amber-500 focus:outline-none cursor-default"
                    />
                  </div>

                  <!-- Tháng đầu ra -->
                  <div class="flex items-center gap-1">
                    <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium shrink-0">Tháng</span>
                    <input 
                      readonly 
                      :value="String(conversionResult.outMonth).padStart(2, '0')"
                      class="w-10 sm:w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-black text-center text-amber-600 dark:text-amber-500 focus:outline-none cursor-default"
                    />
                  </div>

                  <!-- Năm đầu ra -->
                  <div class="flex items-center gap-1">
                    <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium shrink-0">Năm</span>
                    <input 
                      readonly 
                      :value="conversionResult.outYear"
                      class="w-16 sm:w-20 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1 sm:px-2 py-1 text-sm sm:text-base font-black text-center text-amber-600 dark:text-amber-500 focus:outline-none cursor-default"
                    />
                  </div>

                  <!-- Nhãn tháng nhuận -->
                  <span v-if="conversionResult.isLeap" class="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">
                    Nhuận
                  </span>
                </div>
              </div>
              <div class="text-red-500 text-sm font-semibold" v-else>
                {{ conversionResult.msg }}
              </div>
            </div>
          </div>

          <!-- Nút hành động -->
          <div v-if="conversionResult.success" class="pt-1.5">
            <NuxtLink 
              :to="`/ngay/${conversionResult.formattedDate}`" 
              class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 font-extrabold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-amber-500/10 text-center block"
            >
              Xem Luận Giải Lịch Ngày Chi Tiết
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Interpretation Section -->
    <div v-if="targetLunarInfo && conversionResult.success" class="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-2">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span class="w-1.5 h-5 bg-amber-500 rounded-full"></span>
          Luận giải ngày đã chuyển đổi ({{ targetLunarInfo.solarDay }}/{{ targetLunarInfo.solarMonth }}/{{ targetLunarInfo.solarYear }})
        </h3>
        <p class="text-[11px] text-slate-400 dark:text-slate-500">Nội dung chi tiết luận đoán phong thủy ngày âm dương</p>
      </div>

      <div class="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          Đây là ngày <strong>{{ targetLunarInfo.solarDay }} tháng {{ targetLunarInfo.solarMonth }} năm {{ targetLunarInfo.solarYear }}</strong> dương lịch, 
          tức ngày <strong>{{ targetLunarInfo.lunarDay }} tháng {{ targetLunarInfo.lunarMonth }}</strong> âm lịch, 
          thuộc ngày <strong>{{ targetLunarInfo.dayCanChi }}</strong>, tháng <strong>{{ targetLunarInfo.monthCanChi }}</strong>, năm <strong>{{ targetLunarInfo.yearCanChi }}</strong>. 
          Đây cũng là ngày <strong>{{ targetLunarInfo.dayType.toLowerCase() }}</strong>, 
          <span v-if="targetLunarInfo.isHoangDao">quý bản mệnh nên ưu tiên tiến hành các công việc quan trọng như khởi công, động thổ, ký kết hay cưới hỏi để thu hút cát khí tốt lành.</span>
          <span v-else-if="targetLunarInfo.isHacDao">quý bản mệnh nên hạn chế thực hiện các giao dịch lớn, khai trương hay các việc đại sự để phòng tránh trắc trở phát sinh.</span>
          <span v-else>quý bản mệnh có thể tiến hành các công việc thường nhật và giao dịch nhỏ một cách bình hòa và suôn sẻ.</span>
        </p>

        <p v-if="targetLunarInfo.holidayParagraph" class="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-3 rounded-r-xl text-rose-800 dark:text-rose-300 font-medium">
          {{ targetLunarInfo.holidayParagraph }}
        </p>

        <p>
          {{ targetLunarInfo.tietKhiParagraph }}
        </p>
        
        <p>
          Giờ hoàng đạo trong ngày này bao gồm: 
          <strong class="text-amber-700 dark:text-amber-400">
            {{ targetLunarInfo.hoangDaoList.map(h => `${h.chiName} (${h.range})`).join(', ') }}
          </strong>. 
          Quý bản mệnh chú ý lựa chọn để mọi công việc hanh thông và viên mãn.
        </p>
      </div>
    </div>
  </div>
</template>