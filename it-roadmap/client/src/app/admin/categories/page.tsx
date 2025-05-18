"use client"

import { useAuth } from "@/hooks/use-auth"
import { CategoryManagement } from "@/components/admin/category-management"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CategoriesPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. Please contact an administrator if you believe this is an
            error.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <CategoryManagement />
    </div>
  )
}
