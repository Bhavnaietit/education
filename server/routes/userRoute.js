import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCoures, verifyStripe } from '../controllers/userController.js';

const userRouter = express();

// get user
userRouter.get('/data', getUserData );

// get user enrolled courses
userRouter.post("/enrolled-courses", userEnrolledCoures);

//purchase course
userRouter.post('/purchase',purchaseCourse);

// get course progress
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);

userRouter.post("/add-rating", addUserRating);
userRouter.post("/verifyStripe", verifyStripe);

export default userRouter