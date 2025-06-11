import api from "./api"

// Get all skills
export const getSkills = async () => {
  const response = await api.get("/skills")
  return response.data
}

// Get skill by ID
export const getSkillById = async (id) => {
  const response = await api.get(`/skills/${id}`)
  return response.data
}

// Create new skill
export const createSkill = async (skillData) => {
  const response = await api.post("/skills", skillData)
  return response.data
}

// Update skill
export const updateSkill = async (id, skillData) => {
  const response = await api.put(`/skills/${id}`, skillData)
  return response.data
}

// Delete skill
export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`)
  return response.data
}
