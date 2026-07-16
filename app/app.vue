<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const todayState = useState('today-state', () => new Date())
const isScrolled = ref(false)
const isDark = ref(false)

function applyDark(value) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', value)
    localStorage.setItem('theme', value ? 'dark' : 'light')
  }
}

function toggleDark() {
  isDark.value = !isDark.value
  applyDark(isDark.value)
}

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 20
  }
}

onMounted(() => {
  todayState.value = new Date()
  window.addEventListener('scroll', handleScroll, { passive: true })
  // Restore saved preference or follow system preference
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyDark(isDark.value)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

const route = useRoute()
const isMonthPageActive = computed(() => {
  return route.path.startsWith('/thang/')
})

// Current month route for Lịch Tháng
const currentMonthRoute = computed(() => {
  const y = todayState.value.getFullYear()
  const m = String(todayState.value.getMonth() + 1).padStart(2, '0')
  return `/thang/${y}-${m}`
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-500/30 selection:text-amber-900 transition-colors duration-300">
    <!-- Header / Nav Wrapper sticky at top -->
    <header class="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      
      <!-- Logo Container (Collapses on scroll on mobile) -->
      <div 
        :class="[
          'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 overflow-hidden',
          isScrolled ? 'h-0 md:h-16 opacity-0 md:opacity-100 py-0' : 'h-16 py-3'
        ]"
      >
        <!-- Logo (Centered on mobile, left-aligned on desktop) -->
        <NuxtLink to="/" class="flex items-center gap-3 mx-auto md:mx-0">
          <span class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-650 flex items-center justify-center shadow-md shrink-0">
            <span class="font-bold text-lg text-white">L</span>
          </span>
          <div class="text-left">
            <h1 class="font-bold text-base sm:text-lg leading-tight text-amber-600">Xem lịch hôm nay</h1>
            <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Xem lịch âm dương hôm nay</p>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation Links (hidden on mobile) -->
        <div class="flex items-center gap-4">
          <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <NuxtLink to="/" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Trang chủ</NuxtLink>
            <NuxtLink 
              :to="currentMonthRoute" 
              class="hover:text-amber-600 transition-colors" 
              :class="{ 'text-amber-600': isMonthPageActive }"
              active-class="text-amber-600"
            >
              Lịch Tháng
            </NuxtLink>
            <NuxtLink to="/doi-ngay-am-duong" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Đổi Ngày</NuxtLink>
            <NuxtLink to="/cam-nang" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Cẩm Nang</NuxtLink>
          </nav>

          <!-- Desktop Dark/Light Toggle Button (Hidden on Mobile) -->
          <button
            @click="toggleDark"
            class="hidden md:flex w-9 h-9 rounded-full items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 shrink-0"
            :title="isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'"
          >
            <!-- Moon icon (show when light) -->
            <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <!-- Sun icon (show when dark) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Nav Bar (Sticky, always showing the 4 functions, right below logo/collapses to top-0 when scrolled) -->
      <div class="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold py-2.5 px-4 flex justify-around text-slate-500 dark:text-slate-400 transition-all duration-300">
        <NuxtLink to="/" class="hover:text-amber-500 flex flex-col items-center gap-0.5" active-class="text-amber-500">
          <span>Trang chủ</span>
        </NuxtLink>
        <NuxtLink 
          :to="currentMonthRoute" 
          class="hover:text-amber-500 flex flex-col items-center gap-0.5" 
          :class="{ 'text-amber-500': isMonthPageActive }"
          active-class="text-amber-500"
        >
          <span>Lịch Tháng</span>
        </NuxtLink>
        <NuxtLink to="/doi-ngay-am-duong" class="hover:text-amber-500 flex flex-col items-center gap-0.5" active-class="text-amber-500">
          <span>Đổi Ngày</span>
        </NuxtLink>
        <NuxtLink to="/cam-nang" class="hover:text-amber-500 flex flex-col items-center gap-0.5" active-class="text-amber-500">
          <span>Cẩm Nang</span>
        </NuxtLink>
        <!-- Dark/Light Toggle on mobile -->
        <button
          @click="toggleDark"
          class="hover:text-amber-500 flex flex-col items-center gap-0.5 transition-colors"
        >
          <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
      <p class="font-medium text-slate-700 dark:text-slate-300">
      © 2026 Xem Lịch Hôm Nay. 
      <span class="text-slate-500 font-normal">| Phát triển bởi 
        <a href="https://lilytech.com.vn/" target="_blank" rel="noopener" class="text-amber-600 hover:underline font-semibold">Lilytech</a>
      </span>
    </p>

    <!-- Tuyên bố miễn trừ trách nhiệm -->
    <p class="text-[11.5px] leading-relaxed text-slate-400 max-w-2xl mx-auto">
      Mọi thông tin luận giải, ngày lành tháng tốt, giờ hoàng đạo trên website mang tính chất chiêm nghiệm và tham khảo. <br> Quý độc giả nên cân nhắc kết hợp cùng các yếu tố thực tiễn khi đưa ra quyết định.
    </p>
    </footer>
  </div>
</template>

