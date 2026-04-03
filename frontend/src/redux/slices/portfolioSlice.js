import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
  portfolios: [],
  selectedPortfolio: null,
  loading: false,
  error: null,
};

// ✅ Fetch all portfolios
export const fetchPortfolios = createAsyncThunk(
  "portfolio/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/portfolio");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch portfolios");
    }
  }
);

// ✅ Fetch portfolio details by ID
export const fetchPortfolioDetails = createAsyncThunk(
  "portfolio/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/portfolio/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch portfolio details");
    }
  }
);

// ✅ Create new portfolio
export const createPortfolio = createAsyncThunk(
  "portfolio/create",
  async (portfolioData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/portfolio", portfolioData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create portfolio");
    }
  }
);

// ✅ Update portfolio
export const updatePortfolio = createAsyncThunk(
  "portfolio/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/portfolio/${id}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update portfolio");
    }
  }
);

// ✅ Delete portfolio
export const deletePortfolio = createAsyncThunk(
  "portfolio/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/portfolio/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete portfolio");
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch portfolios
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = action.payload;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch portfolio details
      .addCase(fetchPortfolioDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPortfolio = null;
      })
      .addCase(fetchPortfolioDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPortfolio = action.payload;
      })
      .addCase(fetchPortfolioDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Create portfolio
      .addCase(createPortfolio.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = [action.payload, ...state.portfolios];
      })
      .addCase(createPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update portfolio
      .addCase(updatePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = state.portfolios.map((portfolio) =>
          portfolio._id === action.payload._id ? action.payload : portfolio
        );
      })
      .addCase(updatePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete portfolio
      .addCase(deletePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = state.portfolios.filter(
          (portfolio) => portfolio._id !== action.payload
        );
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default portfolioSlice.reducer;
