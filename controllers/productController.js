import Product from '../models/Product.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort,
    featured
  } = req.query;

  const filter = { isActive: true };

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Rating filter
  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  // Featured filter
  if (featured === 'true') {
    filter.isFeatured = true;
  }

  // Sort options
  let sortOptions = { createdAt: -1 };
  if (sort) {
    switch (sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
    }
  }

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .select('-reviews')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    products,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('reviews.user', 'firstName lastName');

  if (product) {
    res.json({
      success: true,
      product
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    salePrice,
    sku,
    category,
    stock,
    images = [],
    specifications = [],
    tags = [],
    isFeatured,
    isActive,
    lowStockThreshold
  } = req.body;

  // Check if product exists
  const productExists = await Product.findOne({ sku });
  if (productExists) {
    res.status(400);
    throw new Error('Product with this SKU already exists');
  }

  // Ensure unique slug based on name
  const baseSlug = slugify(name);
  let uniqueSlug = baseSlug;
  let slugCounter = 2;
  while (await Product.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${slugCounter}`;
    slugCounter += 1;
  }

  const product = await Product.create({
    name,
    slug: uniqueSlug,
    description,
    price,
    salePrice,
    sku,
    category,
    stock,
    images,
    specifications,
    tags,
    ...(typeof isFeatured !== 'undefined' ? { isFeatured: Boolean(isFeatured) } : {}),
    ...(typeof isActive !== 'undefined' ? { isActive: Boolean(isActive) } : {}),
    ...(typeof lowStockThreshold !== 'undefined' ? { lowStockThreshold: Number(lowStockThreshold) } : {})
  });

  if (product) {
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');
    
    res.status(201).json({
      success: true,
      product: populatedProduct
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const {
      name,
      description,
      price,
      salePrice,
      sku,
      category,
      stock,
      images,
      specifications,
      tags,
      isActive,
      isFeatured
    } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.images = images || product.images;
    product.specifications = specifications || product.specifications;
    product.tags = tags || product.tags;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

    if (name && name !== product.name) {
      // Recompute slug and ensure uniqueness (excluding current product)
      const baseSlug = slugify(name);
      let uniqueSlug = baseSlug;
      let slugCounter = 2;
      while (await Product.exists({ slug: uniqueSlug, _id: { $ne: product._id } })) {
        uniqueSlug = `${baseSlug}-${slugCounter}`;
        slugCounter += 1;
      }
      product.slug = uniqueSlug;
    }

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('category', 'name slug');

    res.json({
      success: true,
      product: populatedProduct
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({
      success: true,
      message: 'Product deleted'
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.calculateRating();

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added'
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});