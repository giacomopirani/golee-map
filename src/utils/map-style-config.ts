import { Theme } from "@/components/theme-provider";

type MapStyleConfig = {
  tileLayer: string;
  attribution: string;
  ext: string;
};

export const mapStyleConfig: { [theme in Theme]: MapStyleConfig } = {
  light: {
    tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "png",
  },
  dark: {
    tileLayer: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    ext: "png",
  },
};
