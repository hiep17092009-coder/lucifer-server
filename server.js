// server.js
const express = require("express");
const app = express();
const crypto = require("crypto");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bộ nhớ tạm lưu token
const tokens = {};

function genKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "LUCIFER_";
  for (let i = 0; i < 10; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
  return key;
}

// Route chính
app.get("/", (req, res) => {
  res.send(`
  <pre>
██╗░░░░░██╗░░░██╗░█████╗░██╗███████╗███████╗██████╗░
██║░░░░░██║░░░██║██╔══██╗██║██╔════╝██╔════╝██╔══██╗
██║░░░░░██║░░░██║██║░░╚═╝██║█████╗░░█████╗░░██████╔╝
██║░░░░░██║░░░██║██║░░██╗██║██╔══╝░░██╔══╝░░██╔══██╗
███████╗╚██████╔╝╚█████╔╝██║██║░░░░░███████╗██║░░██║
╚══════╝░╚═════╝░░╚════╝░╚═╝╚═╝░░░░░╚══════╝╚═╝░░╚═╝

Tool By: Boss Lucifer            Phiên Bản: V4
════════════════════════════════════════════════
[<>] BOX ZALO : https://zalo.me/g/naixkm421
[<>] YOUTUBE : LUCIFER CHANNEL
[<>] ADMIN : Boss Lucifer
════════════════════════════════════════════════
[<>] Nhập /get-link để lấy link vượt
  </pre>
  `);
});

// Route tạo link vượt
app.get("/get-link", (req, res) => {
  const token = crypto.randomBytes(16).toString("hex");
  tokens[token] = { used: false, createdAt: Date.now() };
  const link = `https://yeumoney.com/uG25k_nDX`;
  res.json({ message: "Vượt link này để lấy key", link, token });
});

// Route người dùng nhập token để nhận key
app.get("/claim", (req, res) => {
  const { token } = req.query;
  if (!token || !tokens[token]) {
    return res.send("❌ Truy cập không hợp lệ!");
  }

  if (tokens[token].used) {
    return res.send("⚠️ Token này đã được sử dụng!");
  }

  tokens[token].used = true;
  const key = genKey();
  res.send(`
  <pre>
✅ Vượt thành công!
🔑 KEY CỦA BẠN: ${key}
  </pre>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server Lucifer đang chạy trên cổng " + PORT));
