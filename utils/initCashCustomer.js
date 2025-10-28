// utils/initCashCustomer.js
const User = require("../models/userModel.js");

async function ensureCashCustomerExists() {
  try {
    // 1️⃣ ابحث عن العميل الافتراضي
    let cashCustomer = await User.findOne({ role: "cash" });

    // 2️⃣ لو مش موجود → أنشئه
    if (!cashCustomer) {
      cashCustomer = await User.create({
        name: "Cash Customer",
        email: "cash@example.com",
        password: "12345678",
        passwordConfirm: "12345678", // ✅ لازم علشان الـ schema بتاعك
        role: "cash", // ✅ علشان نعرفه في المستقبل
      });
      console.log("✅ Cash Customer created:", cashCustomer._id);
    } else {
      console.log("ℹ️ Cash Customer already exists:", cashCustomer._id);
    }

    return cashCustomer._id;
  } catch (err) {
    console.error("❌ Error ensuring Cash Customer:", err.message);
  }
}

module.exports = ensureCashCustomerExists;
