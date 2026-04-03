import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// --- Async Thunks ---

export const fetchAddresses = createAsyncThunk(
    "addresses/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_URL}/api/users/profile/addresses`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
        }
    }
);

export const addAddress = createAsyncThunk(
    "addresses/add",
    async (addressData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(`${API_URL}/api/users/profile/addresses`, addressData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add address");
        }
    }
);

export const updateAddress = createAsyncThunk(
    "addresses/update",
    async ({ id, addressData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.put(`${API_URL}/api/users/profile/addresses/${id}`, addressData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update address");
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "addresses/delete",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.delete(`${API_URL}/api/users/profile/addresses/${id}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete address");
        }
    }
);

export const setDefaultAddress = createAsyncThunk(
    "addresses/setDefault",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch(`${API_URL}/api/users/profile/addresses/${id}/default`, {}, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to set default address");
        }
    }
);

// --- Slice ---

const addressSlice = createSlice({
    name: "addresses",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add, Update, Delete, SetDefault (all return the updated addresses array)
            .addMatcher(
                (action) => [addAddress.fulfilled, updateAddress.fulfilled, deleteAddress.fulfilled, setDefaultAddress.fulfilled].includes(action.type),
                (state, action) => {
                    state.loading = false;
                    state.addresses = action.payload;
                }
            )
            .addMatcher(
                (action) => [addAddress.pending, updateAddress.pending, deleteAddress.pending, setDefaultAddress.pending].includes(action.type),
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                (action) => [addAddress.rejected, updateAddress.rejected, deleteAddress.rejected, setDefaultAddress.rejected].includes(action.type),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
