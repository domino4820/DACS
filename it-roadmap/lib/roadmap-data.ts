import type { Node, Edge } from "reactflow"

export interface Skill {
  id: string
  name: string
  type: "role" | "skill"
  description?: string
  roadmapIds: string[]
}

export interface Document {
  id: string
  title: string
  url: string
  description?: string
  courseId: string
  addedAt: string
}

export const categories = [
  { id: "foundation", name: "Nền tảng", color: "#3b82f6" },
  { id: "frontend", name: "Frontend", color: "#10b981" },
  { id: "backend", name: "Backend", color: "#f59e0b" },
  { id: "database", name: "Database", color: "#8b5cf6" },
  { id: "devops", name: "DevOps", color: "#ef4444" },
  { id: "mobile", name: "Mobile", color: "#ec4899" },
  { id: "ai", name: "AI/ML", color: "#6366f1" },
  { id: "security", name: "Security", color: "#64748b" },
]

// Default skills list
export const defaultSkills: Skill[] = [
  {
    id: "web-development",
    name: "Web Development",
    type: "role",
    description: "Full-stack web development learning paths",
    roadmapIds: ["web-development", "javascript", "python"],
  },
  {
    id: "data-science",
    name: "Data Science",
    type: "role",
    description: "Data analysis, machine learning, and AI",
    roadmapIds: ["data-science"],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    type: "role",
    description: "Network security, ethical hacking, and defense",
    roadmapIds: ["cybersecurity"],
  },
  {
    id: "devops",
    name: "DevOps",
    type: "role",
    description: "CI/CD, infrastructure as code, and cloud services",
    roadmapIds: ["devops-engineering"],
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    type: "role",
    description: "iOS, Android, and cross-platform app development",
    roadmapIds: ["mobile-development"],
  },
  {
    id: "programming-languages",
    name: "Programming Languages",
    type: "skill",
    description: "Core programming languages and concepts",
    roadmapIds: ["javascript", "python"],
  },
  {
    id: "it-fundamentals",
    name: "IT Fundamentals",
    type: "skill",
    description: "Core IT concepts and foundational knowledge",
    roadmapIds: ["it-fundamentals"],
  },
  {
    id: "interview-questions",
    name: "Interview Questions",
    type: "skill",
    description: "Common interview questions and preparation materials",
    roadmapIds: [],
  },
]

// Default documents list
export const defaultDocuments: Document[] = [
  {
    id: "doc-web101-1",
    title: "MDN Web Docs - HTML",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    description: "Comprehensive HTML documentation from Mozilla",
    courseId: "web101",
    addedAt: new Date().toISOString(),
  },
  {
    id: "doc-web101-2",
    title: "MDN Web Docs - CSS",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    description: "Comprehensive CSS documentation from Mozilla",
    courseId: "web101",
    addedAt: new Date().toISOString(),
  },
  {
    id: "doc-web102-1",
    title: "MDN Web Docs - JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description: "Comprehensive JavaScript documentation from Mozilla",
    courseId: "web102",
    addedAt: new Date().toISOString(),
  },
  {
    id: "doc-web103-1",
    title: "React Documentation",
    url: "https://reactjs.org/docs/getting-started.html",
    description: "Official React documentation",
    courseId: "web103",
    addedAt: new Date().toISOString(),
  },
  {
    id: "doc-web201-1",
    title: "Node.js Documentation",
    url: "https://nodejs.org/en/docs/",
    description: "Official Node.js documentation",
    courseId: "web201",
    addedAt: new Date().toISOString(),
  },
]

// Helper function to create category data reference
const getCategoryData = (categoryId: string) => {
  return categories.find((cat) => cat.id === categoryId) || categories[0]
}

