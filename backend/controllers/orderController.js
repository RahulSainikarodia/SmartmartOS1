const supabase = require('../config/supabase');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice, orderType, paymentStatus } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Create order
    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: req.user.id,
          order_items: orderItems,
          total_price: parseFloat(totalPrice),
          order_type: orderType,
          payment_status: paymentStatus || 'unpaid',
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Update stock
    for (const item of orderItems) {
      const { data: product } = await supabase
        .from('products')
        .select('stockQuantity')
        .eq('id', item.product)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ stockQuantity: product.stockQuantity - item.quantity })
          .eq('id', item.product);
      }
    }

    // Handle debt
    if (paymentStatus === 'debt') {
      const { data: user } = await supabase
        .from('users')
        .select('debt')
        .eq('id', req.user.id)
        .single();

      if (user) {
        await supabase
          .from('users')
          .update({ debt: (user.debt || 0) + parseFloat(totalPrice) })
          .eq('id', req.user.id);
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (
          name,
          email
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
