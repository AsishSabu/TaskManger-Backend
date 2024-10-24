"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const configKeys_1 = __importDefault(require("./config/configKeys"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const managerRoute_1 = __importDefault(require("./routes/managerRoute"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const errorHandling_1 = __importDefault(require("./middlewares/errorHandling"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
mongoose_1.default
    .connect(configKeys_1.default.MONGO_DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));
const corsConfig = {
    origin: true,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.use("/", userRoute_1.default);
app.use("/manager", managerRoute_1.default);
app.use(errorHandling_1.default);
app.listen(configKeys_1.default.PORT, () => {
    console.log(`server running on http://localhost:${configKeys_1.default.PORT}`);
});
