const Cart = require('../models/Cart.models');
const Product = require('../models/Product.models');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOrCreateCart(req.user.id);
    await cart.getPopulatedCart();

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Validate quantity
    const qty = parseInt(quantity);
    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not available'
      });
    }

    // Check stock availability
    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Check minimum and maximum order quantities
    if (qty < product.minOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity is ${product.minOrderQuantity}`
      });
    }

    if (product.maxOrderQuantity && qty > product.maxOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum order quantity is ${product.maxOrderQuantity}`
      });
    }

    // Get or create cart
    let cart = await Cart.findOrCreateCart(req.user.id);

    // Check if adding this quantity would exceed stock
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    const totalQuantityAfterAdd = existingItem ? 
      existingItem.quantity + qty : qty;

    if (totalQuantityAfterAdd > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${qty} items. Only ${product.stock - (existingItem ? existingItem.quantity : 0)} more items can be added`
      });
    }

    // Add item to cart
    await cart.addItem(productId, qty, product.price);
    await cart.getPopulatedCart();

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const qty = parseInt(quantity);
    if (qty < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // If quantity is 0, remove item
    if (qty === 0) {
      await cart.removeItem(productId);
      await cart.getPopulatedCart();
      
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        cart
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not available'
      });
    }

    // Check stock availability
    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Update item quantity
    await cart.updateItemQuantity(productId, qty);
    await cart.getPopulatedCart();

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if item exists in cart
    const itemExists = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove item
    await cart.removeItem(productId);
    await cart.getPopulatedCart();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    // Get cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear cart
    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        summary: {
          totalItems: 0,
          totalAmount: 0,
          isEmpty: true
        }
      });
    }

    res.status(200).json({
      success: true,
      summary: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length,
        isEmpty: false
      }
    });

  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
};