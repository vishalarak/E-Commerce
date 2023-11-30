const express = require("express");
const router = express.Router();
router.use(express.json());

// Import the pool or database connection
const pool = require("../../db");

router.get("/porducts", function (req, res) {
  res.send("it's Home Page!!!");
});

//registration page
router.post("/addProduct", async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      main_category_id,
      sub_category_id,
      status,
    } = req.body;

    // Execute the query using the established pool
    const newUser = await pool.query(
      "INSERT INTO products (id, title, description, main_category_id, sub_category_id,status) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *",
      [id, title, description, main_category_id, sub_category_id, status]
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// All products
router.get("/allProducts", async (req, res) => {
  try {
    const allProducts = await pool.query("SELECT * FROM products");
    if (allProducts.rows.length === 0) {
      // If no user found, send a custom message
      return res.status(404).json({ message: "Products not found" });
    }

    res.json(allProducts.rows); // Send rows from the query result
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// search products
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params
    const productSearch = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (productSearch.rows.length === 0) {
      // If no user found, send a custom message
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(productSearch.rows); // Send rows from the query result
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// update product
router.put("/updateProduct/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params

    const { title, description, main_category_id, sub_category_id, status } =
      req.body; // Extract individual fields from req.body

    const updateUser = await pool.query(
      "UPDATE products SET title = $1, description = $2, main_category_id = $3, sub_category_id = $4, status = $5 WHERE id =$6",
      [title, description, main_category_id, sub_category_id, status, id] // Add id to the parameter list
    );

    res.json("Product updated!!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// delete products
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params

    const deleteProduct = await pool.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );

    res.json("Product deleted!!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;