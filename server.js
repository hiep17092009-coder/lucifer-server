// server.js
const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const axios = require("axios");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bộ nhớ tạm
const tokens = {};

// Token API YeuMoney (ẩn trong Render)
const YEUMONEY_API_TOKEN = process.env.YEUMONEY_API_TOKEN;

// Link base (Render web)
const BASE_URL = "https://lucifer-server.onrender.com";

// Sinh key ngẫu nhiên kiểu LUCIFER_xxx
function genKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rand = "";
  for (let i = 0; i < 10; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));
  return `LUCIFER_${rand}`;
}

// ---------------- GET-LINK ----------------
app.get("/get-link", async (req, res) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const keyval = genKey();
    const expire = Date.now() + 24 * 60 * 60 * 1000; // hết hạn sau 24h
    tokens[token] = { keyval, used: false, expire };

    const returnUrl = `${BASE_URL}/claim?token=${token}`;
    const api = `https://yeumoney.com/QL_api.php?token=${YEUMONEY_API_TOKEN}&format=text&url=${encodeURIComponent(returnUrl)}`;

    const r = await axios.get(api, { timeout: 8000 });
    const shortLink = (typeof r.data === "string") ? r.data.trim() : returnUrl;

    res.send(`
<pre style="font-size:13px;">
██╗░░░░░██╗░░░██╗░█████╗░██╗███████╗███████╗██████╗░
██║░░░░░██║░░░██║██╔══██╗██║██╔════╝██╔════╝██╔══██╗
██║░░░░░██║░░░██║██║░░╚═╝██║█████╗░░█████╗░░██████╔╝
██║░░░░░██║░░░██║██║░░██╗██║██╔══╝░░██╔══╝░░██╔══██╗
███████╗╚██████╔╝╚█████╔╝██║██║░░░░░███████╗██║░░██║
╚══════╝░╚═════╝░░╚════╝░╚═╝╚═╝░░░░░╚══════╝╚═╝░░╚═╝

Tool By: Boss Lucifer            Phiên Bản: V4
════════════════════════════════════════════════
[<>] BOX ZALO : https://zalo.me/g/naixkm421
[<>] YOUTUBE : LUCIFER DEV
[<>] ADMIN : Boss Lucifer
════════════════════════════════════════════════
[<>] Link Để Vượt Key Là : ${shortLink}

[<>] Mở link bên trên và hoàn tất (vượt). Sau khi hoàn tất, hãy quay lại và nhập KEY hiển thị trên trang kích hoạt.
</pre>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Lỗi khi tạo short link.");
  }
});

// ---------------- CLAIM ----------------
app.get("/claim", (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("<h2>❌ Thiếu token!</h2>");
  const data = tokens[token];
  if (!data) return res.status(404).send("<h2>❌ Token không tồn tại hoặc đã hết hạn!</h2>");

  if (!data.used && data.expire > Date.now()) {
    data.used = true;
    return res.send(`
      <h1>✅ Kích hoạt thành công!</h1>
      <p><b>Key của bạn là:</b> ${data.keyval}</p>
      <p>Sao chép key và nhập vào Lucifer Tool để tiếp tục.</p>
    `);
  }

  return res.status(400).send("<h2>❌ Token đã hết hạn hoặc đã được sử dụng!</h2>");
});

// ---------------- RUN ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lucifer server running on port ${PORT}`));