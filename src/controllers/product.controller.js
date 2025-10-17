import { Product } from "../models/Product.model.js";
import { User } from "../models/User.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUtils.js";

const addProduct = async (req, res) => {
  try {
    const { title, description, price, in_stock, Categories, rating } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, "products");
    console.log("uploadResult", uploadResult);
    const Admin = await User.findById(req.user._id);

    if (!Admin.isAdmin) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const product = await Product.create({
      title,
      description,
      price,
      in_stock,
      Categories,
      rating,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

    if (!product) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    return res.status(201).json({
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log("Error while adding product", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const fetchProducts = async (req, res) => {
  try {
    let perPage = parseInt(req.query.perPage) || 5;
    let page = parseInt(req.query.page) || 1;
    let Categories = req.query.Categories;

    let productFilter = {};
    if (Categories) {
      productFilter.Categories = Categories;
    }

    let products = await Product.find(productFilter)
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalProducts = await Product.countDocuments(products);

    res.status(200).json({
      page: page,
      perPage: perPage,
      total: totalProducts,
      data: products,
    });
  } catch (error) {
    console.log("error while fetch products", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const fetchSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("prod", product);
    console.log("params", req.params);
    if (!product) {
      return res.status(404).json({
        message: "could not find the product",
      });
    }
    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q: query, category, minPrice, maxPrice, inStock, page = 1, limit = 20 } = req.query;

    if (!query?.trim()) {
      return res.status(400).json({
        message: "Search query is required",
        suggestions: ["Try specific product names", "Use fewer keywords"],
      });
    }

    const searchConditions = {
      $and: [{ $text: { $search: query.trim() } }],
    };

    if (category) {
      searchConditions.$and.push({
        Categories: category,
      });
    }

    if (minPrice || maxPrice) {
      searchConditions.$and.push({
        price: {
          ...(minPrice && { $gte: parseFloat(minPrice) }),
          ...(maxPrice && { $lte: parseFloat(maxPrice) }),
        },
      });
    }

    if (inStock === "true") {
      searchConditions.$and.push({ in_stock: { $gte: 0 } });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(searchConditions, {
        score: { $meta: "textScore" },
        title: 1,
        price: 1,
        image: 1,
        Categories: 1,
        in_stock: 1,
      })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(searchConditions),
    ]);

    return res.status(200).json({
      message: products.length ? "Search results found" : "No products found",
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        applied: { category, minPrice, maxPrice, inStock },
      },
    });
  } catch (error) {
    console.error("Search error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid filter parameters",
        details: "Check price ranges or category values",
      });
    }

    res.status(500).json({
      message: "Search temporarily unavailable",
      retry: true,
    });
  }
};

export { addProduct, fetchProducts, fetchSingleProduct, searchProducts };
