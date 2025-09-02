import { Product } from "../models/Product.model.js";
import { User } from "../models/User.model.js";

const addProduct = async (req, res) => {
  try {
    const { title, description, price, in_stock, Categories, rating } = req.body;

    console.log("req", req);
    console.log("file", req.files);

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const imagePath = `/public/uploads/${req.file.filename}`;

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
      image: imagePath,
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
      message: error,
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
      message: "product found",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "could not fetch the product ",
    });
  }
};

export { addProduct, fetchProducts, fetchSingleProduct };
