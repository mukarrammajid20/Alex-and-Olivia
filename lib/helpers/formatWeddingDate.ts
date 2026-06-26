export const formatWeddingDate = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatEventDateTime = (date: string, time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const eventDate = new Date(`${date}T00:00:00`);
  eventDate.setHours(hours, minutes, 0, 0);

  return eventDate.toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
