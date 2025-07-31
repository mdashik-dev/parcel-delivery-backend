import { Router } from "express"
import { checkAuth } from "../../middlewares/checkAuth"
import { ParcelControllers } from "./parcel.controller"
import { Role } from "../user/user.interface"
import { validateReceiverParcelOwnership, validateSenderParcelOwnership } from "./parcel.middleware"
import { validateRequest } from "../../middlewares/validateRequest"
import { createParcelZodSchema } from "./parcel.validation"

const router = Router()

/**
 * @swagger
 * /parcel/create-parcel:
 *   post:
 *     summary: Create a new parcel (Senders only)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *               - type
 *               - weight
 *               - deliveryAddress
 *               - currentStatus
 *             properties:
 *               senderId:
 *                 type: string
 *                 format: objectId
 *                 example: "6888d3eba84c3f8030faceaf"
 *               receiverId:
 *                 type: string
 *                 format: objectId
 *                 example: "6888d3d9a84c3f8030faceac"
 *               type:
 *                 type: string
 *                 example: "Test"
 *               weight:
 *                 type: number
 *                 example: 2.89
 *               deliveryAddress:
 *                 type: string
 *                 example: "123 Uposhohor, Rajshahi"
 *               currentStatus:
 *                 type: string
 *                 enum: [Requested, Approved, Dispatched, In Transit, Delivered, Canceled]
 *                 example: "Requested"
 *     responses:
 *       201:
 *         description: Parcel created successfully
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.post("/create-parcel", validateRequest(createParcelZodSchema), checkAuth(Role.SENDER), ParcelControllers.createParcel)

/**
 * @swagger
 * /parcel/all-parcels:
 *   get:
 *     summary: Get all parcels (Admin only)
 *     description: Retrieve a list of all parcels. Only accessible by admin users.
 *     tags:
 *       - Parcels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search keyword (e.g. trackingId)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role ( SENDER,RECIEVER,DELIVERY_MAN,ADMIN )
 *     responses:
 *       200:
 *         description: A list of parcels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Only accessible to admins
 */

router.get("/all-parcels", checkAuth(Role.ADMIN), ParcelControllers.getAllParcels)


/**
 * @swagger
 * /parcel/me:
 *   get:
 *     summary: Get all parcels created by the logged-in user (Sender or Receiver)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parcels created by the current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Parcels retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Parcel'
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       403:
 *         description: Forbidden (Only sender or receiver can access)
 */

router.get("/me", checkAuth(Role.SENDER, Role.RECEIVER), ParcelControllers.getMyParcels)

/**
 * @swagger
 * /parcel/{id}/status-log:
 *   get:
 *     summary: Get status logs for a specific parcel (Public)
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Parcel ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Status logs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StatusLog'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Not allowed)
 *       404:
 *         description: Parcel not found
 */

router.get("/:id/status-log", checkAuth(...Object.values(Role)), ParcelControllers.getIParcelStatusLogs)


/**
 * @swagger
 * /parcel/track/{trackingId}:
 *   get:
 *     summary: Track a parcel by its tracking ID (Public)
 *     tags: [Parcels]
 *     parameters:
 *       - name: trackingId
 *         in: path
 *         required: true
 *         description: Unique tracking ID of the parcel
 *         schema:
 *           type: string
 *           example: TRK12345678
 *     responses:
 *       200:
 *         description: Parcel details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Parcel fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Parcel'
 *       404:
 *         description: Parcel not found
 */

router.get("/track/:trackingId", ParcelControllers.trackParcel)

/**
 * @swagger
 * /parcel/cancel/{id}:
 *   patch:
 *     summary: Cancel a parcel by ID (Senders only)
 *     description: Allows a sender to cancel their own parcel
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the parcel to cancel
 *         schema:
 *           type: string
 *           example: 64a84382f9e7d3d3c9e7ad11
 *     responses:
 *       200:
 *         description: Parcel cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Parcel cancelled successfully
 *                 data:
 *                   $ref: '#/components/schemas/Parcel'
 *       400:
 *         description: Invalid request or already cancelled
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       403:
 *         description: Forbidden (not the owner or not a sender)
 *       404:
 *         description: Parcel not found
 */

router.patch("/cancel/:id", checkAuth(Role.SENDER), validateSenderParcelOwnership, ParcelControllers.cancelParcel)

/**
 * @swagger
 * /parcel/confirm/{id}:
 *   patch:
 *     summary: Confirm receipt of a parcel (Receivers only)
 *     description: Allows a receiver to confirm that a parcel has been successfully delivered.
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the parcel to confirm
 *         schema:
 *           type: string
 *           example: 64a84382f9e7d3d3c9e7ad11
 *     responses:
 *       200:
 *         description: Parcel confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Parcel delivery confirmed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Parcel'
 *       400:
 *         description: Invalid request or already confirmed
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (not the receiver of this parcel)
 *       404:
 *         description: Parcel not found
 */

router.patch("/confirm/:id", checkAuth(Role.RECEIVER), validateReceiverParcelOwnership, ParcelControllers.confirmParcel)

/**
 * @swagger
 * /parcel/update-status/{id}:
 *   patch:
 *     summary: Update the status of a parcel (Admin or Delivery)
 *     description: Allows admin or delivery man to update the current status of a parcel.
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Parcel ID to update
 *         schema:
 *           type: string
 *           example: 64a84382f9e7d3d3c9e7ad11
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED]
 *                 example: DELIVERED
 *               location:
 *                 type: string
 *                 example: Dhaka Hub
 *               note:
 *                 type: string
 *                 example: Package handed over at Dhaka hub.
 *     responses:
 *       200:
 *         description: Parcel status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Parcel status updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Parcel'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (not admin or delivery man)
 *       404:
 *         description: Parcel not found
 */

router.patch("/update-status/:id", checkAuth(Role.ADMIN, Role.DELIVERY_MAN), ParcelControllers.updateParcelStatus)

/**
 * @swagger
 * /parcel/delete/{id}:
 *   delete:
 *     summary: Delete a parcel (Admin only)
 *     description: Allows admin to delete a parcel from the system.
 *     tags: [Parcels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Parcel ID to delete
 *         schema:
 *           type: string
 *           example: 64a84382f9e7d3d3c9e7ad11
 *     responses:
 *       200:
 *         description: Parcel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Parcel deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Parcel not found
 */

router.delete("/delete/:id", checkAuth(Role.ADMIN), ParcelControllers.deleteParcel)

export const ParcelRoutes = router