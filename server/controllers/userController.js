import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import CourseProgress from "../models/CourseProgress.js";
import { stripeWebhooks } from "./webhooks.js";
//  get user
export const getUserData = async (req, res) => {
	try {
		const userId = req.auth().userId;
		const user = await User.findById(userId);
		if (!user) {
			return res.json({ success: false, message: "User Not Found" });
		}
		res.json({ success: true, user });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// get user enrolled course with lect links
export const userEnrolledCoures = async (req, res) => {
	try {
		const userId = req.auth().userId;
		const userData = await User.findById(userId).populate("enrolledCourses");

		if (!userData) {
			res.json({ success: false, message: "User Not Enrolled" });
		}
		res.json({ success: true, enrolledCourses: userData.enrolledCourses });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// PUCHASE COURES
export const purchaseCourse = async (req, res) => {
	try {
		const { origin } = req.headers;

		const userId = req.auth().userId;

		const courseId = req.body.courseId;

		const userData = await User.findById(userId);
		const courseData = await Course.findById(courseId);

		if (!userData || !courseData) {
			return res.json({ success: false, message: "Data Not Found" });
		}
		const purchaseData = {
			courseId: courseData._id,
			userId,
			amount: (
				courseData.coursePrice -
				(courseData.discount * courseData.coursePrice) / 100
			).toFixed(2),
		};

		const newPurchase = await Purchase.create(purchaseData);
		// stripe getway
		const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
		const currency = process.env.CURRENCY.toLowerCase();

		// line items
		const line_items = [
			{
				price_data: {
					currency: currency,
					product_data: {
						name: courseData.courseTitle,
					},
					unit_amount: Math.floor(newPurchase.amount) * 100,
				},
				quantity: 1,
			},
		];

		const session = await stripeInstance.checkout.sessions.create({
			success_url: `${origin}/verify?success=true&purchaseId=${newPurchase._id}`,
			cancel_url: `${origin}/verify?success=false&puchaseId=${newPurchase._id}`,
			line_items,
			mode: "payment",
		});
	
		return res.json({ success: true, session_url: session.url });
	} catch (error) {
		console.log(error);
		return res.json({ success: false, message: error.message });
	}
};
//  verify stripe
 export const verifyStripe = async (req, res) => {
	const {  success, purchaseId } = req.body;
	try {
		if (success == "true") {
			const purchaseData= await Purchase.findById(purchaseId);
			const userData = await User.findById(purchaseData.userId);
			const courseData = await Course.findById(
				purchaseData.courseId.toString()
			);
			courseData.enrolledStudents.push(userData);
			await courseData.save();

			userData.enrolledCourses.push(courseData._id);
			await userData.save();
			await Purchase.findByIdAndUpdate(purchaseId, { status: "completed" });
		
			res.json({ success: true });
		} else {
			const purchaseData = await Purchase.findByIdAndUpdate(purchaseId, {
				status: "failed",
			});
			res.json({ success: false });
		}
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// UPDATE USER COURSE PROGRESS
export const updateUserCourseProgress = async (req, res) => {
	try {
		
		const userId = req.auth().userId;

		const { courseId, lectureId } = req.body;
		const progressData = await CourseProgress.findOne({ userId, courseId });

		if (progressData) {
			
			if (progressData.lectureCompleted.includes(lectureId)) {
				return res.json({
					success: true,
					message: "Lecture Already comlpleted",
				});
			}
			progressData.lectureCompleted.push(lectureId);
			await progressData.save();
		} else {
			await CourseProgress.create({
				userId,
				courseId,
				lectureCompleted: [lectureId],
			});
			res.json({ success: true, meassage: "Progress Updated" });
		}
	} catch (error) {
		return res.json({ success: false, meassage: error.message });
	}
};

// get user course progress
export const getUserCourseProgress = async (req, res) => {
	try {
		const userId = req.auth().userId;
		const { courseId } = req.body;
		const progressData = await CourseProgress.findOne({ userId, courseId });
		res.json({ success: true, progressData });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};
// update rating
export const addUserRating = async (req, res) => {
	const userId = req.auth().userId;
	const { courseId, rating } = req.body;

	if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
		res.json({ success: false, message: "InValid Details" });
	}

	try {
		const course = await Course.findById(courseId);
		if (!course) {
			return res.json({ success: false, message: "Course Not Found." });
		}
		const user = await User.findById(userId);
		if (!user || !user.enrolledCourses.includes(courseId)) {
			return res.json({
				success: false,
				message: "User has not purchased this course.",
			});
		}
		const existingRatingIndex = course.courseRatings.findIndex(
			(r) => r.userId === userId
		);

		if (existingRatingIndex > -1) {
			course.courseRatings[existingRatingIndex].rating = rating;
		} else {
			course.courseRatings.push({ userId, rating });
		}
		await course.save();
		return res.json({ success: true, message: "Rating Added" });
	} catch (error) {
		return res.json({
			success: false,
			message: error.message,
		});
	}
};
