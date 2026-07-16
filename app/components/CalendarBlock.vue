<script setup>
import { computed } from 'vue'

const props = defineProps({
  info: {
    type: Object,
    required: true
  }
})

defineEmits(['go-today'])

const todayState = useState('today-state', () => new Date())

// Check if the displayed date matches the current local system date
const isDateToday = computed(() => {
  return props.info.solarDay === todayState.value.getDate() &&
         props.info.solarMonth === todayState.value.getMonth() + 1 &&
         props.info.solarYear === todayState.value.getFullYear()
})
</script>

<template>
  <div class="glass-panel rounded-3xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden h-full border border-slate-200">
    <!-- Decorative background glow -->
    <div class="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
    <div class="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-red-650/5 blur-3xl pointer-events-none"></div>

    <div class="space-y-4 z-10 relative">
      <!-- 1. Dương lịch: Thứ, ngày, tháng, năm, nhãn Hôm nay/nút Về hôm nay -->
      <div class="text-center pb-5 border-b border-slate-200 relative">
        <!-- Corner Label/Button -->
        <div class="absolute top-0 right-0">
          <span 
            v-if="isDateToday" 
            class="text-[11.5px] bg-emerald-500/10 text-emerald-600 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/25 select-none"
          >
            Hôm nay
          </span>
          <button 
            v-else 
            @click="$emit('go-today')" 
            class="text-[11.5px] bg-amber-500/15 hover:bg-amber-500/25 text-amber-650 font-bold px-2.5 py-1 rounded-lg border border-amber-500/25 transition-all flex items-center gap-1 shadow-sm"
          >
            ← Về hôm nay
          </button>
        </div>

        <span class="text-[13px] font-bold tracking-wider text-amber-600 uppercase block mt-1.5">{{ info.dayOfWeek }}</span>
        <div class="text-7xl font-extrabold my-2 tracking-tighter bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {{ info.solarDay }}
        </div>
        <div class="text-slate-500 font-medium text-sm">
          Tháng {{ info.solarMonth }} / {{ info.solarYear }}
        </div>

        <!-- Ngày lễ/sự kiện lịch sử (nếu có) - nằm chung khối với dương lịch, trước gạch ranh giới -->
        <div v-if="info.holiday" class="text-rose-600 text-center font-bold text-[13px] mt-3 flex items-center justify-center gap-1.5">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          {{ info.holiday }}
        </div>
      </div>

      <!-- 3. Âm lịch (ngày/tháng) | Tiết khí -->
      <div class="flex items-center justify-between text-base py-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <span class="text-slate-500 font-semibold text-[13px] sm:text-sm">Lịch Âm:</span>
          <span class="text-amber-700 font-extrabold text-lg">
            {{ info.lunarDay }}/{{ info.lunarMonth }}{{ info.isLeap ? ' (Nhuận)' : '' }}
          </span>
        </div>
        <div class="h-5 w-px bg-slate-200"></div>
        <div class="flex items-center gap-2">
          <span class="text-slate-500 font-semibold text-[13px] sm:text-sm">Tiết khí:</span>
          <span class="text-emerald-600 font-extrabold text-base">
            {{ info.tietKhi }}
          </span>
        </div>
      </div>

      <!-- 4. Can chi ngày | tháng | năm -->
      <!-- Mobile Layout: 2 lines, 3 columns -->
      <div class="sm:hidden grid grid-cols-3 py-3.5 border-b border-slate-100 text-center relative gap-x-2">
        <!-- Ngày Column -->
        <div class="flex flex-col items-center">
          <span class="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Ngày</span>
          <span class="text-amber-700 font-extrabold text-xs mt-1 whitespace-nowrap">{{ info.dayCanChi }}</span>
        </div>
        
        <!-- Divider 1 -->
        <div class="absolute left-1/3 top-1/2 -translate-y-1/2 h-7 w-px bg-slate-200"></div>
        
        <!-- Tháng Column -->
        <div class="flex flex-col items-center">
          <span class="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Tháng</span>
          <span class="text-slate-700 font-extrabold text-xs mt-1 whitespace-nowrap">{{ info.monthCanChi }}</span>
        </div>
        
        <!-- Divider 2 -->
        <div class="absolute left-2/3 top-1/2 -translate-y-1/2 h-7 w-px bg-slate-200"></div>
        
        <!-- Năm Column -->
        <div class="flex flex-col items-center">
          <span class="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Năm</span>
          <span class="text-slate-700 font-extrabold text-xs mt-1 whitespace-nowrap">{{ info.yearCanChi }}</span>
        </div>
      </div>

      <!-- Desktop/Tablet Layout: 1 line, 3 items -->
      <div class="hidden sm:flex items-center justify-between py-3.5 border-b border-slate-100 gap-2">
        <div class="flex items-center gap-1.5">
          <span class="text-slate-500 font-bold text-[13px]">Ngày:</span>
          <span class="text-amber-700 font-extrabold text-[13px] md:text-sm lg:text-base whitespace-nowrap">{{ info.dayCanChi }}</span>
        </div>
        <div class="h-4 w-px bg-slate-200"></div>
        <div class="flex items-center gap-1.5">
          <span class="text-slate-500 font-bold text-[13px]">Tháng:</span>
          <span class="text-slate-700 font-extrabold text-[13px] md:text-sm lg:text-base whitespace-nowrap">{{ info.monthCanChi }}</span>
        </div>
        <div class="h-4 w-px bg-slate-200"></div>
        <div class="flex items-center gap-1.5">
          <span class="text-slate-500 font-bold text-[13px]">Năm:</span>
          <span class="text-slate-700 font-extrabold text-[13px] md:text-sm lg:text-base whitespace-nowrap">{{ info.yearCanChi }}</span>
        </div>
      </div>

      <!-- 5. Giờ hoàng đạo -->
      <div class="space-y-2">
        <span class="text-[13px] font-bold tracking-wider text-slate-400 uppercase block">Giờ hoàng đạo</span>
        <div class="grid grid-cols-3 gap-1.5">
          <span 
            v-for="item in info.hoangDaoList" 
            :key="item.chiName" 
            class="text-[11.5px] sm:text-xs bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 border border-amber-500/15 py-1.5 rounded-xl flex items-center justify-center gap-1 font-bold transition-all text-center whitespace-nowrap"
            :title="item.range"
          >
            <span class="w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>
            <span>{{ item.chiName }} <span class="opacity-60 text-[10.5px] font-medium">{{ item.range }}</span></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
