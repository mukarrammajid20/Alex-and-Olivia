type CoupleNames = {
  partner1: string;
  partner2: string;
};

export const getCoupleDisplayName = ({ partner1, partner2 }: CoupleNames): string =>
  `${partner1} & ${partner2}`;
