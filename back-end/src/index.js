const express = require("express");
const dotenv = require("dotenv");
const path = require("path"); // Thư viện để xử lý đường dẫn
const mongoose = require("mongoose");
const dns = require("dns");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
dns.setServers(["1.1.1.1", "1.0.0.1"]);
// GIẢI THÍCH:
// __dirname là: "D:\Workspace\back-end\src"
// path.join(__dirname, ".env") sẽ tạo ra: "D:\Workspace\back-end\src\.env"
// Đây là địa chỉ CHÍNH XÁC 100% để thằng dotenv tìm thấy file.
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Giờ đây process.env.PORT đã đọc được số 5000 từ file .env
// Nếu đọc thất bại, nó mới dùng số 7000 (để bạn dễ nhận biết)
const port = process.env.PORT || 7000;
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect DB is success!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});