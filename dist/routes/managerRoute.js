"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manageController_1 = __importDefault(require("../controllers/manageController"));
const managerRoute = express_1.default.Router();
managerRoute.post("/addTask", manageController_1.default.addTask);
managerRoute.post("/addTaskToAll", manageController_1.default.addTaskToAll);
managerRoute.post("/editTask/:id", manageController_1.default.updateTask);
managerRoute.post("/editTaskToAll", manageController_1.default.updateTasks);
managerRoute.delete("/deleteTask/:id", manageController_1.default.deleteTask);
managerRoute.delete("/deleteTaskToAll", manageController_1.default.deleteTasks);
managerRoute.get("/employees/:id", manageController_1.default.getEmployees);
managerRoute.get("/getAllTasks/:id", manageController_1.default.getAllTasks);
managerRoute.get("/getAllManagers", manageController_1.default.getAllManagers);
exports.default = managerRoute;
