<template>
  <div>
    <div class="nev">
      <div >
        <button type="button" @click="goManageProduct">จัดการสินค้า</button>
      </div>
      <div >
        <button type="button" @click="goManageOrder">จัดการออเดอร์</button>
      </div>
      <div >
        <button type="button" >เพิ่มออร์เดอร์</button>
      </div>
    </div>
    

    <h2>🛒 สร้างออร์เดอร์ใหม่</h2>

    <form @submit.prevent="addToCart" class="formAddOrder">
      <input
        v-model="form.prod_name"
        placeholder="ชื่อสินค้า"
        list="product-options"
        required
        class="nameProduct"
      />
      <datalist id="product-options">
        <option v-for="item in products" :key="item._id" :value="item.prod_name" />
      </datalist>

      <input 
        v-model.number="form.quantity" 
        type="number" 
        placeholder="จำนวน" 
        min="1" 
        required 
        class="qtyProduct"
      />

      <button type="submit" >เพิ่ม</button>
    </form>

    <h3>🧾 รายการที่เลือก</h3>

    <table border="1" style="justify-content: center;">
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>เมนู</th>
          <th>จำนวน</th>
          <th>ราคา</th>
          <th>จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.prod_name }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price * item.quantity }}</td>
          <td><button @click="removeFromCart(index)">ลบ</button></td>
        </tr>
      </tbody>
    </table>


    

    <button @click="submitOrder" :disabled="cart.length === 0">✅ สร้างออร์เดอร์</button>

    <!-- POPUP รับเงิน -->
     <transition name="fade">
    <div v-if="showPaymentModal" class="modal">
      <div class="modal-content">
        <h3>💰 ชำระเงิน</h3>
        <p>ยอดรวม: {{ paymentTotal }} บาท</p>
        <input type="number" v-model.number="receivedMoney" placeholder="กรุณากรอกจำนวนเงินที่รับมา" />
        <div class="modal-actions">
          <button @click="confirmPayment">รับเงิน</button>
          <button @click="cancelPayment">ยกเลิก</button>
        </div>
      </div>
    </div>
  </transition>

    <!-- POPUP แจ้งเงินทอน -->
     <transition name="fade">
    <div v-if="showChangeModal" class="modal">
      <div class="modal-content">
        <h3>💵 เงินทอน</h3>
        <p>ยอดเงินที่รับมา: {{ receivedMoney }} บาท</p>
        <p>ยอดรวม: {{ paymentTotal }} บาท</p>
        <p>💰 เงินทอน: {{ changeAmount }} บาท</p>
        <div class="modal-actions">
          <button @click="closeChangeModal">ตกลง</button>
        </div>
      </div>
    </div>
    </transition>
  

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const goManageOrder = () => router.push('/manage-order')
const goManageProduct = () => router.push('/')

// โหลดสินค้า
const products = ref([])
const loadProducts = async () => {
  try {
    const res = await axios.get('/allProducts')
    products.value = res.data
  } catch (err) {
    console.error('โหลดสินค้าล้มเหลว:', err)
  }
}
onMounted(loadProducts)

// ฟอร์มเพิ่มสินค้า
const form = ref({
  prod_name: '',
  quantity: 0
})

// ตะกร้า
const cart = ref([])

const addToCart = () => {
  if (!form.value.prod_name || form.value.quantity <= 0) {
    alert('กรอกชื่อสินค้าและจำนวนให้ถูกต้อง')
    return
  }

  cart.value.push({
    prod_name: form.value.prod_name,
    quantity: form.value.quantity
  })

  // ล้างฟอร์ม
  form.value.prod_name = ''
  form.value.quantity = 1
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}



const showPaymentModal = ref(false)
const paymentTotal = ref(0)
const receivedMoney = ref(0)
let currentOrderId = null

const submitOrder = async () => {
  try {
    const res = await axios.post('/createNewOrder', {
      items: cart.value
    })

    currentOrderId = res.data._id
    paymentTotal.value = res.data.priceTotal
    receivedMoney.value = 0
    showPaymentModal.value = true

  } catch (err) {
    console.error('สร้างออร์เดอร์ล้มเหลว:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาด')
  }
}


const cancelPayment = async () => {
  showPaymentModal.value = false
  if (currentOrderId) {
    await axios.delete(`/resetOrder/${currentOrderId}`)
    alert('❌ ยกเลิกการชำระเงินแล้ว')
  }
  
}


const showChangeModal = ref(false)
const changeAmount = ref(0)
const closeChangeModal = () => {
  showChangeModal.value = false
}

const confirmPayment = async () => {
  try {
    const paymentRes = await axios.patch(`/paymentOrder/${currentOrderId}`, {
      money: receivedMoney.value
    })

    changeAmount.value = paymentRes.data.change
    showPaymentModal.value = false
    showChangeModal.value = true
    cart.value = []

  } catch (err) {
    console.error('ชำระเงินล้มเหลว:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการชำระเงิน')
  }
}

</script>


