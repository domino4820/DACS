import api from "./api";

// Get all users
export const getUsers = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await api.get(
      `/users?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Toggle admin status
export const toggleAdmin = async (id, isAdmin) => {
  try {
    const response = await api.put(`/users/${id}/admin`, { isAdmin });
    return response.data;
  } catch (error) {
    console.error("Error updating admin status:", error);
    throw error;
  }
};

// Disable user account
export const disableUser = async (id) => {
  try {
    const response = await api.put(`/users/${id}/disable`);
    return response.data;
  } catch (error) {
    console.error("Error disabling user:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (id) => {
  try {
    const response = await api.post(`/users/${id}/reset-password`);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Get user stats
export const getUserStats = async () => {
  try {
    const response = await api.get("/users/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};
