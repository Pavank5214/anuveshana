import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all orders(admins only)
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

// Fetch new orders count (admins only)
export const fetchNewOrdersCount = createAsyncThunk('orders/fetchNewOrdersCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/new-count`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data.count;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });


// Fetch a single order by ID(admins only)
export const fetchAdminOrderDetails = createAsyncThunk('orders/fetchAdminOrderDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });


// update order delivery status
export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus',
    async ({ id, status, trackingId, trackingUrl, courier }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, { status, trackingId, trackingUrl, courier },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });


// Delete an order
export const deleteOrder = createAsyncThunk('orders/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

const adminOrderSlice = createSlice({
    name: "adminOders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        newOrdersCount: 0,
        selectedOrder: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;

                // Keep new count in sync with the list
                state.newOrdersCount = action.payload.filter(order => order.isNew).length;

                // calculate total sales
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);
                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // Fetch new orders count
            .addCase(fetchNewOrdersCount.fulfilled, (state, action) => {
                state.newOrdersCount = action.payload;
            })
            // Fetch single order
            .addCase(fetchAdminOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchAdminOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex((order) => order._id === updatedOrder._id);
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            // delete order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
            })
    }
});

export default adminOrderSlice.reducer