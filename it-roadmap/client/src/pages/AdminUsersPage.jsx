import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/use-toast";
import {
  AlertCircle,
  Check,
  Edit,
  Trash2,
  Plus,
  X,
  Search,
  Shield,
  ShieldOff,
  UserX,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import {
  getUsers,
  toggleAdmin,
  disableUser,
  resetPassword,
} from "../services/userService";

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tempPassword, setTempPassword] = useState("");

  const fetchUsers = async (page = pagination.page, query = searchQuery) => {
    try {
      setLoading(true);
      const data = await getUsers(page, pagination.limit, query);
      setUsers(data.users);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchQuery);
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, searchQuery);
  };

  const handleToggleAdmin = async (userId, isCurrentlyAdmin) => {
    try {
      await toggleAdmin(userId, !isCurrentlyAdmin);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isAdmin: !isCurrentlyAdmin } : user
        )
      );
      toast({
        title: "Đã cập nhật quyền",
        description: `Đã ${
          !isCurrentlyAdmin ? "cấp" : "thu hồi"
        } quyền quản trị.`,
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật quyền người dùng.",
        variant: "destructive",
      });
    }
  };

  const handleDisableUser = async (userId, username) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${username}"?`
      )
    ) {
      try {
        await disableUser(userId);
        toast({
          title: "Đã vô hiệu hóa tài khoản",
          description: `Tài khoản ${username} đã bị vô hiệu hóa.`,
        });
        fetchUsers(); // Tải lại danh sách
      } catch (err) {
        toast({
          title: "Lỗi",
          description: "Không thể vô hiệu hóa tài khoản người dùng.",
          variant: "destructive",
        });
      }
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      setSelectedUserId(userId);
      const result = await resetPassword(userId);
      if (result.success) {
        setTempPassword(result.tempPassword);
        setShowResetPasswordDialog(true);
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể đặt lại mật khẩu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Link>
        </Button>
        <div className="ml-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản và phân quyền người dùng trong hệ thống
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle>Danh sách người dùng</CardTitle>
            <form
              onSubmit={handleSearch}
              className="flex w-full md:w-auto gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Tìm kiếm</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên người dùng</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Không tìm thấy người dùng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.id}
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.isAdmin ? "default" : "outline"}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Tùy chọn
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Quản lý tài khoản
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleAdmin(user.id, user.isAdmin)
                                  }
                                >
                                  {user.isAdmin ? (
                                    <>
                                      <ShieldOff className="mr-2 h-4 w-4" />
                                      <span>Gỡ quyền Admin</span>
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-2 h-4 w-4" />
                                      <span>Cấp quyền Admin</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleResetPassword(user.id)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  <span>Đặt lại mật khẩu</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDisableUser(user.id, user.username)
                                  }
                                  className="text-destructive focus:text-destructive"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  <span>Vô hiệu hóa tài khoản</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Hiển thị {users.length} trên {pagination.total} người dùng
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          pagination.page > 1 &&
                          handlePageChange(pagination.page - 1)
                        }
                        className={
                          pagination.page <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={pagination.page === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          pagination.page < pagination.totalPages &&
                          handlePageChange(pagination.page + 1)
                        }
                        className={
                          pagination.page >= pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mật khẩu đã được đặt lại</DialogTitle>
            <DialogDescription>
              Mật khẩu tạm thời cho người dùng đã được tạo. Vui lòng chia sẻ với
              người dùng.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="temp-password">Mật khẩu tạm thời</Label>
            <div className="flex items-center mt-1">
              <Input
                id="temp-password"
                value={tempPassword}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(tempPassword);
                  toast({
                    title: "Đã sao chép",
                    description:
                      "Mật khẩu tạm thời đã được sao chép vào clipboard",
                  });
                }}
              >
                Sao chép
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowResetPasswordDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
