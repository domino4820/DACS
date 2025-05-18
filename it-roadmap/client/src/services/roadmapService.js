import api from "./api"

// Get all roadmaps
export const getRoadmaps = async () => {
  const response = await api.get("/roadmaps")
  return response.data
}

// Get roadmap by ID
export const getRoadmapById = async (id) => {
  const response = await api.get(`/roadmaps/${id}`)
  return response.data
}

// Create new roadmap
export const createRoadmap = async (roadmapData) => {
  const response = await api.post("/roadmaps", roadmapData)
  return response.data
}

// Update roadmap
export const updateRoadmap = async (id, roadmapData) => {
  const response = await api.put(`/roadmaps/${id}`, roadmapData)
  return response.data
}

// Delete roadmap
export const deleteRoadmap = async (id) => {
  const response = await api.delete(`/roadmaps/${id}`)
  return response.data
}

// Get roadmap nodes
export const getRoadmapNodes = async (id) => {
  const response = await api.get(`/roadmaps/${id}/nodes`)
  return response.data
}

// Update roadmap nodes
export const updateRoadmapNodes = async (id, nodes) => {
  const response = await api.put(`/roadmaps/${id}/nodes`, { nodes })
  return response.data
}

// Get roadmap edges
export const getRoadmapEdges = async (id) => {
  const response = await api.get(`/roadmaps/${id}/edges`)
  return response.data
}

// Update roadmap edges
export const updateRoadmapEdges = async (id, edges) => {
  const response = await api.put(`/roadmaps/${id}/edges`, { edges })
  return response.data
}

// Toggle favorite roadmap
export const toggleFavoriteRoadmap = async (id) => {
  const response = await api.post(`/roadmaps/${id}/favorite`)
  return response.data
}

// Get user favorites
export const getUserFavorites = async () => {
  const response = await api.get("/roadmaps/favorites")
  return response.data
}
