<template>
  <div>
    <div class="nev">
      <div >
        <button type="button" @click="goManageProduct">จัดการสินค้า</button>
      </div>
      <div >
        <button type="button" >จัดการออเดอร์</button>
      </div>
      <div >
        <button type="button" @click="goNewOrder">เพิ่มออร์เดอร์</button>
      </div>
    </div>


    <h2>🧾 รายการคำสั่งซื้อ</h2>

    <p><strong>ยอดรวมทั้งหมด:</strong> {{ totalAllDay.toLocaleString() }} {{ currency }}</p>

    <button @click="handleReset" style="margin-bottom: 1rem;">🔄 รีเซ็ตคำสั่งซื้อ</button>

    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ออร์เดอร์</th>
          <th>วันที่</th>
          <th>จำนวนเงิน</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id">
          <td>{{ order.orderNumber }}</td>
          <td>{{ formatDate(order.create_at) }}</td>
          <td>{{ order.priceTotal.toLocaleString() || '0' }} {{ currency }}</td>
          <td>{{ order.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()               
const goManageProduct = () => router.push('/') 
const goNewOrder = () => router.push('/new-order')

const orders = ref([])
const totalAllDay = ref(0)
const currency = ref('THB')

const loadOrders = async () => {
  try {
    const res = await axios.get('/allTotal')
    orders.value = res.data.orders
    totalAllDay.value = res.data.totalAllDay
    currency.value = res.data.currency
  } catch (err) {
    console.error('โหลดคำสั่งซื้อล้มเหลว:', err)
  }
}

const handleReset = async () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตคำสั่งซื้อทั้งหมด?')) {
    try {
      await axios.delete('/resetOrders')
      alert('รีเซ็ตคำสั่งซื้อสำเร็จ')
      loadOrders()
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการรีเซ็ต:', err)
      alert('ไม่สามารถรีเซ็ตคำสั่งซื้อได้')
    }
  }
}

const formatDate = (isoStr) => {
  const date = new Date(isoStr)
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(loadOrders)
</script>
