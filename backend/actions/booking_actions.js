const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { z } = require('zod');

class BookingService {
  constructor() {
    this.BookingInputSchema = z.object({
      startDate: z.date(),
      endDate: z.date().refine((date, ctx) => date > ctx.parent.startDate, {
        message: "endDate must be after startDate",
      }),
      resourceId: z.string(),
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED']).default('PENDING'),
      requesterNote: z.string().nullable(),
      providerNote: z.string().nullable(),
      requesterId: z.string(),
      providerId: z.string(),
      skillId: z.string(),
    });

    this.BookingUpdateInputSchema = z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      resourceId: z.string().optional(),
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED']).optional(),
      requesterNote: z.string().nullable().optional(),
      providerNote: z.string().nullable().optional(),
      requesterId: z.string().optional(),
      providerId: z.string().optional(),
      skillId: z.string().optional(),
    });
  }

  async checkForConflicts(resourceId, startDate, endDate, excludeBookingId = null) {
    const conflicts = await prisma.booking.findMany({
      where: {
        resourceId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
        ...(excludeBookingId && { NOT: { id: excludeBookingId } }),
      },
    });
    if (conflicts.length > 0) {
      throw new Error(`Booking conflict detected for resource ${resourceId}`);
    }
  }

  async cancelBooking(id) {
    try {
      const booking = await prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
      return booking;
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async rejectBooking(id, providerNote) {
    try {
      const booking = await prisma.booking.update({
        where: { id },
        data: { 
          status: 'REJECTED',
          providerNote: providerNote || 'Request rejected by provider' 
        },
      });
      return booking;
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async searchBookings({ startDate, endDate, status, resourceId }) {
    const bookings = await prisma.booking.findMany({
      where: {
        ...(startDate && { startDate: { gte: new Date(startDate) } }),
        ...(endDate && { endDate: { lte: new Date(endDate) } }),
        ...(status && { status }),
        ...(resourceId && { resourceId }),
      },
    });
    return bookings;
  }

  async getBookingHistory(userId) {
    const bookings = await prisma.booking.findMany({
      where: { OR: [{ requesterId: userId }, { providerId: userId }] },
      orderBy: { startDate: 'desc' },
    });
    return bookings;
  }

  async updateBookingStatus(id, status, providerNote) {
    if (!['CONFIRMED', 'CANCELLED', 'REJECTED'].includes(status)) {
      throw new Error('Invalid status update');
    }
    const booking = await prisma.booking.update({
      where: { id },
      data: { status, providerNote },
    });
    return booking;
  }

  async createBookingFromRequester(input) {
    const validationResult = this.BookingInputSchema.safeParse(input);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues
        .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
        .join('; ');
      throw new Error(`Validation error: ${errorDetails}`);
    }
    const res = validationResult.data;
    try {
      const booking = await prisma.booking.create({
        data: {
          startDate: res.startDate,
          endDate: res.endDate,
          resourceId: res.resourceId,
          status: 'PENDING', // Always start as PENDING when created by requester
          requesterNote: res.requesterNote,
          requesterId: res.requesterId,
          providerId: res.providerId,
          skillId: res.skillId,
        },
      });
      return booking;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error(`A booking with similar attributes already exists (Constraint: ${error.meta.target.join(', ')}).`);
      } else {
        throw new Error(`Error creating booking: ${error.message}`);
      }
    }
  }

  async checkForProviderAvailability(providerId, startDate, endDate, excludeBookingId = null) {
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          providerId: providerId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          OR: [
            { startDate: { lte: endDate }, endDate: { gte: startDate } },
          ],
          ...(excludeBookingId && { NOT: { id: excludeBookingId } }),
        },
      });
      return bookings.length === 0; // Returns true if provider is available
    } catch (error) {
      throw new Error(`Error checking for provider availability: ${error.message}`);
    }
  }

  async acceptBookingRequest(id, providerNote) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
      });
      
      if (!booking) {
        throw new Error(`Booking with ID ${id} not found`);
      }
      
      if (booking.status !== 'PENDING') {
        throw new Error(`Cannot accept a booking that is not in PENDING status. Current status: ${booking.status}`);
      }
      
      await this.checkForConflicts(
        booking.resourceId,
        booking.startDate,
        booking.endDate,
        id 
      );
      
      const isProviderAvailable = await this.checkForProviderAvailability(
        booking.providerId,
        booking.startDate,
        booking.endDate,
        id 
      );
      
      if (!isProviderAvailable) {
        throw new Error(`Provider is not available during the requested time period`);
      }
      
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
          providerNote: providerNote || 'Booking confirmed by provider',
        },
      });
      
      return updatedBooking;
    } catch (error) {
      throw new Error(`Error accepting booking request: ${error.message}`);
    }
  }

  async updateBooking(id, input) {
    const validationResult = this.BookingUpdateInputSchema.safeParse(input);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues
        .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
        .join('; ');
      throw new Error(`Validation error: ${errorDetails}`);
    }
    const res = validationResult.data;
    try {
      const booking = await prisma.booking.update({
        where: { id },
        data: {
          startDate: res.startDate,
          endDate: res.endDate,
          resourceId: res.resourceId,
          status: res.status,
          requesterNote: res.requesterNote,
          providerNote: res.providerNote,
          requesterId: res.requesterId,
          providerId: res.providerId,
          skillId: res.skillId,
        },
      });
      return booking;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error(`A booking with similar attributes already exists (Constraint: ${error.meta.target.join(', ')}).`);
      } else if (error.code === 'P2025') {
        throw new Error(`Booking with ID ${id} not found.`);
      } else {
        throw new Error(`Error updating booking: ${error.message}`);
      }
    }
  }

  async getBookingById(id) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
      });
      if (!booking) {
        throw new Error(`Booking with ID ${id} not found`);
      }
      return booking;
    } catch (error) {
      throw new Error(`Error retrieving booking: ${error.message}`);
    }
  }

  async getAllBookings() {
    try {
      const bookings = await prisma.booking.findMany();
      if (bookings.length === 0) {
        throw new Error(`No bookings found`);
      }
      return bookings;
    } catch (error) {
      throw new Error(`Error retrieving bookings: ${error.message}`);
    }
  }

  async getBookingsByRequesterId(requesterId) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { requesterId },
      });
      if (bookings.length === 0) {
        throw new Error(`No bookings found for requester with ID ${requesterId}`);
      }
      return bookings;
    } catch (error) {
      throw new Error(`Error retrieving bookings: ${error.message}`);
    }
  }

  async getBookingsByProviderId(providerId) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { providerId },
      });
      if (bookings.length === 0) {
        throw new Error(`No bookings found for provider with ID ${providerId}`);
      }
      return bookings;
    } catch (error) {
      throw new Error(`Error retrieving bookings: ${error.message}`);
    }
  }

  async getBookingsByResourceId(resourceId) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { resourceId },
      });
      if (bookings.length === 0) {
        throw new Error(`No bookings found for resource with ID ${resourceId}`);
      }
      return bookings;
    } catch (error)      {
      throw new Error(`Error retrieving bookings: ${error.message}`);
    }
  }

  async getBookingsBySkillId(skillId) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { skillId },
      });
      if (bookings.length === 0) {
        throw new Error(`No bookings found for skill with ID ${skillId}`);
      }
      return bookings;
    } catch (error) {
      throw new Error(`Error retrieving bookings: ${error.message}`);
    }
  }

  async deleteBooking(id) {
    try {
      const existing = await prisma.booking.findUnique({ where: { id } });
      if (!existing) {
        throw new Error(`Booking with ID ${id} not found for deletion.`);
      }
      const booking = await prisma.booking.delete({
        where: { id: id }
      });
      return booking;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(`Booking with ID ${id} not found.`);
      }
      throw new Error(`Error deleting booking: ${error.message}`);
    }
  }

  handlePrismaError(error, id) {
    if (error.code === 'P2025') {
      throw new Error(`Booking with ID ${id} not found.`);
    } else if (error.code === 'P2002') {
      throw new Error(`A booking with similar attributes already exists.`);
    } else {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = new BookingService();