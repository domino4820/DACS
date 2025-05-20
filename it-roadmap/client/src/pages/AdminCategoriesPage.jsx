import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const AdminCategoriesPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin - Manage Categories</h1>
      <Card>
        <CardHeader>
          <CardTitle>Categories Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This is a placeholder for the categories management interface. In a
            complete implementation, this would include a list of categories
            with options to add, edit, and delete categories.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategoriesPage;
