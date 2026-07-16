<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const todayState = useState('today-state', () => new Date())
const isScrolled = ref(false)

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 20
  }
}

onMounted(() => {
  todayState.value = new Date()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

// Current month route for Lịch Tháng
const currentMonthRoute = computed(() => {
  const y = todayState.value.getFullYear()
  const m = String(todayState.value.getMonth() + 1).padStart(2, '0')
  return `/thang/${y}-${m}`
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-500/30 selection:text-amber-900">
    <!-- Header / Nav Wrapper sticky at top -->
    <header class="sticky top-0 z-50 bg-white/95 border-b border-slate-200 shadow-sm transition-all duration-300">
      
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
            <p class="text-[10px] sm:text-xs text-slate-500">Xem lịch âm dương hôm nay</p>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation Links (hidden on mobile) -->
        <div class="flex items-center gap-6">
          <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <NuxtLink to="/" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Trang chủ</NuxtLink>
            <NuxtLink :to="currentMonthRoute" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Lịch Tháng</NuxtLink>
            <NuxtLink to="/doi-ngay-am-duong" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Đổi Ngày</NuxtLink>
            <NuxtLink to="/cam-nang" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Cẩm Nang</NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Mobile Nav Bar (Sticky, always showing the 4 functions, right below logo/collapses to top-0 when scrolled) -->
      <div class="md:hidden border-t border-slate-100 bg-white text-xs font-bold py-2.5 px-4 flex justify-around text-slate-500 transition-all duration-300">
        <NuxtLink to="/" class="hover:text-amber-500 flex flex-col items-center gap-0.5" active-class="text-amber-500">
          <span>Trang chủ</span>
        </NuxtLink>
        <NuxtLink :to="currentMonthRoute" class="hover:text-amber-500 flex flex-col items-center gap-0.5" active-class="text-amber-500">
          <span>Lịch Tháng</span>
        </NuxtLink>
        <NuxtLink to="/doi-ngay-am-duong" class="hover:text-amber-500 flex flex-col items-center gap-0.5" active-class="text-amber-500">
          <span>Đổi Ngày</span>
        </NuxtLink>
        <NuxtLink to="/cam-nang" class="hover:text-amber-500 flex flex-col items-center gap-0.5" active-class="text-amber-500">
          <span>Cẩm Nang</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
      <p class="font-medium text-slate-700">
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
