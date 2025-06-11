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
  ArrowLeft,
  Bell,
  Send,
  Users,
  User,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  getNotifications,
  createGlobalNotification,
  createRoadmapNotification,
} from "../services/notificationService";
import { getRoadmaps } from "../services/roadmapService";

const AdminNotificationsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("send");
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    message: "",
    targetType: "all", // all, specific
    targetRoadmapId: "",
    sendEmail: false,
  });

  useEffect(() => {
    fetchRoadmaps();
    fetchNotificationHistory();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const data = await getRoadmaps();
      setRoadmaps(data);
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
    }
  };

  const fetchNotificationHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getNotifications();
      setNotificationHistory(data);
    } catch (err) {
      console.error("Error fetching notification history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name, checked) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập nội dung thông báo",
        variant: "destructive",
      });
      return;
    }

    if (formData.targetType === "specific" && !formData.targetRoadmapId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn lộ trình",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      let result;

      if (formData.targetType === "all") {
        result = await createGlobalNotification(formData.message);
      } else {
        result = await createRoadmapNotification(
          formData.targetRoadmapId,
          formData.message
        );
      }

      if (result) {
        toast({
          title: "Thành công",
          description: "Thông báo đã được gửi thành công",
        });

        // Reset form
        setFormData({
          message: "",
          targetType: "all",
          targetRoadmapId: "",
          sendEmail: false,
        });

        // Refresh notification history
        fetchNotificationHistory();
      }
    } catch (err) {
      console.error("Error sending notification:", err);
      toast({
        title: "Lỗi",
        description: "Không thể gửi thông báo. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
            Quản lý thông báo hệ thống
          </h1>
          <p className="text-muted-foreground">
            Gửi thông báo cho người dùng trong hệ thống
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="send">Gửi thông báo mới</TabsTrigger>
          <TabsTrigger value="history">Lịch sử thông báo</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Tạo thông báo mới</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Label htmlFor="message">Nội dung thông báo</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Nhập nội dung thông báo..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="mb-6">
                  <Label htmlFor="targetType">Đối tượng nhận</Label>
                  <Select
                    value={formData.targetType}
                    onValueChange={(value) =>
                      handleSelectChange("targetType", value)
                    }
                  >
                    <SelectTrigger id="targetType" className="mt-1">
                      <SelectValue placeholder="Chọn đối tượng nhận" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả người dùng</SelectItem>
                      <SelectItem value="specific">
                        Người dùng theo lộ trình
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.targetType === "specific" && (
                  <div className="mb-6">
                    <Label htmlFor="targetRoadmapId">Chọn lộ trình</Label>
                    <Select
                      value={formData.targetRoadmapId}
                      onValueChange={(value) =>
                        handleSelectChange("targetRoadmapId", value)
                      }
                    >
                      <SelectTrigger id="targetRoadmapId" className="mt-1">
                        <SelectValue placeholder="Chọn lộ trình" />
                      </SelectTrigger>
                      <SelectContent>
                        {roadmaps.map((roadmap) => (
                          <SelectItem
                            key={roadmap.id}
                            value={roadmap.id.toString()}
                          >
                            {roadmap.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="mb-6 flex items-center space-x-2">
                  <Switch
                    id="sendEmail"
                    checked={formData.sendEmail}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("sendEmail", checked)
                    }
                  />
                  <Label htmlFor="sendEmail">Đồng thời gửi qua email</Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button type="submit" disabled={sending} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? "Đang gửi..." : "Gửi thông báo"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        message: "",
                        targetType: "all",
                        targetRoadmapId: "",
                        sendEmail: false,
                      });
                    }}
                    className="sm:flex-initial"
                  >
                    Xóa
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thông báo</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex justify-center items-center py-8">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nội dung</TableHead>
                        <TableHead>Đối tượng</TableHead>
                        <TableHead>Người gửi</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Đã đọc</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notificationHistory.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            Chưa có thông báo nào được gửi
                          </TableCell>
                        </TableRow>
                      ) : (
                        notificationHistory.map((notification) => (
                          <TableRow key={notification.id}>
                            <TableCell className="font-medium">
                              {notification.message}
                            </TableCell>
                            <TableCell>
                              {!notification.roadmapId ? (
                                <Badge variant="default">
                                  <Users className="h-3 w-3 mr-1" />
                                  Tất cả người dùng
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <User className="h-3 w-3 mr-1" />
                                  Lộ trình cụ thể
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{notification.userId}</TableCell>
                            <TableCell>
                              {formatDate(notification.createdAt)}
                            </TableCell>
                            <TableCell>
                              {notification.read ? "Đã đọc" : "Chưa đọc"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotificationsPage;
