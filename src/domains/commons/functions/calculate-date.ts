export function calculateDueDate(startDate: Date, daysToAdd: number): Date {
  const dueDate = new Date(startDate);
  dueDate.setDate(dueDate.getDate() + daysToAdd);
  return dueDate;
}
