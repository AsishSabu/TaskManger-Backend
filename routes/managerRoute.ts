import express from "express"
import manageController from "../controllers/manageController";
const managerRoute = express.Router();

managerRoute.post("/addTask",manageController.addTask)
managerRoute.post("/addTaskToAll",manageController.addTaskToAll)
managerRoute.post("/editTask/:id", manageController.updateTask);
managerRoute.post("/editTaskToAll", manageController.updateTasks);
managerRoute.delete("/deleteTask/:id",manageController.deleteTask)
managerRoute.delete("/deleteTaskToAll",manageController.deleteTasks)
managerRoute.get("/employees/:id",manageController.getEmployees)
managerRoute.patch("/employee/:id",manageController.userEdit)
managerRoute.get("/getAllTasks/:id",manageController.getAllTasks)
managerRoute.get("/getAllManagers",manageController.getAllManagers)
managerRoute.get("/getAllEmployees",manageController.getAllEmployees)
managerRoute.get("/getAllRequests/:id",manageController.getAllRequests)
export default managerRoute