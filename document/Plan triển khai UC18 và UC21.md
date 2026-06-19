# Plan triển khai UC18 và UC21

Tài liệu này dùng làm checklist trước khi triển khai API cho:

- UC18 - Dashboard vận hành Cấp 4
- UC21 - Audit và truy vết

Nguồn tham chiếu:

- `document/Use Case Spec AFC Cấp 3 và Cấp 4.md`
- `document/API Contract AFC Cấp 3 và Cấp 4.md`
- `document/Draft Schema auth_db và afc_ops_db.md`
- `document/wireframe_design_workspace_afc_ops.md`

## 1. Trạng thái MongoDB hiện tại

`afc-ops-service` hiện có 3 Mongo collection:

| Collection | Mục đích | Trạng thái |
| --- | --- | --- |
| `control_package_payloads` | Lưu payload chi tiết của control package | Đã có |
| `device_heartbeats` | Lưu lịch sử heartbeat thiết bị | Đã có |
| `device_incidents` | Lưu lịch sử incident thiết bị | Đã có |

## 2. Thứ tự triển khai

### Phase 1 - UC18 Dashboard vận hành Cấp 4

Triển khai trước vì không cần bổ sung Mongo collection mới.

Endpoint theo API contract:

```http
GET /dashboard/summary?from=&to=&routeId=&stationId=
GET /dashboard/transaction-timeline?from=&to=&routeId=&stationId=&bucket=hour
GET /dashboard/route-station-summaries?from=&to=&routeId=&stationId=
GET /dashboard/recent-incidents?from=&to=&routeId=&stationId=&severity=&limit=10
GET /dashboard/alerts?from=&to=&routeId=&stationId=&limit=10
```

Permission:

```text
DASHBOARD_READ
```

Actor chính:

```text
OPERATOR_MANAGER
```

### Phase 2 - UC21 Audit và truy vết

Triển khai sau UC18 vì cần bổ sung collection audit/log.

Endpoint theo API contract:

```http
GET /audit/search-audit-logs?from=&to=&accountId=&action=&resourceType=&resourceId=&page=0&size=20
GET /auth/search-audit-logs?from=&to=&accountId=&action=&page=0&size=20
```

Permission:

```text
AUDIT_READ
```

Actor chính:

```text
OPERATOR_ADMIN
```

## 3. UC18 - Data mapping theo wireframe

UC18 chỉ đọc dữ liệu, không tạo/sửa dữ liệu.

| API | Nguồn dữ liệu | Ghi chú triển khai |
| --- | --- | --- |
| `/dashboard/summary` | `afc_transactions`, `devices`, `device_incidents`, `batches`, `station_control_syncs` | Trả card tổng quan cho màn dashboard |
| `/dashboard/transaction-timeline` | `afc_transactions.occurred_at` | Group theo giờ hoặc ngày tùy độ rộng khoảng thời gian |
| `/dashboard/route-station-summaries` | `afc_transactions.route_id`, `station_id`, `decision` | Trả danh sách summary để FE vẽ bảng |
| `/dashboard/recent-incidents` | Mongo `device_incidents` | Sort `occurred_at desc`, limit nhỏ |
| `/dashboard/alerts` | Tổng hợp từ device, incident, batch, sync | Trả danh sách cảnh báo ngắn cho widget riêng |

### FE ghép màn UC18

FE có thể ghép dashboard theo 5 khối độc lập:

| Widget | API | Response |
| --- | --- | --- |
| Summary cards | `GET /dashboard/summary` | `DashboardSummaryResponse` |
| Transaction chart | `GET /dashboard/transaction-timeline` | `DashboardTransactionTimelineResponse` |
| Route/station table | `GET /dashboard/route-station-summaries` | `DashboardRouteStationSummaryResponse` |
| Recent incidents | `GET /dashboard/recent-incidents` | `DashboardRecentIncidentResponse` |
| Alerts panel | `GET /dashboard/alerts` | `DashboardAlertResponse` |

### Response fields

- `DashboardSummaryResponse`
  - `deviceSummary.active`
  - `deviceSummary.offline`
  - `deviceSummary.maintenance`
  - `deviceSummary.disabled`
  - `transactionSummary.total`
  - `transactionSummary.openGate`
  - `transactionSummary.deny`
  - `transactionSummary.acceptedForForwarding`
  - `transactionSummary.denyRate`
  - `incidentSummary.total`
  - `incidentSummary.open`
  - `incidentSummary.high`
  - `batchSummary.total`
  - `batchSummary.created`
  - `batchSummary.submitted`
  - `batchSummary.accepted`
  - `batchSummary.rejected`
  - `batchSummary.failed`
  - `controlSyncSummary.total`
  - `controlSyncSummary.pending`
  - `controlSyncSummary.applied`
  - `controlSyncSummary.failed`

- `DashboardTransactionTimelineResponse`
  - `bucket`
  - `items[].timePoint`
  - `items[].total`
  - `items[].openGate`
  - `items[].deny`
  - `items[].acceptedForForwarding`

