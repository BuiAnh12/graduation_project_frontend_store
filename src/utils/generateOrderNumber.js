const crypto = require("crypto");

const generateOrderNumber = (orderId) => {
  const hash = crypto.createHash("md5").update(orderId.toString()).digest("hex");
  const number = parseInt(hash.substring(0, 8), 16) % 1000000; // Ensure it's within 6 digits
  
  return number.toString().padStart(6, "0"); // Ensure it always has 6 digits
};

export default generateOrderNumber;
