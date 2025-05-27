const express = require("express");
const router = express.Router();
const BookingController=require("../controller/bookingController");


router.get('/getBookingById/:id', BookingController.GetBookingById);
router.get('/getAllBookings', BookingController.GetAllBookings);
router.get('/getBookingsByRequesterId/:requesterId', BookingController.GetBookingsByRequesterId);
router.get('/getBookingsByProviderId/:providerId', BookingController.GetBookingsByProviderId);
router.post('/createBooking', BookingController.CreateBooking);
router.put('/updateBooking/:id', BookingController.UpdateBooking);
router.delete('/deleteBooking/:id', BookingController.DeleteBooking);   
router.get('/getGetBookingsByResourceId/:resourceId', BookingController.GetBookingsByResourceId);
router.get('/GetBookingsBySkillId/:skillId', BookingController.GetBookingsBySkillId);
router.post('CreateBookingFromRequester', BookingController.CreateBookingFromRequester);