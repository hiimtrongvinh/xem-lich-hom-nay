export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: '/xem-lich-hom-nay/'
  },
  tailwindcss: {
    config: {
      darkMode: 'class'
    }
  }
})



