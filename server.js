const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app.js");
const ensureCashCustomerExists = require("./utils/initCashCustomer.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

(async function startServer() {
  try {
    // 1️⃣ اتصال قاعدة البيانات
    await mongoose.connect(DB);
    console.log("✅ Database connected successfully");

    // 2️⃣ تأكد من وجود عميل الكاش
    const cashCustomerId = await ensureCashCustomerExists();
    process.env.CASH_CUSTOMER_ID = cashCustomerId;

    // 3️⃣ شغل السيرفر
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
})();
