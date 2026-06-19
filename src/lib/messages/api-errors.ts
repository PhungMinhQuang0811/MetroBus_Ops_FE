import { ApiError } from "@/lib/api"

export const AUTH_ERROR_MESSAGES: Record<number, string> = {
  1000: "Thành công",

  2000: "Vui lòng nhập đầy đủ thông tin bắt buộc",
  2001: "Mật khẩu phải có ít nhất 9 ký tự và bao gồm cả chữ lẫn số",
  2002: "Vai trò được chọn không hợp lệ",
  2003: "Trang phải lớn hơn hoặc bằng 0 và số dòng mỗi trang phải từ 1 đến 100",
  2004: "Mã tài khoản không hợp lệ",
  2005: "Từ khóa tìm kiếm quá dài",
  2006: "Mật khẩu xác nhận không khớp",
  2007: "Mật khẩu hiện tại không chính xác",
  2008: "Tài khoản này chưa gửi yêu cầu đặt lại mật khẩu",
  2010: "Thời gian bắt đầu audit phải trước hoặc bằng thời gian kết thúc",

  3000: "Thông tin đăng nhập không chính xác. Vui lòng thử lại.",
  3002: "Username đã tồn tại",
  3003: "Không thể vô hiệu hóa token",
  3004: "Không thể tạo token đăng nhập",
  3005: "Định dạng token không hợp lệ",
  3007: "Không tìm thấy người dùng",
  3008: "Không thể đăng xuất. Vui lòng thử lại.",
  3009: "Không tìm thấy vai trò",
  3010: "Không tìm thấy quyền",
  3011: "Không thể thay đổi trạng thái tài khoản quản trị viên",
  3012: "Tài khoản đã bị vô hiệu hóa",
  3013: "Tài khoản đã được kích hoạt",
  3014: "File import không hợp lệ",
  3015: "File import có dòng dữ liệu không hợp lệ",

  4000: "Đã có lỗi hệ thống xảy ra",
  4001: "Mã lỗi hệ thống không hợp lệ",
  4002: "Bạn cần đăng nhập để tiếp tục",
  4003: "Refresh token không hợp lệ. Vui lòng thử lại.",
  4004: "Token không hợp lệ, đã hết hạn hoặc đã được sử dụng",
  4005: "Email chưa được xác thực. Vui lòng kiểm tra hộp thư.",
  4006: "Tài khoản đang bị vô hiệu hóa hoặc không hoạt động",
  4007: "Bạn không có quyền truy cập tài nguyên này",
  4008: "Token đã hết hạn hoặc không hợp lệ",
  4009: "CSRF token bị thiếu hoặc không hợp lệ",
  4010: "Tài khoản của bạn cần quản trị viên đặt lại mật khẩu.",
  4011: "Bạn phải đổi mật khẩu trước khi sử dụng tài khoản này.",
}

export const OPS_ERROR_MESSAGES: Record<number, string> = {
  1000: "Thành công",

  2000: "Vui lòng nhập đầy đủ thông tin bắt buộc",
  2001: "Trang phải lớn hơn hoặc bằng 0 và số dòng mỗi trang phải từ 1 đến 100",
  2002: "Từ khóa tìm kiếm quá dài",
  2003: "Mã operator không hợp lệ",
  2004: "Mã tuyến không hợp lệ",
  2005: "Loại hình vận tải không hợp lệ",
  2006: "Trạng thái master data không hợp lệ",
  2007: "Tên tuyến không được vượt quá 255 ký tự",
  2008: "Mã ga/trạm không hợp lệ",
  2009: "Tên ga/trạm không được vượt quá 255 ký tự",
  2010: "Thứ tự ga/trạm phải lớn hơn hoặc bằng 1",
  2014: "Loại thiết bị không hợp lệ",
  2020: "Thời gian bắt đầu lô dữ liệu phải trước hoặc bằng thời gian kết thúc",
  2022: "Loại gói cấu hình không hợp lệ",
  2025: "Payload cấu hình không hợp lệ",
  2026: "Danh sách ga/trạm phát hành không hợp lệ",
  2027: "Mã trạng thái đồng bộ không hợp lệ",
  2028: "Trạng thái áp dụng không hợp lệ",
  2029: "Version cấu hình không hợp lệ",
  2030: "Thời gian bắt đầu dashboard phải trước hoặc bằng thời gian kết thúc",
  2031: "Bucket dashboard không hợp lệ",
  2032: "Thời gian bắt đầu audit phải trước hoặc bằng thời gian kết thúc",

  3000: "Mã tuyến đã tồn tại trong operator",
  3001: "Tuyến đang hoạt động",
  3002: "Tuyến đã bị vô hiệu hóa",
  3003: "Không tìm thấy operator",
  3004: "Không tìm thấy tuyến",
  3005: "Không tìm thấy ga/trạm",
  3006: "Mã ga/trạm đã tồn tại trong tuyến",
  3007: "Thứ tự ga/trạm đã tồn tại trong tuyến",
  3008: "Ga/trạm đang hoạt động",
  3009: "Ga/trạm đã bị vô hiệu hóa",
  3014: "File import không hợp lệ",
  3015: "File import có dòng dữ liệu không hợp lệ",
  3025: "Không có giao dịch chờ xử lý nào trong khoảng thời gian đã chọn",
  3028: "Không tìm thấy gói cấu hình",
  3029: "Gói cấu hình không còn có thể chỉnh sửa",
  3030: "Gói cấu hình không thể phát hành lại",
  3031: "Không tìm thấy trạng thái đồng bộ cấu hình",
  3032: "Không tìm thấy payload của gói cấu hình",
  3033: "Khoảng thời gian dashboard quá rộng. Vui lòng thu hẹp bộ lọc",

  4000: "Đã có lỗi hệ thống xảy ra",
  4002: "Bạn cần đăng nhập để tiếp tục",
  4006: "Tài khoản đang bị vô hiệu hóa hoặc không hoạt động",
  4007: "Bạn không có quyền truy cập tài nguyên này",
  4009: "CSRF token bị thiếu hoặc không hợp lệ",
  4012: "Tài khoản chưa có phạm vi operator hợp lệ",
  4013: "Bạn không có quyền truy cập dữ liệu của operator khác",
}

