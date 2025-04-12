// src/redux/slices/searchHistorySlice.js
import {createSlice} from '@reduxjs/toolkit';
import {MMKV} from 'react-native-mmkv';
import {storage} from '../../utils/storage';

const HISTORY_LIMIT = 10;
const SEARCH_HISTORY_KEY = 'searchHistory';

const initialState = {
  history: [],
};

// Load history from storage
const loadHistory = () => {
  const historyString = storage.getString(SEARCH_HISTORY_KEY);
  return historyString ? JSON.parse(historyString) : [];
};

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState: {
    ...initialState,
    history: loadHistory(),
  },

  reducers: {
    addToHistory: (state, action) => {
      const newQuery = action.payload.trim();
      if (!newQuery) return;

      // Remove if already exists
      const updatedHistory = state.history.filter(item => item !== newQuery);

      // Add to beginning
      updatedHistory.unshift(newQuery);

      // Limit to last 10 items
      if (updatedHistory.length > HISTORY_LIMIT) {
        updatedHistory.pop();
      }

      state.history = updatedHistory;
      storage.set(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    },
    clearHistory: state => {
      state.history = [];
      storage.delete(SEARCH_HISTORY_KEY);
    },
  },
});

export const {addToHistory, clearHistory} = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
