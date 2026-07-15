<script setup>
import { computed } from 'vue'

const props = defineProps({
  info: {
    type: Object,
    required: true
  }
})

defineEmits(['go-today'])

// Check if the displayed date matches the current local system date
const isDateToday = computed(() => {
  const today = new Date()
  return props.info.solarDay === today.getDate() &&
         props.info.solarMonth === today.getMonth() + 1 &&
         props.info.solarYear === today.getFullYear()
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
            class="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/25 select-none"
          >
            Hôm nay
          </span>
          <button 
            v-else 
            @click="$emit('go-today')" 
            class="text-[10px] bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 font-bold px-2.5 py-1 rounded-lg border border-amber-500/25 transition-all flex items-center gap-1 shadow-sm"
          >
            ← Về hôm nay
          </button>
        </div>

        <span class="text-xs font-bold tracking-wider text-amber-600 uppercase block mt-1.5">{{ info.dayOfWeek }}</span>
        <div class="text-7xl font-extrabold my-2 tracking-tighter bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {{ info.solarDay }}
        </div>
        <div class="text-slate-500 font-medium text-sm">
          Tháng {{ info.solarMonth }} / {{ info.solarYear }}
        </div>

        <!-- Ngày lễ/sự kiện lịch sử (nếu có) - nằm chung khối với dương lịch, trước gạch ranh giới -->
        <div v-if="info.holiday" class="text-rose-600 text-center font-bold text-xs mt-3 flex items-center justify-center gap-1.5">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          {{ info.holiday }}
        </div>
      </div>

      <!-- 3. Âm lịch (ngày/tháng) | Tiết khí -->
      <div class="flex items-center justify-between text-base py-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <span class="text-slate-500 font-semibold text-xs sm:text-sm">Lịch Âm:</span>
          <span class="text-amber-700 font-extrabold text-lg">
            {{ info.lunarDay }}/{{ info.lunarMonth }}{{ info.isLeap ? ' (Nhuận)' : '' }}
          </span>
        </div>
        <div class="h-5 w-px bg-slate-200"></div>
        <div class="flex items-center gap-2">
          <span class="text-slate-500 font-semibold text-xs sm:text-sm">Tiết khí:</span>
          <span class="text-emerald-600 font-extrabold text-base">
            {{ info.tietKhi }}
          </span>
        </div>
      </div>

      <!-- 4. Can chi ngày | tháng | năm -->
      <div class="flex flex-wrap items-center justify-between py-3 border-b border-slate-100 gap-2">
        <div class="flex items-center gap-1.5">
          <span class="text-slate-500 font-semibold text-xs sm:text-sm">Ngày:</span>
          <span class="text-amber-700 font-extrabold text-sm sm:text-base whitespace-nowrap">{{ info.dayCanChi }}</span>
        </div>
        <div class="h-4 w-px bg-slate-200"></div>
        <div class="flex items-center gap-1.5">
          <span class="text-slate-500 font-semibold text-xs sm:text-sm">Tháng:</span>
          <span class="text-slate-700 font-extrabold text-sm sm:text-base whitespace-nowrap">{{ info.monthCanChi }}</span>
        </div>
        <div class="h-4 w-px bg-slate-200"></div>
        <div class="flex items-center gap-1.5">
          <span class="text-slate-500 font-semibold text-xs sm:text-sm">Năm:</span>
          <span class="text-slate-700 font-extrabold text-sm sm:text-base whitespace-nowrap">{{ info.yearCanChi }}</span>
        </div>
      </div>

      <!-- 5. Giờ hoàng đạo -->
      <div class="space-y-2">
        <span class="text-xs font-bold tracking-wider text-slate-400 uppercase block">Giờ hoàng đạo</span>
        <div class="grid grid-cols-3 gap-2">
          <span 
            v-for="item in info.hoangDaoList" 
            :key="item.chiName" 
            class="text-[11px] bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 border border-amber-500/15 py-1.5 rounded-xl flex flex-col items-center justify-center font-bold transition-all text-center leading-none space-y-1"
            :title="item.range"
          >
            <span class="flex items-center gap-1 font-bold">
              <span class="w-1 h-1 rounded-full bg-amber-500 shrink-0"></span>
              <span>{{ item.chiName }}</span>
            </span>
            <span class="opacity-60 text-[9px] font-medium">{{ item.range }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
