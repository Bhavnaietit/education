import express from 'express'
import {updateRoleToEducator,addCourse,getEducatorCourses,educatorDashboardData,getEnrolledStudentsData } from '../controllers/educatorController.js'
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();
// add educator Role
educatorRouter.get("/update-role", updateRoleToEducator);

// add course
educatorRouter.post("/add-course", upload.single('image'), protectEducator, addCourse);

// // get all courses
educatorRouter.get("/courses", protectEducator, getEducatorCourses);

// // dashboad data
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);

// get enrolled students
educatorRouter.get(
	"/enrolled-students",
	protectEducator,
	getEnrolledStudentsData
);

export default educatorRouter;