- `DashboardRouteStationSummaryResponse`
  - `items[].routeId`
  - `items[].routeCode`
  - `items[].routeName`
  - `items[].stationId`
  - `items[].stationCode`
  - `items[].stationName`
  - `items[].total`
  - `items[].openGate`
  - `items[].deny`

- `DashboardRecentIncidentResponse`
  - `items[].incidentId`
  - `items[].occurredAt`
  - `items[].stationId`
  - `items[].stationCode`
  - `items[].deviceId`
  - `items[].deviceCode`
  - `items[].severity`
  - `items[].incidentType`
  - `items[].resolved`

- `DashboardAlertResponse`
  - `items[].type`
  - `items[].severity`
  - `items[].message`
  - `items[].resourceType`
  - `items[].resourceId`

### UC18 error mapping for FE

Các lỗi dưới đây là lỗi thật mà UC18 có thể trả về. FE nên map theo `code` thay vì chỉ nhìn HTTP status.

| Code | Error name | HTTP status | Message | Khi nào xảy ra |
| --- | --- | --- | --- | --- |
| `2001` | `INVALID_PAGE_REQUEST` | `400 Bad Request` | `Page must be >= 0 and size must be between 1 and 100` | `limit` không hợp lệ hoặc vượt range cho phép |
| `2004` | `INVALID_ROUTE_ID` | `400 Bad Request` | `Route id is invalid` | `routeId <= 0` |
| `2008` | `INVALID_STATION_ID` | `400 Bad Request` | `Station id is invalid` | `stationId <= 0` |
| `2030` | `INVALID_DASHBOARD_TIME_RANGE` | `400 Bad Request` | `Dashboard from time must be before or equal to to time` | `from > to` |
| `2031` | `INVALID_DASHBOARD_BUCKET` | `400 Bad Request` | `Invalid dashboard bucket` | `bucket` khác `hour` hoặc `day` |
| `3033` | `DASHBOARD_QUERY_TOO_WIDE` | `400 Bad Request` | `Dashboard query range is too wide` | Khoảng thời gian query vượt ngưỡng cho phép |
| `4000` | `UNCATEGORIZED_EXCEPTION` | `500 Internal Server Error` | `Uncategorized error` | Lỗi chưa được map cụ thể ở backend |
| `4002` | `UNAUTHENTICATED` | `401 Unauthorized` | `Unauthenticated access` | Chưa đăng nhập hoặc token không hợp lệ/hết hạn |
| `4006` | `ACCOUNT_DISABLED` | `403 Forbidden` | `Your account is currently disabled or inactive.` | Account đang bị disable/inactive |
| `4007` | `ACCESS_DENIED` | `403 Forbidden` | `You do not have permission to access this resource` | Không có quyền `DASHBOARD_READ` |
| `4009` | `INVALID_CSRF_TOKEN` | `403 Forbidden` | `Missing or invalid CSRF token` | Thiếu hoặc sai CSRF token |
| `4012` | `OPERATOR_SCOPE_REQUIRED` | `403 Forbidden` | `Operator scope is required` | Request cần operator scope nhưng chưa có |
| `4013` | `OPERATOR_ACCESS_DENIED` | `403 Forbidden` | `You do not have permission to access data from another operator` | Truy cập dữ liệu của operator khác không được phép |

### UC18 error handling rule for FE

- FE nên ưu tiên map theo `code` để hiển thị message đúng.
- Các lỗi `4001xx` và `4007` là lỗi phân quyền/xác thực, nên đưa user về login hoặc hiển thị no access.
- Các lỗi `2001`, `2004`, `2008`, `2030`, `2031`, `3033` là lỗi input/filter, nên giữ user ở màn hiện tại và hiển thị validation.
- `4000` là fallback server error, nên hiển thị thông báo hệ thống và cho phép retry.

### UC18 empty state không phải lỗi

- Không có dữ liệu trong khoảng chọn thì API vẫn trả `200 OK`.
- `summary` trả các count bằng `0`.
- `transaction-timeline`, `route-station-summaries`, `recent-incidents`, `alerts` trả `items: []`.
- `routeId` và `stationId` không khớp nhau hiện tại cũng trả empty result, không ném lỗi.

## 4. UC18 - Implementation checklist

- Tạo DTO response theo từng endpoint trong `dto/response/dashboard` và `dto/response/dashboard/item`, `dto/response/dashboard/summary`.
- Tạo service interface `IDashboardService`.
- Tạo service implementation aggregate dữ liệu từ JPA repositories và MongoTemplate.
- Tạo controller endpoint dưới `/dashboard`.
- Bổ sung query aggregate cho:
  - summary;
  - transaction timeline;
  - route/station summary;
  - recent incidents;
  - alerts.
- Dùng MongoTemplate query `device_incidents` cho recent incidents.
- Default filter thời gian: 24 giờ gần nhất nếu `from/to` không truyền.
- Giới hạn query quá rộng theo UC18-E02, đề xuất tối đa 31 ngày cho MVP.
- Khi không có dữ liệu, trả count bằng `0` và list rỗng.
- Bảo vệ endpoint bằng permission `DASHBOARD_READ`.
- Viết test service hoặc integration test cho các aggregate chính nếu project test setup cho phép.

