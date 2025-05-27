const bookingService = require('./bookingService'); 

class BookingController {
  /**
   * @param {Object} req 
   * @param {Object} res 
   */
  async GetAllBookings(req, res) {
    try {
      const bookings = await bookingService.getAllBookings();
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error getting all bookings: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve bookings'
      });
    }
  }

  /**
   * Get booking by ID
   * @param {Object} req 
   * @param {Object} res 
   */
  async GetBookingById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }

      const booking = await bookingService.getBookingById(id);
      return res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error(`Error getting booking by ID: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve booking'
      });
    }
  }

  /**
   * @param {Object} req 
   * @param {Object} res 
   */
  async GetBookingsByRequesterId(req, res) {
    try {
      const { requesterId } = req.params;
      
      if (!requesterId) {
        return res.status(400).json({
          success: false,
          message: 'Requester ID is required'
        });
      }

      const bookings = await bookingService.getBookingsByRequesterId(requesterId);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error getting bookings by requester ID: ${error.message}`);
      
      if (error.message.includes('No bookings found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve bookings'
      });
    }
  }

  /**
   * Get bookings by provider ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async GetBookingsByProviderId(req, res) {
    try {
      const { providerId } = req.params;
      
      if (!providerId) {
        return res.status(400).json({
          success: false,
          message: 'Provider ID is required'
        });
      }

      const bookings = await bookingService.getBookingsByProviderId(providerId);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error getting bookings by provider ID: ${error.message}`);
      
      if (error.message.includes('No bookings found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve bookings'
      });
    }
  }

  /**
   * Get bookings by resource ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async GetBookingsByResourceId(req, res) {
    try {
      const { resourceId } = req.params;
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required'
        });
      }

      const bookings = await bookingService.getBookingsByResourceId(resourceId);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error getting bookings by resource ID: ${error.message}`);
      
      if (error.message.includes('No bookings found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve bookings'
      });
    }
  }

  /**
   * Get bookings by skill ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async GetBookingsBySkillId(req, res) {
    try {
      const { skillId } = req.params;
      
      if (!skillId) {
        return res.status(400).json({
          success: false,
          message: 'Skill ID is required'
        });
      }

      const bookings = await bookingService.getBookingsBySkillId(skillId);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error getting bookings by skill ID: ${error.message}`);
      
      if (error.message.includes('No bookings found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve bookings'
      });
    }
  }

  /**
   * @param {Object} req 
   * @param {Object} res 
   */
  async CreateBookingFromRequester(req, res) {
    try {
      const bookingData = req.body;
      
      if (typeof bookingData.startDate === 'string') {
        bookingData.startDate = new Date(bookingData.startDate);
      }
      
      if (typeof bookingData.endDate === 'string') {
        bookingData.endDate = new Date(bookingData.endDate);
      }
      
      await bookingService.checkForConflicts(
        bookingData.resourceId,
        bookingData.startDate,
        bookingData.endDate
      );
      
      const booking = await bookingService.createBookingfromRequester(bookingData);
      return res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error(`Error creating booking from requester: ${error.message}`);
      
      if (error.message.includes('Validation error')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('Booking conflict')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create booking'
      });
    }
  }

  /**
   * @param {Object} req 
   * @param {Object} res 
   */
  async AcceptBookingFromProvider(req, res) {
    try {
      const bookingData = req.body;
      
      if (typeof bookingData.startDate === 'string') {
        bookingData.startDate = new Date(bookingData.startDate);
      }
      
      if (typeof bookingData.endDate === 'string') {
        bookingData.endDate = new Date(bookingData.endDate);
      }
      
      await bookingService.checkForConflicts(
        bookingData.resourceId,
        bookingData.startDate,
        bookingData.endDate
      );
      
      const booking = await bookingService.createBookingfromRequester(bookingData);
      return res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error(`Error accepting booking from provider: ${error.message}`);
      
      if (error.message.includes('Validation error')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('Booking conflict')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to accept booking'
      });
    }
  }

  /**
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async UpdateBooking(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }
      
      if (updateData.startDate && typeof updateData.startDate === 'string') {
        updateData.startDate = new Date(updateData.startDate);
      }
      
      if (updateData.endDate && typeof updateData.endDate === 'string') {
        updateData.endDate = new Date(updateData.endDate);
      }
      
      if ((updateData.startDate || updateData.endDate || updateData.resourceId) && 
          updateData.status !== 'CANCELLED') {
        
        const currentBooking = await bookingService.getBookingById(id);
        
        await bookingService.checkForConflicts(
          updateData.resourceId || currentBooking.resourceId,
          updateData.startDate || currentBooking.startDate,
          updateData.endDate || currentBooking.endDate
        );
      }
      
      const booking = await bookingService.updateBooking(id, updateData);
      return res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error(`Error updating booking: ${error.message}`);
      
      if (error.message.includes('Validation error')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('Booking conflict')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update booking'
      });
    }
  }

  /**
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async UpdateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, providerNote } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }
      
      if (!status || !['CONFIRMED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status (CONFIRMED or CANCELLED) is required'
        });
      }
      
      const booking = await bookingService.updateBookingStatus(id, status, providerNote);
      return res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error(`Error updating booking status: ${error.message}`);
      
      if (error.message.includes('Invalid status')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update booking status'
      });
    }
  }

  /**
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async CancelBooking(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }
      
      const booking = await bookingService.cancelBooking(id);
      return res.status(200).json({
        success: true,
        data: booking,
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      console.error(`Error cancelling booking: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to cancel booking'
      });
    }
  }

  /**
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async DeleteBooking(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required'
        });
      }
      
      await bookingService.deleteBooking(id);
      return res.status(200).json({
        success: true,
        message: `Booking with ID ${id} deleted successfully`
      });
    } catch (error) {
      console.error(`Error deleting booking: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete booking'
      });
    }
  }

  /**
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async SearchBookings(req, res) {
    try {
      const { startDate, endDate, status, resourceId } = req.query;
      
      const searchParams = {
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
        ...(resourceId && { resourceId })
      };
      
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
      
      if (status && !['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be one of: PENDING, CONFIRMED, CANCELLED'
        });
      }
      
      const bookings = await bookingService.searchBookings(searchParams);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error searching bookings: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to search bookings'
      });
    }
  }

  /**
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async GetBookingHistory(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const bookings = await bookingService.getBookingHistory(userId);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error(`Error getting booking history: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve booking history'
      });
    }
  }
}

module.exports = new BookingController();