import api from "./api";

// Get user progress for all courses
export const getUserProgress = async (userId) => {
  const response = await api.get(`/user-progress/user/${userId}`);
  return response.data;
};

// Get user progress for a specific course
export const getUserProgressForCourse = async (userId, courseId) => {
  try {
    const response = await api.get(
      `/user-progress/user/${userId}/course/${courseId}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

// Update user progress for a course
export const updateUserProgress = async (userId, courseId, progressData) => {
  try {
    // Check if progress exists
    let response;
    try {
      response = await api.get(
        `/user-progress/user/${userId}/course/${courseId}`
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Create new progress if it doesn't exist
        response = await api.post("/user-progress", {
          userId,
          courseId,
          ...progressData,
        });
        return response.data;
      }
      throw error;
    }

    // Update existing progress
    response = await api.put(
      `/user-progress/user/${userId}/course/${courseId}`,
      progressData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
};

// Add roadmap to favorites when a course is completed
export const addRoadmapToFavorites = async (userId, roadmapId) => {
  try {
    // Check if already in favorites
    const checkResponse = await api.get(
      `/favorites/check/${userId}/${roadmapId}`
    );

    // If not a favorite, add it
    if (!checkResponse.data.isFavorite) {
      const response = await api.post("/favorites", {
        userId,
        roadmapId,
      });
      return response.data;
    }

    return { message: "Already in favorites" };
  } catch (error) {
    console.error("Error adding roadmap to favorites:", error);
    throw error;
  }
};

// Complete a course and add roadmap to favorites in a single operation
export const completeAndFavorite = async (
  userId,
  courseId,
  roadmapId,
  progressData
) => {
  try {
    const response = await api.put(
      `/user-progress/user/${userId}/course/${courseId}/complete-and-favorite/${roadmapId}`,
      progressData
    );
    return response.data;
  } catch (error) {
    console.error("Error completing course and favoriting roadmap:", error);
    throw error;
  }
};