export const API_ERROR_MESSAGES = AUTH_ERROR_MESSAGES

const BACKEND_ERROR_MESSAGE_TRANSLATIONS: Record<string, string> = {
  "{fieldName} is required": "Vui lòng nhập đầy đủ thông tin bắt buộc",
  "Password must be at least 9 characters and contain both letters and numbers": "Mật khẩu phải có ít nhất 9 ký tự và bao gồm cả chữ lẫn số",
  "Invalid operator role selection": "Vai trò được chọn không hợp lệ",
  "Page must be >= 0 and size must be between 1 and 100": "Trang phải lớn hơn hoặc bằng 0 và số dòng mỗi trang phải từ 1 đến 100",
  "Operator id is invalid": "Mã operator không hợp lệ",
  "Account id is invalid": "Mã tài khoản không hợp lệ",
  "Search keyword is too long": "Từ khóa tìm kiếm quá dài",
  "New password and confirm password do not match": "Mật khẩu xác nhận không khớp",
  "Current password is incorrect": "Mật khẩu hiện tại không chính xác",
  "Password reset has not been requested for this account": "Tài khoản này chưa gửi yêu cầu đặt lại mật khẩu",
  "Invalid password status": "Trạng thái mật khẩu không hợp lệ",
  "Route code already exists in operator": "Mã tuyến đã tồn tại trong operator",
  "Invalid transport type": "Loại hình vận tải không hợp lệ",
  "Invalid master data status": "Trạng thái master data không hợp lệ",
  "Route name must not exceed 255 characters": "Tên tuyến không được vượt quá 255 ký tự",
  "Route id is invalid": "Mã tuyến không hợp lệ",
  "Station id is invalid": "Mã ga/trạm không hợp lệ",
  "Operator scope is required": "Tài khoản chưa có phạm vi operator hợp lệ",
  "You do not have permission to access data from another operator": "Bạn không có quyền truy cập dữ liệu của operator khác",
  "Route is already active": "Tuyến đang hoạt động",
  "Route is already disabled": "Tuyến đã bị vô hiệu hóa",
  "Station is already active": "Ga/trạm đang hoạt động",
  "Station is already disabled": "Ga/trạm đã bị vô hiệu hóa",
  "Operator not found": "Không tìm thấy operator",
  "Route not found": "Không tìm thấy tuyến",
  "Station not found": "Không tìm thấy ga/trạm",
  "Station code already exists in route": "Mã ga/trạm đã tồn tại trong tuyến",
  "Station order already exists": "Thứ tự ga/trạm đã tồn tại trong tuyến",
  "Station order already existed": "Thứ tự ga/trạm đã tồn tại trong tuyến",
  "Station order exists in route": "Thứ tự ga/trạm đã tồn tại trong tuyến",
  "Station order existed": "Thứ tự ga/trạm đã tồn tại trong tuyến",
  "Station name must not exceed 255 characters": "Tên ga/trạm không được vượt quá 255 ký tự",
  "Station name is required": "Tên ga/trạm là bắt buộc",
  "Station order is required": "Thứ tự ga/trạm là bắt buộc",
  "Station order must be greater than or equal to 1": "Thứ tự ga/trạm phải lớn hơn hoặc bằng 1",
  "Route code is required": "Mã tuyến là bắt buộc",
  "Route code not found": "Không tìm thấy tuyến",
  "Route name is required": "Tên tuyến là bắt buộc",
  "Request body is invalid": "Dữ liệu gửi lên không hợp lệ",
  "Username or password is incorrect": "Thông tin đăng nhập không chính xác. Vui lòng thử lại.",
  "Username already exists": "Username đã tồn tại",
  "Failed to blacklist token": "Không thể vô hiệu hóa token",
  "Failed to generate token": "Không thể tạo token đăng nhập",
  "Invalid token format": "Định dạng token không hợp lệ",
  "User not found": "Không tìm thấy người dùng",
  "Failed to log out. Please try again.": "Không thể đăng xuất. Vui lòng thử lại.",
  "Role not found": "Không tìm thấy vai trò",
  "Permission not found": "Không tìm thấy quyền",
  "Operator admin account status cannot be changed": "Không thể thay đổi trạng thái tài khoản quản trị viên",
  "Account is already disabled": "Tài khoản đã bị vô hiệu hóa",
  "Account is already enabled": "Tài khoản đã được kích hoạt",
  "Import file is invalid": "File import không hợp lệ",
  "Import file contains invalid rows": "File import có dòng dữ liệu không hợp lệ",
  "Uncategorized error": "Đã có lỗi hệ thống xảy ra",
  "There was error happen during run time": "Đã có lỗi hệ thống xảy ra",
  "The error key could be misspelled": "Mã lỗi hệ thống không hợp lệ",
  "Unauthenticated access": "Bạn cần đăng nhập để tiếp tục",
  "Invalid refresh token. Please try again.": "Refresh token không hợp lệ. Vui lòng thử lại.",
  "The token is invalid or this link has expired or has been used.": "Token không hợp lệ, đã hết hạn hoặc đã được sử dụng",
  "Your account is currently disabled or inactive.": "Tài khoản đang bị vô hiệu hóa hoặc không hoạt động",
  "You do not have permission to access this resource": "Bạn không có quyền truy cập tài nguyên này",
  "Token is already expired or invalid": "Token đã hết hạn hoặc không hợp lệ",
  "Missing or invalid CSRF token": "CSRF token bị thiếu hoặc không hợp lệ",
  "Your account requires an administrator to reset the password.": "Tài khoản của bạn cần quản trị viên đặt lại mật khẩu.",
  "You must change your password before using this account.": "Bạn phải đổi mật khẩu trước khi sử dụng tài khoản này.",
  "fromTime is required": "Thời gian bắt đầu là bắt buộc",
  "toTime is required": "Thời gian kết thúc là bắt buộc",
  "from is required": "Thời gian bắt đầu là bắt buộc",
  "to is required": "Thời gian kết thúc là bắt buộc",
  "Batch from time must be before or equal to to time": "Thời gian bắt đầu lô dữ liệu phải trước hoặc bằng thời gian kết thúc",
  "No eligible transactions found for the selected time range": "Không có giao dịch chờ xử lý nào trong khoảng thời gian đã chọn",
  "Invalid control package type": "Loại gói cấu hình không hợp lệ",
  "Invalid control package payload": "Payload cấu hình không hợp lệ",
  "Invalid device type": "Loại thiết bị không hợp lệ",
  "Invalid station list": "Danh sách ga/trạm phát hành không hợp lệ",
  "Invalid control sync id": "Mã trạng thái đồng bộ không hợp lệ",
  "Invalid control sync status": "Trạng thái áp dụng không hợp lệ",
  "Invalid control package version": "Version cấu hình không hợp lệ",
  "Dashboard from time must be before or equal to to time": "Thời gian bắt đầu dashboard phải trước hoặc bằng thời gian kết thúc",
  "Invalid dashboard bucket": "Bucket dashboard không hợp lệ",
  "Dashboard query range is too wide": "Khoảng thời gian dashboard quá rộng. Vui lòng thu hẹp bộ lọc",
  "Audit from time must be before or equal to to time": "Thời gian bắt đầu audit phải trước hoặc bằng thời gian kết thúc",
  "Audit query range is too wide": "Khoảng thời gian audit quá rộng. Vui lòng thu hẹp bộ lọc",
  "Control package not found": "Không tìm thấy gói cấu hình",
  "Control package is not editable": "Gói cấu hình không còn có thể chỉnh sửa",
  "Control package already published": "Gói cấu hình không thể phát hành lại",
  "Control package sync not found": "Không tìm thấy trạng thái đồng bộ cấu hình",
  "Control package payload not found": "Không tìm thấy payload của gói cấu hình",
}

export function getApiErrorMessageFromBackendMessage(message: string) {
  return BACKEND_ERROR_MESSAGE_TRANSLATIONS[message] || message
}

function getFallbackErrorMessage(error: ApiError) {
  if (error.service === "ops") return OPS_ERROR_MESSAGES[error.response.code]
  if (error.service === "auth") return AUTH_ERROR_MESSAGES[error.response.code]

  if (error.status === 400) return "Dữ liệu gửi lên không hợp lệ"
  if (error.status === 401) return "Bạn cần đăng nhập để tiếp tục"
  if (error.status === 403) return "Bạn không có quyền thực hiện thao tác này"
  if (error.status === 404) return "Không tìm thấy dữ liệu phù hợp"
  if (error.status >= 500) return "Đã có lỗi hệ thống xảy ra"

  return undefined
}

export function getApiErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return "Đã có lỗi xảy ra. Vui lòng thử lại."
  }

  return BACKEND_ERROR_MESSAGE_TRANSLATIONS[error.response.message] || getFallbackErrorMessage(error) || "Đã có lỗi xảy ra. Vui lòng thử lại."
}
