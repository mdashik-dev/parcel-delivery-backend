import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

// ---------------------------------------------------------------------------------------------------------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: hashed_password
 *         role:
 *           type: string
 *           enum: [ADMIN, SENDER, RECEIVER, DELIVERYMAN]  # Adjust as per your Role enum
 *         address:
 *           type: string
 *           example: 123 Main St, Dhaka
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         isActive:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]  # Adjust as per your IsActive enum
 *         isVerified:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Parcel:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         trackingId:
 *           type: string
 *           example: TRK123456
 *         senderId:
 *           type: string
 *         receiverId:
 *           type: string
 *         assignedDeliveryManId:
 *           type: string
 *         type:
 *           type: string
 *           example: Document
 *         weight:
 *           type: number
 *           example: 2.5
 *         fee:
 *           type: number
 *           example: 150
 *         deliveryAddress:
 *           type: string
 *           example: House-12, Road-3, Mirpur, Dhaka
 *         deliveryDate:
 *           type: string
 *           format: date
 *         currentStatus:
 *           type: string
 *           enum: [REQUESTED, APPROVED, DISPATCHED, IN_TRANSIT, DELIVERED, CANCELED] # adjust as per IParcelStatus
 *         statusLogs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StatusLog'
 *         isCanceled:
 *           type: boolean
 *         isDelivered:
 *           type: boolean
 *         isBlocked:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     StatusLog:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [REQUESTED, APPROVED, DISPATCHED, IN_TRANSIT, DELIVERED, CANCELED]
 *         location:
 *           type: string
 *           example: Dhaka Hub
 *         note:
 *           type: string
 *           example: Reached sorting center
 *         timestamp:
 *           type: string
 *           format: date-time
 *         updatedBy:
 *           type: string
 *           description: User ID who updated the status
 */








// ---------------------------------------------------------------------------------------------------------------------------



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", AuthControllers.loginUser);
router.post("/logout", AuthControllers.logout)
export const AuthRoutes = router;
