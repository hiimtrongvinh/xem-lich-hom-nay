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

    <div class="space-y-6 z-10 relative">
      <!-- Solar Date Header with Corner Label/Button -->
      <div class="text-center pb-6 border-b border-slate-200 relative">
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
        <div class="text-7xl font-extrabold my-2 font-serif tracking-tighter bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {{ info.solarDay }}
        </div>
        <div class="text-slate-500 font-medium text-sm">
          Tháng {{ info.solarMonth }} / {{ info.solarYear }}
        </div>
      </div>

      <!-- Lunar Date Information -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Thông tin âm lịch</h3>
        <div class="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
          <div>
            <div class="text-xs text-slate-500">Ngày âm</div>
            <div class="text-2xl font-bold text-amber-600 font-serif">
              {{ info.lunarDay }} <span class="text-xs font-sans font-normal text-slate-500">/ {{ info.lunarMonth }}{{ info.isLeap ? ' nhuận' : '' }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-slate-500">Tháng (Âm lịch)</div>
            <div class="text-sm font-semibold text-slate-800">{{ info.monthName }}</div>
          </div>
        </div>

        <!-- Can Chi Metadata -->
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span class="text-slate-400 block text-[10px]">Ngày:</span>
            <span class="font-semibold text-amber-700">{{ info.dayCanChi }}</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span class="text-slate-400 block text-[10px]">Tháng:</span>
            <span class="font-semibold text-slate-700">{{ info.monthCanChi }}</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span class="text-slate-400 block text-[10px]">Năm:</span>
            <span class="font-semibold text-slate-700">{{ info.yearCanChi }}</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span class="text-slate-400 block text-[10px]">Tiết khí:</span>
            <span class="font-semibold text-emerald-600">{{ info.tietKhi }}</span>
          </div>
        </div>
      </div>

      <!-- Auspicious Hours -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold tracking-wider text-slate-400 uppercase">Giờ hoàng đạo</h3>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="item in info.hoangDaoList" 
            :key="item.chiName" 
            class="text-xs bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold"
            :title="item.range"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {{ item.chiName }} <span class="opacity-60 text-[10px] font-mono">{{ item.range }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
