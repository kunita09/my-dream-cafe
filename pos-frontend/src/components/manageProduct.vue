<template>
  <div>
    <div class="nev">
      <div >
        <button type="button" >จัดการสินค้า</button>
      </div>
      <div >
        <button type="button" @click="goManageOrder">จัดการออเดอร์</button>
      </div>
      <div >
        <button type="button" @click="goNewOrder">เพิ่มออร์เดอร์</button>
      </div>
    </div>


    <h2>📦 จัดการสินค้า</h2>

    <!-- Form เพิ่ม / แก้ไข -->
    <form @submit.prevent="handleSubmit" class="formAddProduct">
      <input v-model="form.prod_name" placeholder="ชื่อเมนู" required class="productName"/>
      <input v-model.number="form.prod_price" type="number" placeholder="ราคา" required class="productPrice"/>
      <select v-model="form.prod_type" required class="productType">
        <option disabled value=""> ประเภทสินค้า </option>
        <option value="เบเกอรี่">เบเกอรี่</option>
        <option value="เครื่องดื่ม">เครื่องดื่ม</option>
      </select>
      <button type="submit">{{ form._id ? 'อัปเดต' : 'เพิ่ม' }}</button>
    </form>

    <hr />

    <!-- ตารางแสดงข้อมูล -->
    <table border="1">
      <thead>
        <tr>
          <th class="col-name">ชื่อ</th>
          <th class="col-price">ราคา</th>
          <th class="col-type">ประเภท</th>
          <th>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item._id">
          <td>{{ item.prod_name }}</td>
          <td>{{ item.prod_price }}</td>
          <td>{{ item.prod_type }}</td>
          <td>
            <button @click="editProduct(item)">แก้ไข</button>
            <button @click="deleteProduct(item._id)">ลบ</button>
          </td>
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
const goManageOrder = () => router.push('/manage-order') 
const goNewOrder = () => router.push('/new-order')


const products = ref([])
const form = ref({
  prod_name: '',
  prod_price: '',
  prod_type: '',
  _id: null, // ใช้สำหรับกรณีแก้ไข
})

const loadProducts = async () => {
  try {
    const res = await axios.get('/allProducts')
    products.value = res.data
  } catch (err) {
    console.error('โหลดสินค้าล้มเหลว:', err)
  }
}

const handleSubmit = async () => {
  try {
    if (form.value._id) {
      // แก้ไขสินค้า
      await axios.put(`/updateProduct/${form.value._id}`, {
        prod_name: form.value.prod_name,
        prod_price: form.value.prod_price,
        prod_type: form.value.prod_type
      })
      alert('อัปเดตสินค้าสำเร็จ')
    } else {
      // เพิ่มสินค้าใหม่
      await axios.post('/createProduct', {
        prod_name: form.value.prod_name,
        prod_price: form.value.prod_price,
        prod_type: form.value.prod_type
      })
      alert('เพิ่มสินค้าสำเร็จ')
    }

    resetForm()      // รีเซตข้อมูลในฟอร์ม
    loadProducts()   // โหลดรายการสินค้าล่าสุด
  } catch (err) {
    console.error('บันทึกข้อมูลล้มเหลว:', err)
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  }
}


const editProduct = (item) => {
  form.value = { ...item }
}

const deleteProduct = async (id) => {
  if (alert('ต้องการลบใช่หรือไม่')) {
    try {
      await axios.delete(`/deleteProduct/${id}`)
      loadProducts()
    } catch (err) {
      console.error('ลบไม่สำเร็จ:', err)
    }
  }
}

const resetForm = () => {
  form.value = {
    prod_name: '',
    prod_price: '',
    prod_type: '',
    _id: null,
  }
}

onMounted(loadProducts)
</script>
