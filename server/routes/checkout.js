// const { Orders } = require('../models/orders');
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // const createOrder = async (customer, data) => {
// //     const items = JSON.parse(customer.metadata.cart);

// //     const newOrder = new Orders({
// //         userId: customer.metadata.userId,
// //         customerId: data.customer,
// //         paymentIntentId: data.payment_intent,
// //         products: items,
// //         subtotal: parseInt(data.amount_subtotal / 100),
// //         total: parseInt(data.amount_total / 100),
// //         shipping: data.customer_details,
// //         payment_status: data.payment_status
// //     });
// //     await newOrder.save();
// // };
// const createOrder = async (customer, data) => {
//     try {
//         const items = JSON.parse(customer.metadata.cart);

//         const newOrder = new Orders({
//             name: customer.name, // Cập nhật thông tin tên từ customer hoặc metadata
//             phoneNumber: customer.phone, // Cập nhật thông tin số điện thoại từ customer
//             address: customer.address, // Cập nhật thông tin địa chỉ từ customer
//             pincode: customer.pincode, // Cập nhật thông tin mã bưu điện từ customer
//             amount: data.amount_total / 100, // Đảm bảo amount là một số, không phải string
//             email: customer.email, // Cập nhật email từ customer
//             userId: customer.metadata.userId, // ID người dùng từ metadata
//             paymentId: data.payment_intent, // ID thanh toán từ Stripe
//             products: items.map(item => ({
//                 productName: item.product_data.name,
//                 quantity: item.quantity,
//                 price: item.price_data.unit_amount / 100, // Đảm bảo giá trị không bị sai đơn vị
//                 image: item.product_data.images[0] || '', // Cập nhật ảnh sản phẩm (nếu có)
//                 total: item.quantity * (item.price_data.unit_amount / 100)
//             })),
//         });

//         // Lưu đơn hàng vào cơ sở dữ liệu
//         await newOrder.save();
//         console.log('Order saved successfully');
//     } catch (error) {
//         console.error('Error saving order:', error);
//     }
// };

// router.post('/', async (req, res) => {
//     const products = req.body.products;

//     const lineItems = products.map((product) => ({
//         price_data: {
//             currency: 'inr',
//             product_data: {
//                 name: product.productTitle.substr(0, 30) + '...',
//             },
//             unit_amount: product.price * 100,
//         },
//         quantity: product.quantity
//     }));

//     const customer = await stripe.customers.create({
//         metadata: {
//             userId: req.body.userId,
//             cart: JSON.stringify(lineItems)
//         }
//     });

//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         customer: customer.id,
//         line_items: lineItems,
//         mode: 'payment',
//         shipping_address_collection: {
//             allowed_countries: ['US', 'IN'],
//         },
//         success_url: `${process.env.CLIENT_BASE_URL}/payment/complete/{CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.CLIENT_BASE_URL}/cancel`,
//     });
//     res.json({ id: session.id });
// });

// // router.get(`/payment/complete`, async (req, res) => {
// //     const result = await Promise.all([
// //         stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
// //         stripe.checkout.sessions.listLineItems(req.query.session_id)
// //     ]);
// //     res.status(200).send(JSON.stringify(result));
// // });
// router.get(`/payment/complete`, async (req, res) => {
//     try {
//         // Lấy thông tin session từ Stripe
//         const result = await Promise.all([
//             stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
//             stripe.checkout.sessions.listLineItems(req.query.session_id)
//         ]);

//         const session = result[0];  // Lấy thông tin session
//         const items = result[1];    // Lấy các sản phẩm từ giỏ hàng

//         // Kiểm tra nếu thanh toán thành công
//         if (session.payment_status === 'succeeded') {
//             // Gọi hàm createOrder để lưu đơn hàng vào cơ sở dữ liệu
//             const customer = await stripe.customers.retrieve(session.customer);
//             await createOrder(customer, session);
            
//             // Trả về kết quả
//             res.status(200).json({ message: 'Payment successful and order saved.' });
//         } else {
//             res.status(400).json({ message: 'Payment not successful.' });
//         }
//     } catch (error) {
//         console.error('Error processing payment complete:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// // router.get('/payment/complete/:session_id', async (req, res) => {
// //     const session_id = req.params.session_id;
// //     const result = await Promise.all([
// //         stripe.checkout.sessions.retrieve(session_id, { expand: ['payment_intent.payment_method'] }),
// //         stripe.checkout.sessions.listLineItems(session_id)
// //     ]);
// //     res.status(200).send(JSON.stringify(result));
// // });


