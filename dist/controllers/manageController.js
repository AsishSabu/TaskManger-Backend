"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskModel_1 = require("../models/taskModel");
const userModel_1 = __importDefault(require("../models/userModel"));
const httpTypes_1 = require("../types/httpTypes");
const customError_1 = __importDefault(require("../utils/customError"));
function getEmployees(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const managerId = req.params.id;
        try {
            const employees = yield userModel_1.default.find({
                manager: managerId,
                status: "approved",
            });
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Employees fetched successfully", employees });
        }
        catch (error) {
            next(new customError_1.default("Failed to fetch employees", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function getAllManagers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const managers = yield userModel_1.default.find({ role: "manager", isVerified: true });
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Managers fetched successfully", managers });
        }
        catch (error) {
            next(new customError_1.default("Failed to fetch managers", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function userEdit(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        const updates = req.body;
        try {
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, updates, {
                new: true,
            });
            if (!updatedUser) {
                throw new Error("error in updating single task");
            }
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Task updated successfully", data: updatedUser });
        }
        catch (error) {
            next(error);
        }
    });
}
function getAllRequests(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const managerId = req.params.id;
        try {
            const employees = yield userModel_1.default.find({ manager: managerId, status: "pending", isVerified: true });
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Employees Request fetched successfully", employees });
        }
        catch (error) {
            next(new customError_1.default("Failed to fetch Employees Request", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function getAllEmployees(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employees = yield userModel_1.default.find({ role: "employee" });
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Employees fetched successfully", employees });
        }
        catch (error) {
            next(new customError_1.default("Failed to fetch Employees", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function getAllTasks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const managerId = req.params.id;
        try {
            const tasks = yield taskModel_1.Task.find({ assignedBy: managerId });
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "All tasks fetched successfully", tasks });
        }
        catch (error) {
            next(new customError_1.default("Failed to fetch tasks", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function addTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const task = req.body;
        try {
            const newTask = new taskModel_1.Task({
                title: task.title,
                description: task.description,
                taskDate: task.taskDate,
                assignedTo: task.assignedTo,
                assignedBy: task.assignedBy,
                empName: task.empName
            });
            yield newTask.save();
            res
                .status(httpTypes_1.HttpStatus.CREATED)
                .json({ message: "Task created successfully", data: newTask });
        }
        catch (error) {
            next(new customError_1.default("Task creation failed", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function addTaskToAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const task = req.body;
        const employees = yield userModel_1.default.find({ manager: task.assignedBy });
        const newTasks = [];
        try {
            for (const each of employees) {
                const newTask = new taskModel_1.Task({
                    title: task.title,
                    description: task.description,
                    taskDate: task.taskDate,
                    assignedTo: each._id,
                    assignedBy: task.assignedBy,
                    empName: each.name
                });
                const saved = yield newTask.save();
                newTasks.push(saved);
            }
            res
                .status(httpTypes_1.HttpStatus.CREATED)
                .json({ message: "Tasks created successfully", data: newTasks });
        }
        catch (error) {
            next(new customError_1.default("Task creation for all employees failed", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function updateTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const taskId = req.params.id;
        const updates = req.body;
        try {
            const updatedTask = yield taskModel_1.Task.findByIdAndUpdate(taskId, updates, {
                new: true,
            });
            if (!updatedTask) {
                throw new Error("error in updating single task");
            }
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Task updated successfully", data: updatedTask });
        }
        catch (error) {
            next(new customError_1.default("Failed to update task", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function updateTasks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { updates, assignedBy, taskDate } = req.body;
        const tasks = yield taskModel_1.Task.find({ assignedBy, taskDate });
        // const newTasks: ITask[] = []
        // try {
        //   const updatePromises = updates.map(
        //     async (update: { id: string; changes: Partial<ITask> }) => {
        //       return Task.findByIdAndUpdate(update.id, update.changes, { new: true })
        //     }
        //   )
        //   const updatedTasks = await Promise.all(updatePromises)
        //   res.status(HttpStatus.OK).json({ message: "Tasks updated successfully" });
        // } catch (error) {
        //   console.error(error);
        //   next(new customError("Failed to update multiple tasks", HttpStatus.INTERNAL_SERVER_ERROR));
        // }
    });
}
function deleteTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const taskId = req.params.id;
        try {
            const deletedTask = yield taskModel_1.Task.findByIdAndDelete(taskId);
            if (!deletedTask) {
                throw new customError_1.default("Task not found", httpTypes_1.HttpStatus.NOT_FOUND);
            }
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Task deleted successfully", data: deletedTask });
        }
        catch (error) {
            next(new customError_1.default("Failed to delete task", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function deleteTasks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const taskIds = req.body.ids;
        try {
            const deletedTasks = yield taskModel_1.Task.deleteMany({ _id: { $in: taskIds } });
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Tasks deleted successfully", data: deletedTasks });
        }
        catch (error) {
            next(new customError_1.default("Failed to delete tasks", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
exports.default = {
    addTask,
    getEmployees,
    addTaskToAll,
    updateTask,
    updateTasks,
    deleteTask,
    deleteTasks,
    getAllTasks,
    getAllManagers,
    getAllEmployees,
    getAllRequests,
    userEdit
};
