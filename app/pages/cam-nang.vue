<script setup>
const articles = [
  {
    title: 'Cách xem ngày tốt xấu, ngày hoàng đạo chính xác nhất',
    summary: 'Hướng dẫn chi tiết các phương pháp xem ngày tốt lành, tránh ngày hắc đạo theo các quy luật thiên văn và phong thủy cổ truyền.',
    category: 'Hướng Dẫn',
    date: '12/07/2026'
  },
  {
    title: 'Tìm hiểu ý nghĩa của 12 Trực trong phong thủy lịch pháp',
    summary: 'Trực Kiến, Trực Trừ, Trực Mãn... là gì? Cách ứng dụng ý nghĩa từng trực để chọn ngày khởi công, động thổ cát lợi.',
    category: 'Phong Thủy',
    date: '10/07/2026'
  },
  {
    title: 'Nghi thức cúng Rằm tháng 7 âm lịch và mâm lễ chuẩn truyền thống',
    summary: 'Tổng hợp văn khấn, chuẩn bị mâm lễ chay/mặn cúng Rằm tháng 7 (Vu Lan Báo Hiếu) chuẩn xác và ý nghĩa.',
    category: 'Phong Tục',
    date: '08/07/2026'
  },
  {
    title: 'Nhị thập bát tú: 28 chòm sao chiếu mệnh ảnh hưởng thế nào?',
    summary: 'Ý nghĩa tốt xấu của các sao trong 28 chòm sao Nhị thập bát tú khi chiếu xuống cát tinh và hung tinh của ngày.',
    category: 'Lịch Pháp',
    date: '05/07/2026'
  }
]

useSeoMeta({
  title: 'Cẩm Nang Lịch Pháp & Phong Thủy - Lịch Vạn Niên',
  description: 'Tổng hợp các bài viết hướng dẫn xem ngày tốt xấu, giải nghĩa các khái niệm phong thủy, can chi, trực, sao và các ngày lễ tết truyền thống.'
})
</script>

<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <div class="text-center space-y-2 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold text-slate-950 sm:text-3xl">Cẩm Nang Lịch Pháp</h2>
      <p class="text-slate-500 text-sm">Các bài viết chia sẻ kiến thức, kinh nghiệm xem ngày lành tháng tốt và phong tục truyền thống Việt Nam</p>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="article in articles" 
        :key="article.title" 
        class="glass-panel glass-panel-hover rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-4"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-amber-600 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
              {{ article.category }}
            </span>
            <span class="text-slate-400 font-mono">{{ article.date }}</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 leading-snug hover:text-amber-600 cursor-pointer transition-colors">
            {{ article.title }}
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            {{ article.summary }}
          </p>
        </div>

        <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
          <span class="text-slate-400">Người đăng: Ban Biên Tập</span>
          <button class="text-amber-600 font-semibold hover:underline flex items-center gap-1">
            Đọc bài viết
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Stub Info Alert -->
    <div class="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-center text-xs text-amber-700 max-w-xl mx-auto">
      <strong>Lưu ý:</strong> Mục cẩm nang đang trong quá trình chuẩn bị bài viết và sẽ tích hợp hệ thống bài viết tĩnh ở giai đoạn tiếp theo.
    </div>
  </div>
</template>
