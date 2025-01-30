export const translateCompetitionLevel = (level: string): string => {
  switch (level.toUpperCase()) {
    case "AMATEUR":
      return "Amatoriale";
    case "PROFESSIONAL":
      return "Professionale";
    case "SEMI-PROFESSIONAL":
      return "Semi-professionale";
    default:
      return level;
  }
};
