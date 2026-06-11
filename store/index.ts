import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import assessmentReducer from "@/store/assessmentSlice";

/** v3 key drops cached form draft — only completed results are persisted */
const persistConfig = {
  key: "markapture-assessment-v3",
  storage,
  whitelist: ["savedResults", "viewingResultId"],
};

const persistedAssessmentReducer = persistReducer(
  persistConfig,
  assessmentReducer
);

export const store = configureStore({
  reducer: {
    assessment: persistedAssessmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
