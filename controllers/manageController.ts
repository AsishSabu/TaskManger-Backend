import { NextFunction, Request, Response } from "express"
import { Task } from "../models/taskModel"
import ITask from "../types/taskTypes"
import User from "../models/userModel"
import { HttpStatus } from "../types/httpTypes"
import customError from "../utils/customError"
import IUser from "../types/userTypes"

async function getEmployees(req: Request, res: Response, next: NextFunction) {
  const managerId = req.params.id
  try {
    const employees = await User.find({
      manager: managerId,
      status: "approved",
    })
    res
      .status(HttpStatus.OK)
      .json({ message: "Employees fetched successfully", employees })
  } catch (error) {
    next(
      new customError(
        "Failed to fetch employees",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    )
  }
}
async function getAllManagers(req: Request, res: Response, next: NextFunction) {
  try {
    const managers = await User.find({ role: "manager" })
    res
      .status(HttpStatus.OK)
      .json({ message: "Managers fetched successfully", managers })
  } catch (error) {
    next(
      new customError(
        "Failed to fetch managers",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    )
  }
}

async function userEdit(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.id
  const updates: Partial<IUser> = req.body
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    })
    if (!updatedUser) {
      throw new Error("error in updating single task")
    }
    res
      .status(HttpStatus.OK)
      .json({ message: "Task updated successfully", data: updatedUser })
  } catch (error) {
    next(error)
  }
}

async function getAllRequests(req: Request, res: Response, next: NextFunction) {
  const managerId = req.params.id
  try {
    const employees = await User.find({ manager: managerId, status: "pending",isVerified:true })
    res
      .status(HttpStatus.OK)
      .json({ message: "Employees Request fetched successfully", employees })
  } catch (error) {
    next(
      new customError(
        "Failed to fetch Employees Request",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    )
  }
}
async function getAllEmployees(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employees = await User.find({ role: "employee" })
    res
      .status(HttpStatus.OK)
      .json({ message: "Employees fetched successfully", employees })
  } catch (error) {
    next(
      new customError(
        "Failed to fetch Employees",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    )
  }
}

async function getAllTasks(req: Request, res: Response, next: NextFunction) {
  const managerId = req.params.id
  try {
    const tasks = await Task.find({ assignedBy: managerId })
    res
      .status(HttpStatus.OK)
      .json({ message: "All tasks fetched successfully", tasks })
  } catch (error) {
    next(
      new customError("Failed to fetch tasks", HttpStatus.INTERNAL_SERVER_ERROR)
    )
  }
}
async function addTask(req: Request, res: Response, next: NextFunction) {
  const task: ITask = req.body
  try {
    const newTask = new Task({
      title: task.title,
      description: task.description,
      taskDate: task.taskDate,
      assignedTo: task.assignedTo,
      assignedBy: task.assignedBy,
      empName:task.empName
    })
    await newTask.save()
    res
      .status(HttpStatus.CREATED)
      .json({ message: "Task created successfully", data: newTask })
  } catch (error) {
    next(
      new customError("Task creation failed", HttpStatus.INTERNAL_SERVER_ERROR)
    )
  }
}
async function addTaskToAll(req: Request, res: Response, next: NextFunction) {
  const task: ITask = req.body
  const employees = await User.find({ manager: task.assignedBy })
  const newTasks: ITask[] = []

  try {
    for (const each of employees) {
      const newTask = new Task({
        title: task.title,
        description: task.description,
        taskDate: task.taskDate,
        assignedTo: each._id,
        assignedBy: task.assignedBy,
        empName:each.name
      })
      const saved = await newTask.save()
      newTasks.push(saved)
    }

    res
      .status(HttpStatus.CREATED)
      .json({ message: "Tasks created successfully", data: newTasks })
  } catch (error) {
    next(
      new customError(
        "Task creation for all employees failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    )
  }
}

async function updateTask(req: Request, res: Response, next: NextFunction) {
  const taskId = req.params.id
  const updates: Partial<ITask> = req.body
  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
    })
    if (!updatedTask) {
      throw new Error("error in updating single task")
    }
    res
      .status(HttpStatus.OK)
      .json({ message: "Task updated successfully", data: updatedTask })
  } catch (error) {
    next(
      new customError("Failed to update task", HttpStatus.INTERNAL_SERVER_ERROR)
    )
  }
}

async function updateTasks(req: Request, res: Response, next: NextFunction) {
  const { updates, assignedBy, taskDate } = req.body
  const tasks = await Task.find({ assignedBy, taskDate })
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
}

async function deleteTask(req: Request, res: Response, next: NextFunction) {
  const taskId = req.params.id

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId)
    if (!deletedTask) {
      throw new customError("Task not found", HttpStatus.NOT_FOUND)
    }
    res
      .status(HttpStatus.OK)
      .json({ message: "Task deleted successfully", data: deletedTask })
  } catch (error) {
    next(
      new customError("Failed to delete task", HttpStatus.INTERNAL_SERVER_ERROR)
    )
  }
}

async function deleteTasks(req: Request, res: Response, next: NextFunction) {
  const taskIds = req.body.ids 

  try {
    const deletedTasks = await Task.deleteMany({ _id: { $in: taskIds } })
    res
      .status(HttpStatus.OK)
      .json({ message: "Tasks deleted successfully", data: deletedTasks })
  } catch (error) {
    next(
      new customError(
        "Failed to delete tasks",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    )
  }
}

export default {
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
}
