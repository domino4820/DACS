import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRoadmaps, getRoadmapsByCategory } from "../services/roadmapService";
import { getCategories } from "../services/categoryService";

const RoadmapContext = createContext();

export function RoadmapProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 获取所有类别
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // 根据选定类别获取路线图
  const {
    data: roadmaps,
    isLoading: roadmapsLoading,
    error: roadmapsError,
    refetch: refetchRoadmaps,
  } = useQuery({
    queryKey: ["roadmaps", selectedCategory],
    queryFn: () => getRoadmapsByCategory(selectedCategory),
    enabled: true,
  });

  // 更改选定的类别
  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <RoadmapContext.Provider
      value={{
        categories,
        categoriesLoading,
        categoriesError,
        roadmaps,
        roadmapsLoading,
        roadmapsError,
        selectedCategory,
        selectCategory,
        refetchRoadmaps,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

// 使用自定义钩子简化访问上下文
export function useRoadmaps() {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error("useRoadmaps must be used within a RoadmapProvider");
  }
  return context;
}
