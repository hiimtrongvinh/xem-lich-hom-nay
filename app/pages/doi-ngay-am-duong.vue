<script setup>
import { ref, computed } from 'vue'
import { convertSolar2Lunar, convertLunar2Solar, getYearCanChi, THANG, getLunarDayInfo } from '~/utils/lunar'

const isSolarToLunar = ref(true)

// Solar Inputs
const solarDay = ref(new Date().getDate())
const solarMonth = ref(new Date().getMonth() + 1)
const solarYear = ref(new Date().getFullYear())

// Lunar Inputs
const lunarDay = ref(15)
const lunarMonth = ref(8)
const lunarYear = ref(new Date().getFullYear())
const lunarLeap = ref(false)

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
  <div class="max-w-6xl mx-auto space-y-10">
    <div class="text-center space-y-2 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold text-slate-950 font-serif sm:text-3xl">Công Cụ Đổi Ngày Âm Dương</h2>
      <p class="text-slate-500 text-sm">Chuyển đổi qua lại giữa lịch âm và lịch dương cực kỳ nhanh chóng kèm thông tin chi tiết</p>
    </div>

    <!-- Switch and Input panel layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Input Panel (Left 6 columns) -->
      <div class="lg:col-span-6 space-y-6">
        <!-- Toggle Selector -->
        <div class="flex justify-center">
          <div class="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex gap-1 w-full max-w-sm">
            <button 
              @click="isSolarToLunar = true"
              class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              :class="isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-800'"
            >
              Dương -> Âm
            </button>
            <button 
              @click="isSolarToLunar = false"
              class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              :class="!isSolarToLunar ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-800'"
            >
              Âm -> Dương
            </button>
          </div>
        </div>

        <!-- Input Box -->
        <div class="glass-panel rounded-3xl p-6 border border-slate-200 space-y-4">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nhập ngày cần chuyển đổi</h3>
          
          <!-- Solar Inputs -->
          <div v-if="isSolarToLunar" class="grid grid-cols-3 gap-3">
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 block">Ngày dương</label>
              <select v-model="solarDay" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none text-xs font-medium">
                <option v-for="d in dayOptions" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 block">Tháng dương</label>
              <select v-model="solarMonth" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none text-xs font-medium">
                <option v-for="m in monthOptions" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 block">Năm dương</label>
              <select v-model="solarYear" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none text-xs font-medium">
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>

          <!-- Lunar Inputs -->
          <div v-else class="space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1.5">
                <label class="text-[10px] text-slate-400 block">Ngày âm</label>
                <select v-model="lunarDay" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none text-xs font-medium">
                  <option v-for="d in dayOptions.slice(0, 30)" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] text-slate-400 block">Tháng âm</label>
                <select v-model="lunarMonth" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none text-xs font-medium">
                  <option v-for="m in monthOptions" :key="m" :value="m">Tháng {{ THANG[m - 1] }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] text-slate-400 block">Năm âm</label>
                <select v-model="lunarYear" class="w-full bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none text-xs font-medium">
                  <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </div>

            <!-- Leap Month Checkbox -->
            <div class="flex items-center gap-2 pt-1.5">
              <input 
                type="checkbox" 
                id="lunar-leap-chk" 
                v-model="lunarLeap" 
                class="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-100 border-slate-200"
              />
              <label for="lunar-leap-chk" class="text-xs text-slate-500 select-none cursor-pointer">
                Đây là tháng nhuận (âm lịch)
              </label>
            </div>
          </div>
        </div>

        <!-- Conversion Output Bar -->
        <div class="glass-panel rounded-3xl p-5 border border-slate-200 space-y-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tổng quan kết quả</span>
          <div v-if="conversionResult.success" class="space-y-2">
            <span class="text-xs text-slate-400 block">{{ conversionResult.inputStr }}</span>
            <div class="text-lg font-bold text-amber-600 font-serif leading-tight">
              {{ conversionResult.outputStr }}
            </div>
          </div>
          <div v-else class="text-red-500 text-sm font-semibold">
            {{ conversionResult.msg }}
          </div>
        </div>
      </div>

      <!-- Calendar Block info of converted date (Right 6 columns) -->
      <div class="lg:col-span-6">
        <div v-if="targetLunarInfo">
          <CalendarBlock :info="targetLunarInfo" />
        </div>
        <div v-else class="glass-panel rounded-3xl p-10 border border-slate-200 border-dashed text-slate-400 text-center flex items-center justify-center h-full min-h-[300px]">
          Chưa có thông tin ngày hợp lệ.
        </div>
      </div>

    </div>

    <!-- Detailed Interpretation right below the converter widgets -->
    <div v-if="targetLunarInfo && conversionResult.success" class="glass-panel rounded-3xl p-8 border border-slate-200 space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <span class="w-1.5 h-6 bg-amber-500 rounded-full"></span>
            Luận Giải Ngày Đã Chuyển Đổi ({{ targetLunarInfo.solarDay }}/{{ targetLunarInfo.solarMonth }}/{{ targetLunarInfo.solarYear }})
          </h3>
          <p class="text-xs text-slate-400 mt-1">Nội dung chi tiết luận đoán phong thủy ngày âm dương</p>
        </div>
        
        <NuxtLink 
          :to="`/ngay/${conversionResult.formattedDate}`" 
          class="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-650 font-bold px-4 py-2 rounded-xl border border-amber-500/25 transition-all"
        >
          Trang Luận Giải Riêng Biệt
        </NuxtLink>
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
