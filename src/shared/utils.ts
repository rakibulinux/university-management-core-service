import { WeekDays } from '@prisma/client';

export type HasConflict = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
};

export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const hasConflict = (
  exsistingSlots: HasConflict[],
  newSlot: HasConflict
) => {
  for (const slot of exsistingSlots) {
    const exsistingStartTime = new Date(`2023-08-30T${slot.startTime}:00`);
    const exsistingEndTime = new Date(`2023-08-30T${slot.endTime}:00`);
    const newStartTime = new Date(`2023-08-30T${newSlot.startTime}:00`);
    const newEndTime = new Date(`2023-08-30T${newSlot.endTime}:00`);

    if (newStartTime < exsistingEndTime && newEndTime > exsistingStartTime) {
      return true;
    }
  }
  return false;
};
