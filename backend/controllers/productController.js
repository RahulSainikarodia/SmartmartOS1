const supabase = require('../config/supabase');

// @desc    Get all products (optionally filtered by owner)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { ownerId } = req.query;
    let query = supabase.from('products').select('*');
    
    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data: products, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, brand, price, is_available, size, size_unit } = req.body;

    if (!name || !brand || !price || size === undefined) {
      return res.status(400).json({ message: 'Please provide name, brand, price, and size' });
    }

    const { data: createdProduct, error } = await supabase
      .from('products')
      .insert([
        { 
          name, 
          brand,
          price: parseFloat(price), 
          is_available: is_available === true || is_available === 'true',
          size: parseFloat(size),
          size_unit: size_unit || 'g',
          owner_id: req.user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, brand, price, is_available, size, size_unit } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (is_available !== undefined) updateData.is_available = is_available === true || is_available === 'true';
    if (size !== undefined) updateData.size = parseFloat(size);
    if (size_unit) updateData.size_unit = size_unit;

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', req.params.id)
      .eq('owner_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found or unauthorized' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .eq('owner_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
