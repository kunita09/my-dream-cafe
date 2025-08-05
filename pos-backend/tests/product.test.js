const productController = require('../controllers/productController');
const productModel = require('../models/productModel');
const counterModel = require('../models/counterModel');

jest.mock('../models/productModel');
jest.mock('../models/counterModel');

describe('POST /createProduct', () => {
  it('should create a product and return product list', async () => {
    const req = {
      body: {
        prod_name: 'เค้กใบเตย',
        prod_price: 60,
        prod_type: 'ขนม'
      }
    };

    const res = {
      json: jest.fn()
    };

    const next = jest.fn();

    // Mock counterModel
    counterModel.findOneAndUpdate.mockResolvedValue({ value: 1 });

    // Mock productModel.create
    const mockCreatedProduct = {
      id: 1,
      prod_name: 'เค้กใบเตย',
      prod_price: 60,
      prod_type: 'ขนม'
    };
    productModel.create.mockResolvedValue(mockCreatedProduct);

    // Mock productModel.find
    productModel.find.mockResolvedValue([mockCreatedProduct]);

    // เรียก controller
    await productController.createProduct(req, res, next);

    // ตรวจสอบว่าเรียก create ด้วยข้อมูลที่ถูกต้อง
    expect(productModel.create).toHaveBeenCalledWith({
      id: 1,
      prod_name: 'เค้กใบเตย',
      prod_price: 60,
      prod_type: 'ขนม'
    });

    // ตรวจสอบว่า res.json ถูกเรียกด้วยผลลัพธ์ที่ mock ไว้
    expect(res.json).toHaveBeenCalledWith([mockCreatedProduct]);
  });
});


describe('GET /getAllProducts', () => {
  const mockproduct = [
    {
      id: 1,
      prod_name: 'เค้กใบเตย',
      prod_price: 60,
      prod_type: 'ขนม'
    }
  ];

  const req = {}; // ไม่มี params
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // ล้าง mock ก่อนแต่ละ test
  });

  it('เจอ', async () => {
    productModel.find.mockResolvedValue(mockproduct);

    await productController.getAllProducts(req, res, next);

    expect(productModel.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockproduct);
    
  });

  it('ไม่เจอ', async () => {
    productModel.find.mockResolvedValue(null);

    await productController.getAllProducts(req, res, next);

    // expect(productModel.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product not found'
    })
  });

  it('err อย่างอื่น', async () => {
    const err = new Error('Database ERR');
    productModel.find.mockRejectedValue(err);

    await productController.getAllProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});