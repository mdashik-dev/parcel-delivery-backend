import { Router } from "express"
import { checkAuth } from "../../middlewares/checkAuth"
import { ParcelControllers } from "./parcel.controller"
import { Role } from "../user/user.interface"
import { validateReceiverParcelOwnership, validateSenderParcelOwnership } from "./parcel.middleware"

const router = Router()


router.get("/all-parcels", checkAuth(Role.ADMIN), ParcelControllers.getAllParcels)
router.get("/me", checkAuth(Role.SENDER, Role.RECEIVER), ParcelControllers.getMyParcels)
router.get("/:id/status-log", checkAuth(...Object.values(Role)), ParcelControllers.getIParcelStatusLogs)
router.get("/track/:trackingId", ParcelControllers.trackParcel)

router.post("/create-parcel", checkAuth(Role.SENDER), ParcelControllers.createParcel)

router.patch("/cancel/:id", checkAuth(Role.SENDER), validateSenderParcelOwnership, ParcelControllers.cancelParcel)
router.patch("/confirm/:id", checkAuth(Role.RECEIVER), validateReceiverParcelOwnership, ParcelControllers.confirmParcel)
router.patch("/update-status/:id", checkAuth(Role.ADMIN, Role.DELIVERY_MAN), ParcelControllers.updateParcelStatus)

router.delete("/delete/:id", checkAuth(Role.ADMIN), ParcelControllers.deleteParcel)

export const ParcelRoutes = router