import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/tickets`;

export const createTicket = createAsyncThunk(
    'tickets/createTicket',
    async (ticketData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, ticketData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserTickets = createAsyncThunk(
    'tickets/fetchUserTickets',
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAdminTickets = createAsyncThunk(
    'tickets/fetchAdminTickets',
    async ({ page = 1, limit = 15 } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchTicketDetails = createAsyncThunk(
    'tickets/fetchTicketDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const replyToTicket = createAsyncThunk(
    'tickets/replyToTicket',
    async ({ id, message }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/message`, { message }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'tickets/updateTicketStatus',
    async ({ id, status, priority }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/status`, { status, priority }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUnreadTicketsCount = createAsyncThunk(
    'tickets/fetchUnreadTicketsCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/count/unread`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserUnreadCount = createAsyncThunk(
    'tickets/fetchUserUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/count/user-unread`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        page: 1,
        pages: 1,
        total: 0,
        unreadCount: 0,
        unreadCountUser: 0,
        selectedTicket: null,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetTicketState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        setSelectedTicket: (state, action) => {
            state.selectedTicket = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTicket.pending, (state) => { state.loading = true; })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.tickets.unshift(action.payload);
                state.selectedTicket = action.payload;
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchUserTickets.pending, (state) => { state.loading = true; })
            .addCase(fetchUserTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload.tickets;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(fetchAdminTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload.tickets;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(fetchTicketDetails.fulfilled, (state, action) => {
                state.selectedTicket = action.payload;
            })
            .addCase(replyToTicket.fulfilled, (state, action) => {
                state.selectedTicket = action.payload;
                const index = state.tickets.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            })
            .addCase(updateTicketStatus.fulfilled, (state, action) => {
                state.selectedTicket = action.payload;
                const index = state.tickets.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            })
            .addCase(fetchUnreadTicketsCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload.count;
            })
            .addCase(fetchUserUnreadCount.fulfilled, (state, action) => {
                state.unreadCountUser = action.payload.count;
            });
    }
});

export const { resetTicketState, setSelectedTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
