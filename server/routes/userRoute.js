import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCoures} from '../controllers/userController.js';
const userRouter = express();

// get user
userRouter.get('/data', getUserData );

// get user enrolled courses
userRouter.get("/enrolled-courses", userEnrolledCoures);

//purchase course
userRouter.post('/purchase', purchaseCourse);

// get course progress
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.get("/get-course-progress", getUserCourseProgress);

userRouter.post("/add-rating", addUserRating);
export default userRouter