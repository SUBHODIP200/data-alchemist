export type Rule =
  | { type: 'coRun'; tasks: string[] }
  | { type: 'slotRestriction'; group: string; minCommonSlots: number }
  | { type: 'loadLimit'; group: string; maxSlotsPerPhase: number }
  | { type: 'phaseWindow'; taskId: string; allowedPhases: number[] }
  | { type: 'patternMatch'; regex: string; template: string; params: string[] };
