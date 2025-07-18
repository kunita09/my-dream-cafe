// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// นำเข้าคอมโพเนนต์ที่ต้องการใช้ในแต่ละหน้า
import ManageProduct from '../components/manageProduct.vue'
import ManageOrder from '../components/manageOrder.vue'
import NewOrder from '../components/newOrder.vue'

// ถ้ามีหน้า Home ก็ import ด้วย (ไม่บังคับ)
// import HomePage from '../views/HomePage.vue'

const routes = [
  // ตัวอย่างหน้า Home
  // { path: '/', name: 'Home', component: HomePage },
  { path: '/', name: 'ManageProduct', component: ManageProduct },
  { path: '/manage-order', name: 'ManageOrder', component: ManageOrder },
  { path: '/new-order', name: 'NewOrder', component: NewOrder }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
