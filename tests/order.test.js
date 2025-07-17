const newOrderController = require('../controllers/newOrderController');
const orderModel = require('../models/orderModel');

jest.mock('../models/orderModel');

describe('DELETE /resetOrder', () => {
    const req = { params: { id: '12345' } };
    const res = {
        json : jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('รีเซ็ตสำเร็จ', async () => {
        const mockOrder = {
            _id: '12345',
            items: [],
            priceTotal: null,
            status: null,
            orderNumber: null,
            change: null,
            paidAmount: null,
            create_at: null
        };

        orderModel.findByIdAndUpdate.mockResolvedValue(mockOrder);

        await newOrderController.resetOrder(req, res, next);
        
        expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(
            '12345',
            {
                items: [],
                priceTotal: null,
                status: null,
                orderNumber: null,
                change: null,
                paidAmount: null,
                create_at: null
            },
            { new: true }
        );

        expect(res.json).toHaveBeenCalledWith({
            message: 'Order reset successfully',
            order: mockOrder
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('ไม่เจอ', async () => {
        orderModel.findByIdAndUpdate.mockResolvedValue(null);

        await newOrderController.resetOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message: 'Order not found'});
    })

    it('err อย่างอื่น', async () => {
        const err = new Error('Database Error');
        orderModel.findByIdAndUpdate.mockRejectedValue(err);

        await newOrderController.resetOrder(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
    })
});
