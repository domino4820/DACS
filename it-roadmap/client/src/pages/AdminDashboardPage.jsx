import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Users,
  FolderTree,
  Tags,
  Bell,
  Grid,
  Workflow,
  Book,
  Settings,
  BarChart3,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminDashboardPage = () => {
  const { user } = useAuth();

  const adminModules = [
    {
      title: "Quản lý danh mục",
      icon: <FolderTree className="h-8 w-8 mb-2 text-primary" />,
      description: "Thêm, sửa, xóa các danh mục trong hệ thống",
      link: "/admin/categories",
      color: "bg-gradient-to-br from-purple-500/10 to-purple-700/10",
      border: "border-purple-500/20",
    },
    {
      title: "Quản lý người dùng",
      icon: <Users className="h-8 w-8 mb-2 text-primary" />,
      description: "Quản lý tài khoản người dùng, phân quyền admin",
      link: "/admin/users",
      color: "bg-gradient-to-br from-blue-500/10 to-blue-700/10",
      border: "border-blue-500/20",
    },
    {
      title: "Thông báo hệ thống",
      icon: <Bell className="h-8 w-8 mb-2 text-primary" />,
      description: "Gửi và quản lý thông báo cho toàn bộ hệ thống",
      link: "/admin/notifications",
      color: "bg-gradient-to-br from-yellow-500/10 to-yellow-700/10",
      border: "border-yellow-500/20",
    },
    {
      title: "Quản lý kỹ năng",
      icon: <Layers className="h-8 w-8 mb-2 text-primary" />,
      description: "Thêm, sửa, xóa các kỹ năng trong hệ thống",
      link: "/admin/skills",
      color: "bg-gradient-to-br from-green-500/10 to-green-700/10",
      border: "border-green-500/20",
    },
    {
      title: "Quản lý thẻ tag",
      icon: <Tags className="h-8 w-8 mb-2 text-primary" />,
      description: "Thêm, sửa, xóa các thẻ tag cho lộ trình",
      link: "/admin/tags",
      color: "bg-gradient-to-br from-pink-500/10 to-pink-700/10",
      border: "border-pink-500/20",
    },
    {
      title: "Quản lý khóa học",
      icon: <Book className="h-8 w-8 mb-2 text-primary" />,
      description: "Thêm, sửa, xóa khóa học trong hệ thống",
      link: "/admin/courses",
      color: "bg-gradient-to-br from-cyan-500/10 to-cyan-700/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Quản trị hệ thống
          </h1>
          <p className="text-muted-foreground mt-1">
            Chào mừng, {user?.username || "Admin"}! Quản lý toàn bộ hệ thống từ
            đây.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminModules.map((module, index) => (
          <Link to={module.link} key={index} className="no-underline">
            <Card
              className={`h-full transition-all duration-300 hover:shadow-md ${module.color} border ${module.border} hover:-translate-y-1`}
            >
              <CardHeader>
                <div className="flex flex-col items-center mb-2">
                  {module.icon}
                  <CardTitle className="text-xl font-medium text-center">
                    {module.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-center text-muted-foreground">
                  {module.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 mb-8">
        <h2 className="text-xl font-medium mb-4">Số liệu tổng quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">--</span>
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Lộ trình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">--</span>
                <Workflow className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-700/10 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">--</span>
                <Book className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 border-yellow-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">--</span>
                <FolderTree className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 mb-4">
        <h2 className="text-xl font-medium mb-4">Truy cập nhanh</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            className="border-primary/20 hover:border-primary/40"
            asChild
          >
            <Link to="/admin/categories">
              <FolderTree className="h-4 w-4 mr-2" /> Quản lý danh mục
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-primary/20 hover:border-primary/40"
            asChild
          >
            <Link to="/admin/users">
              <Users className="h-4 w-4 mr-2" /> Quản lý người dùng
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-primary/20 hover:border-primary/40"
            asChild
          >
            <Link to="/admin/notifications">
              <Bell className="h-4 w-4 mr-2" /> Gửi thông báo hệ thống
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
