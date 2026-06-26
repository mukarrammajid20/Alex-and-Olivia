type CoupleNames = {
  partner1: string;
  partner2: string;
};

export const getCoupleInitials = ({ partner1, partner2 }: CoupleNames): string => {
  const first = partner1.trim().charAt(0).toUpperCase();
  const second = partner2.trim().charAt(0).toUpperCase();
  return `${first}&${second}`;
};
