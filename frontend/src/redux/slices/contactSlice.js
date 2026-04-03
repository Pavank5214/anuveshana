import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Backend URL from env
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create Contact (POST)
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/contact`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send message"
      );
    }
  }
);

// Fetch All Contacts (GET)
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/contact` , 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch contacts"
      );
    }
  }
);

// Slice
const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    loading: false,
    success: false,
    error: null,
    contacts: [],
  },
  reducers: {
    resetContactState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create contact
    builder
      .addCase(createContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContact.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
