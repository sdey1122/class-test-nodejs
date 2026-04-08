require("dotenv").config();

const express = require("express");
const path = require("path");

const dbConnect = require("./app/config/db");

const productRoutes = require("./app/routes/product.routes");

const app = express();

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Product API Running",
  });
});

const PORT = process.env.PORT || 4800;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






































// {
//   "name": "Nike Air Max",
//   "price": 120,
//   "brand": "Nike",
//   "category": "Shoes",
//   "variants": [
//     { "size": "M", "color": "Red", "stock": 10 }
//   ]
// }
