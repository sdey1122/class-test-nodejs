const Product = require("../models/product.model");
const { success, error } = require("../utils/responseHandler");
const codes = require("../utils/responseCodes");

class ProductController {
  // CREATE PRODUCT
  async createProduct(req, res) {
    try {
      const { name } = req.body;

      const existing = await Product.findOne({ name });

      if (existing) {
        return error(
          res,
          { message: "Product name already exists", field: "name" },
          codes.ERROR.BAD_REQUEST,
        );
      }

      const product = await Product.create(req.body);

      return success(res, product, codes.SUCCESS.CREATED);
    } catch (err) {
      return error(res, err, codes.ERROR.BAD_REQUEST);
    }
  }

  // GET ALL PRODUCTS
  async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        sort = "-createdAt",
      } = req.query;

      const query = { isDeleted: false };

      if (search) {
        query.$text = { $search: search };
      }

      if (category) query.category = category;
      if (brand) query.brand = brand;

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const products = await Product.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Product.countDocuments(query);

      return success(res, {
        total,
        page: Number(page),
        limit: Number(limit),
        data: products,
      });
    } catch (err) {
      return error(res, err);
    }
  }

  // GET SINGLE PRODUCT
  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product || product.isDeleted) {
        return error(
          res,
          new Error("Product not found"),
          codes.ERROR.NOT_FOUND,
        );
      }

      return success(res, product);
    } catch (err) {
      return error(res, err);
    }
  }

  // UPDATE PRODUCT
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const { name } = req.body;

      const existing = await Product.findOne({
        _id: { $ne: productId },
        name,
      });

      if (existing) {
        return error(
          res,
          { message: "Product name already exists", field: "name" },
          codes.ERROR.BAD_REQUEST,
        );
      }

      const updated = await Product.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return error(
          res,
          new Error("Product not found"),
          codes.ERROR.NOT_FOUND,
        );
      }

      return success(res, updated);
    } catch (err) {
      return error(res, err);
    }
  }

  // SOFT DELETE OF A PRODUCT
  async softDelete(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true },
      );

      if (!product) {
        return error(
          res,
          new Error("Product not found"),
          codes.ERROR.NOT_FOUND,
        );
      }

      return success(res, {}, codes.SUCCESS.OK);
    } catch (err) {
      return error(res, err);
    }
  }

  // RESTORE A PRODUCT
  //   async restore(req, res) {
  //     try {
  //       const product = await Product.findByIdAndUpdate(
  //         req.params.id,
  //         { isDeleted: false },
  //         { new: true }
  //       );

  //       if (!product) {
  //         return error(
  //           res,
  //           new Error("Product not found"),
  //           codes.ERROR.NOT_FOUND
  //         );
  //       }

  //       return success(res);
  //     } catch (err) {
  //       return error(res, err);
  //     }
  //   }

  // HARD DELETE A PRODUCT
  //   async hardDelete(req, res) {
  //     try {
  //       const product = await Product.findByIdAndDelete(req.params.id);

  //       if (!product) {
  //         return error(
  //           res,
  //           new Error("Product not found"),
  //           codes.ERROR.NOT_FOUND
  //         );
  //       }

  //       return success(res);
  //     } catch (err) {
  //       return error(res, err);
  //     }
  //   }
}

module.exports = new ProductController();
