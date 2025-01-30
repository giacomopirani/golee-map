export const translateRegionAbbreviation = (abbreviation: string): string => {
  const regionAbbreviations: Record<string, string> = {
    ABR: "Abruzzo",
    BAS: "Basilicata",
    CAL: "Calabria",
    CAM: "Campania",
    EMR: "Emilia-Romagna",
    FVG: "Friuli Venezia Giulia",
    LAZ: "Lazio",
    LIG: "Liguria",
    LOM: "Lombardia",
    MAR: "Marche",
    MOL: "Molise",
    PAA: "Piemonte",
    PUG: "Puglia",
    SAR: "Sardegna",
    SIC: "Sicilia",
    TAA: "Trentino-Alto Adige/Südtirol",
    TOS: "Toscana",
    UM: "Umbria",
    VDA: "Valle d'Aosta",
    VEN: "Veneto",
  };
  return regionAbbreviations[abbreviation.toUpperCase()] || abbreviation;
};