// Default roadmaps list
export const defaultRoadmaps = [
  {
    id: "it-fundamentals",
    title: "IT Fundamentals",
    description: "Core IT concepts and foundational knowledge",
    category: "foundation",
    courseCount: 15,
    lastUpdated: new Date().toLocaleDateString(),
    type: "skill",
    skillIds: ["it-fundamentals"],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Full-stack web development learning path",
    category: "frontend",
    courseCount: 12,
    lastUpdated: new Date().toLocaleDateString(),
    type: "role",
    skillIds: ["web-development"],
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Data analysis, machine learning, and AI",
    category: "data-science",
    courseCount: 10,
    lastUpdated: new Date().toLocaleDateString(),
    type: "role",
    skillIds: ["data-science"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Network security, ethical hacking, and defense",
    category: "security",
    courseCount: 14,
    lastUpdated: new Date().toLocaleDateString(),
    type: "role",
    skillIds: ["cybersecurity"],
  },
  {
    id: "devops-engineering",
    title: "DevOps Engineering",
    description: "CI/CD, infrastructure as code, and cloud services",
    category: "devops",
    courseCount: 11,
    lastUpdated: new Date().toLocaleDateString(),
    type: "role",
    skillIds: ["devops"],
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    description: "iOS, Android, and cross-platform app development",
    category: "mobile",
    courseCount: 9,
    lastUpdated: new Date().toLocaleDateString(),
    type: "role",
    skillIds: ["mobile-development"],
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Modern JavaScript programming from basics to advanced",
    category: "frontend",
    courseCount: 8,
    lastUpdated: new Date().toLocaleDateString(),
    type: "skill",
    skillIds: ["programming-languages", "web-development"],
  },
  {
    id: "python",
    title: "Python",
    description: "Python programming for various applications",
    category: "backend",
    courseCount: 7,
    lastUpdated: new Date().toLocaleDateString(),
    type: "skill",
    skillIds: ["programming-languages", "web-development"],
  },
  {
    id: "sql-interview",
    title: "SQL Interview Questions",
    description: "Common SQL interview questions and answers",
    category: "database",
    courseCount: 5,
    lastUpdated: new Date().toLocaleDateString(),
    type: "skill",
    skillIds: ["interview-questions"],
  },
]

// Get initial nodes based on roadmap ID
export const getInitialNodes = (roadmapId: string): Node[] => {
  // Return different initial nodes based on roadmap ID
  switch (roadmapId) {
    case "it-fundamentals":
      return [
        // Foundation Track
        {
          id: "comp101",
          type: "courseNode",
          position: { x: 100, y: 100 },
          data: {
            code: "COMP101",
            label: "Nhập môn lập trình",
            description: "Giới thiệu về lập trình, cấu trúc dữ liệu và thuật toán cơ bản",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            prerequisites: "",
            learningOutcomes: "Hiểu và áp dụng các khái niệm lập trình cơ bản",
            resources: "Introduction to Algorithms, CLRS",
            completedAt: null,
            documentation: "https://example.com/comp101-docs",
            documents: [
              {
                id: "doc-comp101-1",
                title: "Introduction to Programming",
                url: "https://example.com/intro-programming",
                description: "Basic programming concepts and algorithms",
                courseId: "comp101",
                addedAt: new Date().toISOString(),
              },
            ],
            skillId: "it-fundamentals",
          },
        },
        {
          id: "comp102",
          type: "courseNode",
          position: { x: 100, y: 200 },
          data: {
            code: "COMP102",
            label: "Cấu trúc dữ liệu",
            description: "Các cấu trúc dữ liệu cơ bản và nâng cao",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            prerequisites: "COMP101",
            completedAt: null,
            documentation: "https://example.com/comp102-docs",
            documents: [
              {
                id: "doc-comp102-1",
                title: "Data Structures Guide",
                url: "https://example.com/data-structures",
                description: "Comprehensive guide to data structures",
                courseId: "comp102",
                addedAt: new Date().toISOString(),
              },
            ],
            skillId: "it-fundamentals",
          },
        },
        {
          id: "comp103",
          type: "courseNode",
          position: { x: 100, y: 300 },
          data: {
            code: "COMP103",
            label: "Thuật toán",
            description: "Phân tích và thiết kế thuật toán",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            prerequisites: "COMP102",
            completedAt: null,
            documentation: "https://example.com/comp103-docs",
            documents: [
              {
                id: "doc-comp103-1",
                title: "Algorithm Design Manual",
                url: "https://example.com/algorithm-design",
                description: "Guide to algorithm design and analysis",
                courseId: "comp103",
                addedAt: new Date().toISOString(),
              },
            ],
            skillId: "it-fundamentals",
          },
        },
        // Math Track
        {
          id: "math101",
          type: "courseNode",
          position: { x: 300, y: 100 },
          data: {
            code: "MATH101",
            label: "Đại số tuyến tính",
            description: "Không gian vector, ma trận và ứng dụng",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/math101-docs",
            documents: [],
            skillId: "it-fundamentals",
          },
        },
        {
          id: "math102",
          type: "courseNode",
          position: { x: 300, y: 200 },
          data: {
            code: "MATH102",
            label: "Giải tích",
            description: "Giải tích một biến và nhiều biến",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/math102-docs",
            documents: [],
            skillId: "it-fundamentals",
          },
        },
        {
          id: "math103",
          type: "courseNode",
          position: { x: 300, y: 300 },
          data: {
            code: "MATH103",
            label: "Xác suất thống kê",
            description: "Lý thuyết xác suất và thống kê ứng dụng",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/math103-docs",
            documents: [],
            skillId: "it-fundamentals",
          },
        },
        // Computer Architecture
        {
          id: "comp201",
          type: "courseNode",
          position: { x: 500, y: 100 },
          data: {
            code: "COMP201",
            label: "Kiến trúc máy tính",
            description: "Cấu trúc và tổ chức máy tính",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/comp201-docs",
            documents: [],
            skillId: "it-fundamentals",
          },
        },
        {
          id: "comp202",
          type: "courseNode",
          position: { x: 500, y: 200 },
          data: {
            code: "COMP202",
            label: "Hệ điều hành",
            description: "Nguyên lý và cấu trúc hệ điều hành",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            prerequisites: "COMP201",
            completedAt: null,
            documentation: "https://example.com/comp202-docs",
            documents: [],
            skillId: "it-fundamentals",
          },
        },
        {
          id: "comp203",
          type: "courseNode",
          position: { x: 500, y: 300 },
          data: {
            code: "COMP203",
            label: "Mạng máy tính",
            description: "Nguyên lý và giao thức mạng",
            category: "foundation",
            categoryData: getCategoryData("foundation"),
            credits: 3,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/comp203-docs",
            documents: [],
            skillId: "it-fundamentals",
          },
        },
      ]

    case "web-development":
      return [
        // Frontend Track
        {
          id: "web101",
          type: "courseNode",
          position: { x: 100, y: 100 },
          data: {
            code: "WEB101",
            label: "HTML/CSS cơ bản",
            description: "Nền tảng về HTML và CSS để xây dựng giao diện web",
            category: "frontend",
            categoryData: getCategoryData("frontend"),
            credits: 3,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/web101-docs",
            documents: [
              {
                id: "doc-web101-1",
                title: "MDN Web Docs - HTML",
                url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
                description: "Comprehensive HTML documentation from Mozilla",
                courseId: "web101",
                addedAt: new Date().toISOString(),
              },
              {
                id: "doc-web101-2",
                title: "MDN Web Docs - CSS",
                url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
                description: "Comprehensive CSS documentation from Mozilla",
                courseId: "web101",
                addedAt: new Date().toISOString(),
              },
            ],
            skillId: "web-development",
          },
        },
        {
          id: "web102",
          type: "courseNode",
          position: { x: 100, y: 200 },
          data: {
            code: "WEB102",
            label: "JavaScript",
            description: "Ngôn ngữ lập trình JavaScript và DOM",
            category: "frontend",
            categoryData: getCategoryData("frontend"),
            credits: 3,
            completed: false,
            prerequisites: "WEB101",
            completedAt: null,
            documentation: "https://example.com/web102-docs",
            documents: [
              {
                id: "doc-web102-1",
                title: "MDN Web Docs - JavaScript",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
                description: "Comprehensive JavaScript documentation from Mozilla",
                courseId: "web102",
                addedAt: new Date().toISOString(),
              },
            ],
            skillId: "web-development",
          },
        },
        {
          id: "web103",
          type: "courseNode",
          position: { x: 100, y: 300 },
          data: {
            code: "WEB103",
            label: "React",
            description: "Xây dựng ứng dụng với thư viện React",
            category: "frontend",
            categoryData: getCategoryData("frontend"),
            credits: 4,
            completed: false,
            prerequisites: "WEB102",
            completedAt: null,
            documentation: "https://example.com/web103-docs",
            documents: [
              {
                id: "doc-web103-1",
                title: "React Documentation",
                url: "https://reactjs.org/docs/getting-started.html",
                description: "Official React documentation",
                courseId: "web103",
                addedAt: new Date().toISOString(),
              },
            ],
            skillId: "web-development",
          },
        },
        // Backend Track
        {
          id: "web201",
          type: "courseNode",
          position: { x: 300, y: 100 },
          data: {
            code: "WEB201",
            label: "Node.js",
            description: "Phát triển ứng dụng server với Node.js",
            category: "backend",
            categoryData: getCategoryData("backend"),
            credits: 3,
            completed: false,
            prerequisites: "WEB102",
            completedAt: null,
            documentation: "https://example.com/web201-docs",
            documents: [
              {
                id: "doc-web201-1",
                title: "Node.js Documentation",
                url: "https://nodejs.org/en/docs/",
                description: "Official Node.js documentation",
                courseId: "web201",
                addedAt: new Date().toISOString(),
              },
            ],
            skillId: "web-development",
          },
        },
        {
          id: "web202",
          type: "courseNode",
          position: { x: 300, y: 200 },
          data: {
            code: "WEB202",
            label: "API Development",
            description: "Thiết kế và phát triển RESTful API",
            category: "backend",
            categoryData: getCategoryData("backend"),
            credits: 3,
            completed: false,
            prerequisites: "WEB201",
            completedAt: null,
            documentation: "https://example.com/web202-docs",
            documents: [],
            skillId: "web-development",
          },
        },
        {
          id: "web203",
          type: "courseNode",
          position: { x: 300, y: 300 },
          data: {
            code: "WEB203",
            label: "Authentication & Authorization",
            description: "Bảo mật và phân quyền trong ứng dụng web",
            category: "backend",
            categoryData: getCategoryData("backend"),
            credits: 3,
            completed: false,
            prerequisites: "WEB202",
            completedAt: null,
            documentation: "https://example.com/web203-docs",
            documents: [],
            skillId: "web-development",
          },
        },
        // Database Track
        {
          id: "web301",
          type: "courseNode",
          position: { x: 500, y: 100 },
          data: {
            code: "WEB301",
            label: "SQL Databases",
            description: "Nguyên lý cơ sở dữ liệu và SQL",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 3,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/web301-docs",
            documents: [],
            skillId: "web-development",
          },
        },
        {
          id: "web302",
          type: "courseNode",
          position: { x: 500, y: 200 },
          data: {
            code: "WEB302",
            label: "NoSQL Databases",
            description: "Cơ sở dữ liệu NoSQL và MongoDB",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 3,
            completed: false,
            prerequisites: "WEB301",
            completedAt: null,
            documentation: "https://example.com/web302-docs",
            documents: [],
            skillId: "web-development",
          },
        },
        {
          id: "web303",
          type: "courseNode",
          position: { x: 500, y: 300 },
          data: {
            code: "WEB303",
            label: "ORM & Data Modeling",
            description: "Thiết kế và mô hình hóa dữ liệu",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 3,
            completed: false,
            prerequisites: "WEB301",
            completedAt: null,
            documentation: "https://example.com/web303-docs",
            documents: [],
            skillId: "web-development",
          },
        },
      ]

    case "sql-interview":
      return [
        {
          id: "sql101",
          type: "courseNode",
          position: { x: 100, y: 100 },
          data: {
            code: "SQL101",
            label: "SQL Basics",
            description: "Basic SQL queries and database concepts",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 2,
            completed: false,
            completedAt: null,
            documentation: "https://example.com/sql101-docs",
            documents: [],
            skillId: "interview-questions",
          },
        },
        {
          id: "sql102",
          type: "courseNode",
          position: { x: 100, y: 200 },
          data: {
            code: "SQL102",
            label: "Joins and Relationships",
            description: "SQL joins and table relationships",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 2,
            completed: false,
            prerequisites: "SQL101",
            completedAt: null,
            documentation: "https://example.com/sql102-docs",
            documents: [],
            skillId: "interview-questions",
          },
        },
        {
          id: "sql103",
          type: "courseNode",
          position: { x: 100, y: 300 },
          data: {
            code: "SQL103",
            label: "Aggregation and Grouping",
            description: "GROUP BY, HAVING, and aggregate functions",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 2,
            completed: false,
            prerequisites: "SQL102",
            completedAt: null,
            documentation: "https://example.com/sql103-docs",
            documents: [],
            skillId: "interview-questions",
          },
        },
        {
          id: "sql201",
          type: "courseNode",
          position: { x: 300, y: 100 },
          data: {
            code: "SQL201",
            label: "Subqueries",
            description: "Nested queries and subquery optimization",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 3,
            completed: false,
            prerequisites: "SQL103",
            completedAt: null,
            documentation: "https://example.com/sql201-docs",
            documents: [],
            skillId: "interview-questions",
          },
        },
        {
          id: "sql202",
          type: "courseNode",
          position: { x: 300, y: 200 },
          data: {
            code: "SQL202",
            label: "Window Functions",
            description: "Advanced analytics with window functions",
            category: "database",
            categoryData: getCategoryData("database"),
            credits: 3,
            completed: false,
            prerequisites: "SQL201",
            completedAt: null,
            documentation: "https://example.com/sql202-docs",
            documents: [],
            skillId: "interview-questions",
          },
        },
      ]

    default:
      return []
  }
}

// Get initial edges based on roadmap ID
export const getInitialEdges = (roadmapId: string): Edge[] => {
  // Return different initial edges based on roadmap ID
  switch (roadmapId) {
    case "it-fundamentals":
      return [
        // Foundation Track
        { id: "e-comp101-comp102", source: "comp101", target: "comp102" },
        { id: "e-comp102-comp103", source: "comp102", target: "comp103" },

        // Math Track
        { id: "e-math101-math102", source: "math101", target: "math102" },
        { id: "e-math102-math103", source: "math102", target: "math103" },

        // Computer Architecture
        { id: "e-comp201-comp202", source: "comp201", target: "comp202" },

        // Cross-track connections
        { id: "e-comp101-math101", source: "comp101", target: "math101", type: "step" },
        { id: "e-comp103-comp201", source: "comp103", target: "comp201", type: "step" },
      ]

    case "web-development":
      return [
        // Frontend Track
        { id: "e-web101-web102", source: "web101", target: "web102" },
        { id: "e-web102-web103", source: "web102", target: "web103" },

        // Backend Track
        { id: "e-web102-web201", source: "web102", target: "web201" },
        { id: "e-web201-web202", source: "web201", target: "web202" },
        { id: "e-web202-web203", source: "web202", target: "web203" },

        // Database Track
        { id: "e-web301-web302", source: "web301", target: "web302" },
        { id: "e-web301-web303", source: "web301", target: "web303" },

        // Cross-track connections
        { id: "e-web103-web201", source: "web103", target: "web201" },
        { id: "e-web202-web301", source: "web202", target: "web301" },
      ]

    case "sql-interview":
      return [
        { id: "e-sql101-sql102", source: "sql101", target: "sql102" },
        { id: "e-sql102-sql103", source: "sql102", target: "sql103" },
        { id: "e-sql103-sql201", source: "sql103", target: "sql201" },
        { id: "e-sql201-sql202", source: "sql201", target: "sql202" },
      ]

    default:
      return []
  }
}
