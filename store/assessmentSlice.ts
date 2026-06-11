import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AssessmentResult, GtRouteId } from "@/lib/assessment";

export type SavedAssessment = {
  id: string;
  savedAt: string;
  routeId: GtRouteId;
  applicantName: string;
  result: AssessmentResult;
};

export type AssessmentState = {
  savedResults: SavedAssessment[];
  viewingResultId: string | null;
};

const initialState: AssessmentState = {
  savedResults: [],
  viewingResultId: null,
};

export const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    saveAssessmentResult(
      state,
      action: PayloadAction<{
        routeId: GtRouteId;
        result: AssessmentResult;
        applicantName?: string;
      }>
    ) {
      const { routeId, result, applicantName } = action.payload;
      const entry: SavedAssessment = {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        routeId,
        applicantName: applicantName ?? result.route,
        result,
      };
      state.savedResults.unshift(entry);
      if (state.savedResults.length > 10) {
        state.savedResults = state.savedResults.slice(0, 10);
      }
      state.viewingResultId = entry.id;
    },
    setViewingResult(state, action: PayloadAction<string | null>) {
      state.viewingResultId = action.payload;
    },
    clearViewingResult(state) {
      state.viewingResultId = null;
    },
  },
});

export const {
  saveAssessmentResult,
  setViewingResult,
  clearViewingResult,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
