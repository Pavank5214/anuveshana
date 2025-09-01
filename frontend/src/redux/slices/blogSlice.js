import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// ✅ Fetch all blogs
export const fetchBlogs = createAsyncThunk("blogs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/api/blog");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch blogs");
  }
});

// ✅ Fetch single blog by ID
export const fetchBlogDetails = createAsyncThunk("blogs/fetchDetails", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/api/blog/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch blog details");
  }
});

// ✅ Add a new blog
export const createBlog = createAsyncThunk("blogs/create", async (blogData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/api/blog", blogData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create blog");
  }
});

// ✅ Update blog
export const updateBlog = createAsyncThunk("blogs/update", async ({ id, blogData }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put(`/api/blog/${id}`, blogData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update blog");
  }
});

// ✅ Delete blog
export const deleteBlog = createAsyncThunk("blogs/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/blog/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete blog");
  }
});

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    selectedBlog: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch All Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Fetch Blog Details
      .addCase(fetchBlogDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Create Blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      // ✅ Update Blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
      })
      // ✅ Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
