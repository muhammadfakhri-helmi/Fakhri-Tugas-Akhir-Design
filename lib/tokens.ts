// Mirror of the colour tokens in app/globals.css, for the 3D scene and SVG.
export const color = {
  bg: "#0a1322",
  line: "#22334e",
  lineStrong: "#3a5074",
  ink: "#e8edf4",
  muted: "#9aa9be",
  paper: "#ece7da",
  flow: "#4fcbdd",
  pass: "#5ecb8f",
  review: "#f0b24a",
  exceed: "#e8695e",
  unknown: "#7a8699",
  force: "#f4efe2",
  dp: "#aebdd2",
  hwdp: "#7f96ba",
  dc: "#52698c",
  bit: "#e9e3d3",
  strata: ["#1b2d49", "#243a5d", "#1d3150", "#2b4468", "#203757", "#304b72"],
} as const;

export const statusColor = {
  pass: color.pass,
  review: color.review,
  exceed: color.exceed,
  unknown: color.unknown,
} as const;
