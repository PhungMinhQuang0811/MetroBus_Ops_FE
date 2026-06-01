"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, FileText, AlertTriangle, Activity, Server } from "lucide-react";

const stats = [
  {
    title: "Tổng tài khoản",
    value: "12,458",
    description: "Tất cả người dùng",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Tài khoản bị khóa",
    value: "23",
    description: "Đang bị ban",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Vai trò hệ thống",
    value: "6",
    description: "Roles đang hoạt động",
    icon: Shield,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    title: "Logs hôm nay",
    value: "1,847",
    description: "Sự kiện ghi nhận",
    icon: FileText,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const recentActivities = [
  {
    id: 1,
    action: "Ban account",
    target: "user_12345",
    actor: "admin",
    time: "5 phút trước",
    type: "warning",
  },
  {
    id: 2,
    action: "Update RBAC",
    target: "STAFF role",
    actor: "admin",
    time: "15 phút trước",
    type: "info",
  },
  {
    id: 3,
    action: "Unban account",
    target: "user_67890",
    actor: "admin",
    time: "1 giờ trước",
    type: "success",
  },
  {
    id: 4,
    action: "System alert",
    target: "Payment Service",
    actor: "system",
    time: "2 giờ trước",
    type: "error",
  },
  {
    id: 5,
    action: "New tenant created",
    target: "Metro Corp",
    actor: "platform_mgr",
    time: "3 giờ trước",
    type: "info",
  },
];

const systemStatus = [
  { name: "API Gateway", status: "online", latency: "12ms" },
  { name: "Database", status: "online", latency: "5ms" },
  { name: "Payment Service", status: "online", latency: "45ms" },
  { name: "Notification Service", status: "online", latency: "8ms" },
  { name: "Validator Service", status: "online", latency: "15ms" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan hệ thống và quản trị
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>Các hành động quản trị mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-secondary"
                          : activity.type === "warning"
                          ? "bg-accent"
                          : activity.type === "error"
                          ? "bg-destructive"
                          : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.target} - {activity.actor}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Trạng thái hệ thống
            </CardTitle>
            <CardDescription>Các dịch vụ đang hoạt động</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.status === "online"
                          ? "bg-secondary"
                          : service.status === "degraded"
                          ? "bg-accent"
                          : "bg-destructive"
                      }`}
                    />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {service.latency}
                    </span>
                    <span
                      className={`text-xs font-medium capitalize ${
                        service.status === "online"
                          ? "text-secondary"
                          : service.status === "degraded"
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
