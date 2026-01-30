import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (status, { rejectWithValue }) => {
    try {
        const response = await api.get('/tasks', { params: { status } });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
});

export const fetchStats = createAsyncThunk('tasks/fetchStats', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/tasks/stats');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
        await api.patch(`/tasks/${id}/status`, { status });
        dispatch(fetchTasks());
        dispatch(fetchStats());
        return { id, status };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue, dispatch }) => {
    try {
        const response = await api.post('/tasks', taskData);
        dispatch(fetchTasks());
        dispatch(fetchStats());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Creation failed');
    }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }, { rejectWithValue, dispatch }) => {
    try {
        await api.put(`/tasks/${id}`, updates);
        dispatch(fetchTasks());
        dispatch(fetchStats());
        return { id, updates };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
});

export const deleteTaskThunk = createAsyncThunk('tasks/delete', async (id, { rejectWithValue, dispatch }) => {
    try {
        await api.delete(`/tasks/${id}`);
        dispatch(fetchTasks());
        dispatch(fetchStats());
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Deletion failed');
    }
});

const initialState = {
    tasks: [],
    stats: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    loading: false,
    error: null,
    searchTerm: '',
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => { state.loading = true; })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    },
});

export const { setSearchTerm } = taskSlice.actions;
export default taskSlice.reducer;
