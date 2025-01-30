export const translateCountryAbbreviation = (abbreviation: string): string => {
  const countryAbbreviations: Record<string, string> = {
    ITA: "Italia",
    FRA: "Francia",
    DEU: "Germania",
  };
  return countryAbbreviations[abbreviation.toUpperCase()] || abbreviation;
};
