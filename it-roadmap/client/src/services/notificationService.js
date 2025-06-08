import api from "./api";

// Get all notifications
export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Get current user's notifications
export const getUserNotifications = async () => {
  try {
    const response = await api.get("/notifications/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
};

// Create a notification
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post("/notifications", notificationData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Create a notification for all users
export const createGlobalNotification = async (message) => {
  try {
    const response = await api.post("/notifications/global", { message });
    return response.data;
  } catch (error) {
    console.error("Error creating global notification:", error);
    throw error;
  }
};

// Create a notification for users of a specific roadmap
export const createRoadmapNotification = async (roadmapId, message) => {
  try {
    const response = await api.post(`/notifications/roadmap/${roadmapId}`, {
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating roadmap notification:", error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Get notification stats
export const getNotificationStats = async () => {
  try {
    const response = await api.get("/notifications/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    throw error;
  }
};