// router.get('/cancel', (req, res) => {
//     res.redirect('/');
// });

// module.exports = router;

const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Tạo đơn hàng trong cơ sở dữ liệu
const createOrder = async (customer, sessionData) => {
    try {
        const items = JSON.parse(customer.metadata.cart); // Lấy sản phẩm trong giỏ hàng từ metadata

        // Tạo đơn hàng mới với thông tin từ customer và session
        const newOrder = new Orders({
            name: customer.name || '', // Tên khách hàng
            phoneNumber: customer.phone || '', // Số điện thoại
            address: customer.address || '', // Địa chỉ
            pincode: customer.pincode || '', // Mã bưu điện
            amount: sessionData.amount_total / 100, // Tổng số tiền của đơn hàng (đã chuyển từ cents sang đơn vị tiền tệ)
            email: customer.email || '', // Email của khách hàng
            userId: customer.metadata.userId, // ID người dùng từ metadata
            paymentId: sessionData.payment_intent, // ID thanh toán từ Stripe
            products: items.map(item => ({
                productName: item.product_data.name, // Tên sản phẩm
                quantity: item.quantity, // Số lượng
                price: item.price_data.unit_amount / 100, // Giá sản phẩm (chuyển từ cents sang đơn vị tiền tệ)
                image: item.product_data.images[0] || '', // Ảnh sản phẩm (nếu có)
                total: item.quantity * (item.price_data.unit_amount / 100) // Tổng giá trị của sản phẩm (số lượng * giá)
            })),
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        await newOrder.save();
        console.log('Order saved successfully');
    } catch (error) {
        console.error('Error saving order:', error);
        throw new Error('Failed to save order');
    }
};

router.post('/', async (req, res) => {
    try {
        const products = req.body.products; // Lấy thông tin sản phẩm từ request body

        // Xây dựng các line items cho giỏ hàng
        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product.productTitle.substr(0, 30) + '...', // Giới hạn tên sản phẩm
                },
                unit_amount: product.price * 100, // Chuyển giá sản phẩm sang đơn vị tiền tệ (cents)
            },
            quantity: product.quantity, // Số lượng sản phẩm
        }));

        // Tạo khách hàng mới trên Stripe
        const customer = await stripe.customers.create({
            metadata: {
                userId: req.body.userId, // ID người dùng
                cart: JSON.stringify(lineItems), // Lưu thông tin giỏ hàng vào metadata
            }
        });

        // Tạo phiên thanh toán (checkout session)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customer.id, // ID khách hàng
            line_items: lineItems, // Các sản phẩm trong giỏ hàng
            mode: 'payment', // Chế độ thanh toán
            shipping_address_collection: {
                allowed_countries: ['US', 'IN'], // Các quốc gia được phép
            },
            success_url: `${process.env.CLIENT_BASE_URL}/payment/complete/{CHECKOUT_SESSION_ID}`, // URL thành công
            cancel_url: `${process.env.CLIENT_BASE_URL}/cancel`, // URL hủy bỏ
        });

        // Trả về ID phiên thanh toán
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Xử lý khi thanh toán hoàn tất
router.get(`/payment/complete`, async (req, res) => {
    try {
        // Lấy thông tin phiên thanh toán từ Stripe
        const result = await Promise.all([
            stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
            stripe.checkout.sessions.listLineItems(req.query.session_id)
        ]);

        const session = result[0];  // Lấy thông tin session
        const items = result[1];    // Lấy các sản phẩm trong giỏ hàng

        // Kiểm tra nếu thanh toán thành công
        if (session.payment_status === 'succeeded') {
            // Lấy thông tin khách hàng từ Stripe
            const customer = await stripe.customers.retrieve(session.customer);
            
            // Lưu đơn hàng vào cơ sở dữ liệu
            await createOrder(customer, session);

            // Trả về thông báo thành công
            res.status(200).json({ message: 'Payment successful and order saved.' });
        } else {
            res.status(400).json({ message: 'Payment not successful.' });
        }
    } catch (error) {
        console.error('Error processing payment complete:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Xử lý khi người dùng hủy thanh toán
router.get('/cancel', (req, res) => {
    res.redirect('/'); // Chuyển hướng về trang chủ
});

module.exports = router;
