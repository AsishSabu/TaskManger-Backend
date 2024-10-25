import express from "express"
import manageController from "../controllers/manageController"
import authenticateUser from "./../middlewares/authMiddleware"
const managerRoute = express.Router()

managerRoute.post("/addTask", authenticateUser, manageController.addTask)
managerRoute.post(
  "/addTaskToAll",
  authenticateUser,
  manageController.addTaskToAll
)
managerRoute.post(
  "/editTask/:id",
  authenticateUser,
  manageController.updateTask
)
managerRoute.post(
  "/editTaskToAll",
  authenticateUser,
  manageController.updateTasks
)
managerRoute.delete(
  "/deleteTask/:id",
  authenticateUser,
  manageController.deleteTask
)
managerRoute.delete(
  "/deleteTaskToAll",
  authenticateUser,
  manageController.deleteTasks
)
managerRoute.get(
  "/employees/:id",
  authenticateUser,
  manageController.getEmployees
)
managerRoute.patch("/employee/:id", authenticateUser, manageController.userEdit)
managerRoute.get(
  "/getAllTasks/:id",
  authenticateUser,
  manageController.getAllTasks
)
managerRoute.get(
  "/getAllManagers",
  manageController.getAllManagers
)
managerRoute.get(
  "/getAllEmployees",
  authenticateUser,
  manageController.getAllEmployees
)
managerRoute.get(
  "/getAllRequests/:id",
  authenticateUser,
  manageController.getAllRequests
)
export default managerRoute
