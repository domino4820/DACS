import api from "./api";

// Get all categories
export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color || "#6d28d9", // Default color if none is provided
      description: category.description || "",
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return empty array in case of error
    return [];
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create new category
export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

// Update category
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

// Delete category
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
