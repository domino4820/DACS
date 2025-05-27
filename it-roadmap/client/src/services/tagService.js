import api from "./api";

// Get all tags
export const getTags = async () => {
  const response = await api.get("/tags");
  return response.data;
};

// Get tag by ID
export const getTagById = async (id) => {
  const response = await api.get(`/tags/${id}`);
  return response.data;
};

// Create new tag
export const createTag = async (tagData) => {
  const response = await api.post("/tags", tagData);
  return response.data;
};

// Update tag
export const updateTag = async (id, tagData) => {
  const response = await api.put(`/tags/${id}`, tagData);
  return response.data;
};

// Delete tag
export const deleteTag = async (id) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};

// Get roadmaps by tag ID
export const getRoadmapsByTagId = async (id) => {
  const response = await api.get(`/tags/${id}/roadmaps`);
  return response.data;
};
