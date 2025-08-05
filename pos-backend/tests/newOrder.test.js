const { createOrder, paymentOrder, resetOrder } = require('../controllers/newOrderController');
const Product = require('../models/productModel');
const orderModel = require('../models/orderModel');
const counter = require('../models/counterModel');

jest.mock('../models/productModel');
jest.mock('../models/orderModel');
jest.mock('../models/counterModel');

describe('POST /createNewOrder', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        items: [
          { prod_name: 'เค้กส้ม', quantity: 2 },
          { prod_name: 'ชาเย็น', quantity: 1 }
        ]
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it('should create order successfully', async () => {
    // Mock product lookups
    Product.findOne
      .mockResolvedValueOnce({ _id: '1', prod_name: 'เค้กส้ม', prod_price: 65 })
      .mockResolvedValueOnce({ _id: '2', prod_name: 'ชาเย็น', prod_price: 55 });

    // Mock counter
    counter.findOneAndUpdate.mockResolvedValue({ value: 1 });

    // Mock save
    const mockSave = jest.fn().mockResolvedValue({
      orderNumber: 1,
      items: expect.any(Array),
      priceTotal: 400,
      status: 'ยังไม่ได้ชำระเงิน',
      create_at: expect.any(Date)
    });
    orderModel.mockImplementation(() => ({
      save: mockSave
    }));

    await createOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      orderNumber: 1,
      priceTotal: 400
    }));
  });

  it('should return 404 if quantity is invalid', async () => {
    req.body.items[0].quantity = -1;

    await createOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'จำนวนไม่ถูกต้อง' });
  });

  it('should return 400 if product not found', async () => {
    Product.findOne.mockResolvedValueOnce(null);

    await createOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'ไม่พบสินค้า: เค้กส้ม' });
  });

  it('should call next(err) on unexpected error', async () => {
    Product.findOne.mockRejectedValue(new Error('Database error'));

    await createOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});





describe('PATCH /paymentOrder', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: 'order123' },
      body: { money: 1000 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 404 if order not found', async () => {
    orderModel.findById.mockResolvedValue(null);

    await paymentOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
  });

  it('should return 400 if money is less than total price', async () => {
    const mockOrder = {
      priceTotal: 1200
    };
    orderModel.findById.mockResolvedValue(mockOrder);

    req.body.money = 1000;

    await paymentOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'เงินไม่พอชำระ' });
  });

  it('should update order and return payment info', async () => {
    const mockOrder = {
      priceTotal: 900,
      save: jest.fn().mockResolvedValue({
        priceTotal: 900,
        paidAmount: 1000,
        change: 100,
        status: 'ชำระแล้ว'
      })
    };
    orderModel.findById.mockResolvedValue(mockOrder);

    req.body.money = 1000;

    await paymentOrder(req, res, next);

    expect(mockOrder.status).toBe('ชำระแล้ว');
    expect(mockOrder.paidAmount).toBe(1000);
    expect(mockOrder.change).toBe(100);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'ชำระเงินเรียบร้อย',
      total: 900,
      paid: 1000,
      change: 100,
      currency: 'THB',
      order: expect.any(Object)
    }));
  });

  it('should call next(err) on error', async () => {
    orderModel.findById.mockRejectedValue(new Error('Database error'));

    await paymentOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});





describe('DELATE /resetNewOrder', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: 'order123' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 404 if order not found', async () => {
    orderModel.findByIdAndUpdate.mockResolvedValue(null);

    await resetOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
  });

  it('should reset order successfully', async () => {
    const mockUpdatedOrder = {
      _id: 'order123',
      items: [],
      priceTotal: null,
      status: null,
      orderNumber: null,
      change: null,
      paidAmount: null,
      create_at: null
    };

    orderModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedOrder);

    await resetOrder(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Order reset successfully',
      order: mockUpdatedOrder
    });
  });

  it('should call next(err) on error', async () => {
    orderModel.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));

    await resetOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});