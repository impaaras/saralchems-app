import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api';

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'home/fetchCategories',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/category');
      const categoriesData = response.data;
      console.log(categoriesData, 'data');

      const subCategoriesMap = {};
      const processedCategories = [];

      for (const category of categoriesData) {
        if (category.subcategories && category.subcategories.length > 0) {
          const subcats = category.subcategories.map(subcat => ({
            ...subcat,
            parentCategoryId: category._id,
            parentCategoryName: category.name,
            subCategories: category.subcategories,
          }));
          subCategoriesMap[category._id] = subcats;
          processedCategories.push(category);
        }
      }

      return {
        categories: processedCategories,
        subCategories: subCategoriesMap,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load categories',
      );
    }
  },
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    categories: [],
    subCategories: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.subCategories = action.payload.subCategories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default homeSlice.reducer;