## 5. UC18 - Repository/query cần bổ sung

Các repository SQL cần bổ sung query aggregate:

| Repository | Query cần có |
| --- | --- |
| `TransactionRepository` | Count theo decision, group timeline, group route/station |
| `DeviceRepository` | Count device theo status, filter route/station |
| `BatchRepository` | Count batch theo status trong khoảng thời gian |
| `StationControlSyncRepository` | Count sync theo status, filter route/station nếu cần |

Mongo:

| Collection | Query cần có |
| --- | --- |
| `device_incidents` | Count total/open/high theo `occurred_at`, filter station nếu có |
| `device_incidents` | Recent incidents sort `occurred_at desc` |

## 6. UC21 - Collection cần bổ sung

UC21 chưa triển khai ở phase 1, nhưng cần chuẩn bị schema Mongo trước khi làm API.

### Bắt buộc cho `afc-ops-service`

```text
afc_audit_logs
```

Phục vụ tab `Thao tác vận hành` và API:

```http
GET /audit/search-audit-logs
```

Field đề xuất:

```json
{
  "account_id": "uuid",
  "username": "manager01",
  "action": "CONTROL_PACKAGE_PUBLISHED",
  "module": "CONTROL_PACKAGE",
  "resource_type": "CONTROL_PACKAGE",
  "resource_id": "100",
  "resource_name": "Package version 12",
  "result": "SUCCESS",
  "ip_address": "127.0.0.1",
  "user_agent": "Mozilla/5.0",
  "request_id": "req-afc-20260604-001",
  "api_action": "publish-control-package",
  "before": {},
  "after": {},
  "metadata": {},
  "created_at": "2026-06-19T10:30:00"
}
```

Index đề xuất:

```text
(account_id, created_at)
(action, created_at)
(resource_type, resource_id, created_at)
(created_at)
```

### Nên có nếu làm đủ wireframe UC21

```text
integration_exchange_logs
```

Phục vụ tab `Tích hợp hệ thống`.

Field đề xuất:

```json
{
  "direction": "OUTBOUND",
  "target_system": "LEVEL5_SYSTEM",
  "correlation_id": "OP01-20260604-0001",
  "resource_type": "BATCH",
  "resource_id": "batch-id",
  "endpoint": "submit-batch-to-level5",
  "request_id": "req-level5-001",
  "request_summary": {},
  "response_summary": {},
  "request": {},
  "response": {},
  "status": "SUCCESS",
  "error_message": null,
  "created_at": "2026-06-19T10:30:00"
}
```

Index đề xuất:

```text
(correlation_id)
(target_system, created_at)
(status, created_at)
(created_at)
```

### Thuộc auth service hoặc auth Mongo

```text
auth_audit_logs
```

Phục vụ tab `Đăng nhập & tài khoản` và API:

```http
GET /auth/search-audit-logs
```

Với MVP, có thể ghi cả login/logout/account action vào `auth_audit_logs`, chưa cần tách `auth_login_events`.

## 7. UC21 - Implementation checklist sau UC18

- Tạo document `AfcAuditLog`.
- Tạo repository hoặc MongoTemplate query cho `afc_audit_logs`.
- Tạo DTO list/detail audit.
- Tạo endpoint search audit logs trong `afc-ops-service`.
- Ghi audit ở các thao tác quan trọng:
  - create/update route;
  - create/update station;
  - create/update device;
  - create/update/publish control package;
  - create/submit batch.
- Nếu làm tab integration, tạo document `IntegrationExchangeLog` và API search/detail tương ứng.
- Nếu scope bao gồm auth, triển khai `auth_audit_logs` trong auth service.
- Không cho update/delete audit log từ UI/API nghiệp vụ.
- Giới hạn khoảng thời gian query theo UC21-E02, đề xuất tối đa 31 ngày cho MVP.

## 8. Tiêu chí hoàn thành

### UC18 done khi

- Có các endpoint `/dashboard/summary`, `/dashboard/transaction-timeline`, `/dashboard/route-station-summaries`, `/dashboard/recent-incidents`, `/dashboard/alerts`.
- Có filter `from`, `to`, `routeId`, `stationId` và `bucket/limit` nơi phù hợp.
- Không có dữ liệu vẫn trả summary `0` và list rỗng.
- Query quá rộng bị từ chối hoặc yêu cầu thu hẹp.
- Permission `DASHBOARD_READ` được áp dụng.
- Build/test project không lỗi.

### UC21 done khi

- Có collection `afc_audit_logs`.
- Các thao tác vận hành quan trọng có ghi audit.
- Endpoint `/audit/search-audit-logs` filter được theo thời gian, account, action, resource.
- Có phân trang.
- Permission `AUDIT_READ` được áp dụng.
- Audit log không bị sửa/xóa bởi API nghiệp vụ.
- Nếu làm đủ wireframe, có thêm search/detail cho `integration_exchange_logs`.
