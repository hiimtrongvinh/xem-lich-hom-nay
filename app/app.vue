<script setup>
import { computed } from 'vue'

// Current month route for Lịch Tháng
const currentMonthRoute = computed(() => {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  return `/thang/${y}-${m}`
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-500/30 selection:text-amber-900">
    <!-- Header -->
    <header class="border-b border-slate-200 bg-white/95 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-650 flex items-center justify-center shadow-md">
            <span class="font-bold text-lg text-white">L</span>
          </span>
          <div>
            <h1 class="font-bold text-lg leading-tight text-amber-600">Lịch Vạn Niên</h1>
            <p class="text-xs text-slate-500">Xem lịch âm dương hôm nay</p>
          </div>
        </NuxtLink>

        <!-- Navigation Links (Always Light Mode) -->
        <div class="flex items-center gap-6">
          <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <NuxtLink to="/" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Trang chủ</NuxtLink>
            <NuxtLink :to="currentMonthRoute" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Lịch Tháng</NuxtLink>
            <NuxtLink to="/doi-ngay-am-duong" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Đổi Ngày</NuxtLink>
            <NuxtLink to="/cam-nang" class="hover:text-amber-600 transition-colors" active-class="text-amber-600">Cẩm Nang</NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Mobile Nav Bar -->
    <div class="md:hidden border-b border-slate-200 bg-white text-xs font-bold py-2.5 px-4 flex justify-around text-slate-500">
      <NuxtLink to="/" class="hover:text-amber-500" active-class="text-amber-500">Trang chủ</NuxtLink>
      <NuxtLink :to="currentMonthRoute" class="hover:text-amber-500" active-class="text-amber-500">Lịch Tháng</NuxtLink>
      <NuxtLink to="/doi-ngay-am-duong" class="hover:text-amber-500" active-class="text-amber-500">Đổi Ngày</NuxtLink>
      <NuxtLink to="/cam-nang" class="hover:text-amber-500" active-class="text-amber-500">Cẩm Nang</NuxtLink>
    </div>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
      <div class="max-w-7xl mx-auto px-4">
        <p>© 2026 Lịch Vạn Niên Vệ Tinh. Tất cả các quyền được bảo lưu.</p>
        <p class="text-xs mt-1 text-slate-400">Ứng dụng chạy hoàn toàn phía client không sử dụng cơ sở dữ liệu.</p>
      </div>
    </footer>
  </div>
</template>
