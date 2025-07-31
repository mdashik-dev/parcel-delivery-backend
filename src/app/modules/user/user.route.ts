import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { blockUserZodSchema, createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$"
 *                 example: StrongP@ssw0rd
 *               role:
 *                 type: string
 *                 enum: [ADMIN, SENDER, RECIEVER,DELEVERY_MAN] 
 *                 example: SENDER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

router.post(
    "/register",
    validateRequest(createUserZodSchema),
    UserControllers.createUser
);

/**
 * @swagger
 * /user/all-users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of all registered users (Admin only).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User ID
 *                   name:
 *                     type: string
 *                     description: Full name of the user
 *                   email:
 *                     type: string
 *                     format: email
 *                   role:
 *                     type: string
 *                     enum: [ADMIN, SENDER, RECEIVER, DELIVERY_MAN]
 *                   address:
 *                     type: string
 *                     nullable: true
 *                   isDeleted:
 *                     type: string
 *                     nullable: true
 *                   isActive:
 *                     type: string
 *                     enum: [ACTIVE, INACTIVE, BLOCKED]
 *                     nullable: true
 *                   isVerified:
 *                     type: boolean
 *                     description: Whether the user is verified
 *       401:
 *         description: Unauthorized – Missing or invalid token
 *       403:
 *         description: Forbidden – Requires ADMIN role
 */

router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

/**
 * @swagger
 * /user/block/{id}:
 *   patch:
 *     summary: Block a user by ID (Admin only).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to block (MongoDB ObjectId)
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: User successfully blocked
 *         
 *       400:
 *         description: Invalid ID format or bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only admin can perform this)
 *       404:
 *         description: User not found
 */


router.patch("/block/:id", validateRequest(blockUserZodSchema), checkAuth(Role.ADMIN), UserControllers.blockUser);

/**
 * @swagger
 * /user/unblock/{id}:
 *   patch:
 *     summary: Unblock a user by ID (Admin only).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to block (MongoDB ObjectId)
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: User successfully unblocked
 *         
 *       400:
 *         description: Invalid ID format or bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only admin can perform this)
 *       404:
 *         description: User not found
 */
router.patch("/unblock/:id", validateRequest(blockUserZodSchema), checkAuth(Role.ADMIN), UserControllers.unblockUser);

export const UserRoutes = router;
