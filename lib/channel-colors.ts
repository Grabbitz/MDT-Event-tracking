export const channelColors: Record<string, string> = {
  B2S: "#2f6db2",
  Betrend: "#d95a1f",
  CDS: "#a53f2b",
  OFM: "#6f5cc2",
  PWB: "#1d8f74",
  SB: "#b2822b",
  TWD: "#5f7f36",
  Sample: "#9a8f84",
};

export function getChannelColor(channel: string) {
  return channelColors[channel] ?? "#d95a1f";
}
