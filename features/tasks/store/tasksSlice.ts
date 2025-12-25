import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilters, TasksState, ViewMode } from "../types";

const initialState: TasksState = {
  selectedTask: null,
  viewMode: "kanban",
  filters: {},
  isCreatingTask: false,
  isEditingTask: false,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },

    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },

    setFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = action.payload;
    },

    updateFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {};
    },

    setIsCreatingTask: (state, action: PayloadAction<boolean>) => {
      state.isCreatingTask = action.payload;
    },

    setIsEditingTask: (state, action: PayloadAction<boolean>) => {
      state.isEditingTask = action.payload;
    },

    openTaskForm: (state, action: PayloadAction<Task | null>) => {
      if (action.payload) {
        state.selectedTask = action.payload;
        state.isEditingTask = true;
      } else {
        state.selectedTask = null;
        state.isCreatingTask = true;
      }
    },

    closeTaskForm: (state) => {
      state.isCreatingTask = false;
      state.isEditingTask = false;
      state.selectedTask = null;
    },
  },
});

export const {
  setSelectedTask,
  setViewMode,
  setFilters,
  updateFilters,
  clearFilters,
  setIsCreatingTask,
  setIsEditingTask,
  openTaskForm,
  closeTaskForm,
} = tasksSlice.actions;

export default tasksSlice.reducer;
