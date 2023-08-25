import { z } from 'zod';

const createRoomZodSchema = z.object({
  body: z.object({
    roomNumber: z.string({
      required_error: 'Room Number is required',
    }),
    floor: z.string({
      required_error: 'Floor Number is required',
    }),
    buildingId: z.string({
      required_error: 'Bbuilding Id is required',
    }),
  }),
});
const updateRoomZodSchema = z.object({
  body: z.object({
    roomNumber: z.string().optional(),
    floor: z.string().optional(),
    buildingId: z.string().optional(),
  }),
});

export const RoomValidation = {
  createRoomZodSchema,
  updateRoomZodSchema,
};
