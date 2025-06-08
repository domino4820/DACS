import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu.jsx";

export function NotificationDropdown() {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Dữ liệu thông báo mẫu
  const notifications = [
    {
      id: 1,
      title: "Đã thêm khóa học mới",
      message: "Đã thêm khóa học React nâng cao vào lộ trình Web.",
      time: "10 phút trước",
      read: false,
    },
    {
      id: 2,
      title: "Cập nhật lộ trình học",
      message: "Lộ trình Khoa học dữ liệu bạn đang theo dõi đã được cập nhật.",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      title: "Nhắc nhở hoàn thành khóa học",
      message: "Bạn đã hoàn thành khóa học Cơ bản Python.",
      time: "Hôm qua",
      read: true,
    },
  ];

  const markAllAsRead = () => {
    setHasUnreadNotifications(false);
    // Có thể thêm API call để cập nhật trạng thái thông báo trên máy chủ
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {hasUnreadNotifications && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          )}
          <span className="sr-only">Xem thông báo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between">
          <span>Thông báo</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs font-normal text-primary"
            onClick={markAllAsRead}
          >
            Đánh dấu đã đọc tất cả
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-4"
              >
                <div className="flex w-full justify-between">
                  <p className="font-medium">{notification.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                {!notification.read && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Không có thông báo
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
