import api from "./api"

// Get all courses
export const getCourses = async () => {
  const response = await api.get("/courses")
  return response.data
}

// Get course by ID
export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`)
  return response.data
}

// Create new course
export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData)
  return response.data
}

// Update course
export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData)
  return response.data
}

// Delete course
export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`)
  return response.data
}

// Toggle course completion
export const toggleCourseCompletion = async (id, completed) => {
  const response = await api.post(`/courses/${id}/complete`, { completed })
  return response.data
}
