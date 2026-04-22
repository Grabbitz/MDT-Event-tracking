export type ParticipationStatus = "joining" | "not_joining" | "pending";

export type EventRecord = {
  id: string;
  year: number;
  name: string;
  channel: string;
  channelColor: string;
  location: string;
  startDate: string;
  endDate: string;
  setupDateTime?: string;
  teardownDateTime?: string;
  boothSize?: string;
  boothZone?: string;
  details?: string;
  contactName?: string;
  contactPhone?: string;
  conditions?: string;
  participationStatus: ParticipationStatus;
  salesStaffRequired: boolean;
  salesTarget?: number;
  actualSales?: number;
  fileName?: string;
  notes?: string;
};

export type ChannelSummary = {
  name: string;
  color: string;
  eventCount: number;
  joiningCount: number;
  nextEvent?: EventRecord;
};
