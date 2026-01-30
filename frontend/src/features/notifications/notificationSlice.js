import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/tasks/notifications');
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id, { rejectWithValue }) => {
    try {
        await api.patch(`/tasks/notifications/${id}/read`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        list: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.list = state.list.filter(n => n.id !== action.payload);
            });
    }
});

export default notificationSlice.reducer;
