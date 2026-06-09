import { ApiError } from "@/lib/api"

export const API_ERROR_MESSAGES: Record<number, string> = {
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

const BACKEND_ERROR_MESSAGE_TRANSLATIONS: Record<string, string> = {
  "{fieldName} is required": "Vui lòng nhập đầy đủ thông tin bắt buộc",
  "Password must be at least 9 characters and contain both letters and numbers": "Mật khẩu phải có ít nhất 9 ký tự và bao gồm cả chữ lẫn số",
  "Invalid operator role selection": "Vai trò được chọn không hợp lệ",
  "Page must be >= 0 and size must be between 1 and 100": "Trang phải lớn hơn hoặc bằng 0 và số dòng mỗi trang phải từ 1 đến 100",
  "Account id is invalid": "Mã tài khoản không hợp lệ",
  "Search keyword is too long": "Từ khóa tìm kiếm quá dài",
  "New password and confirm password do not match": "Mật khẩu xác nhận không khớp",
  "Current password is incorrect": "Mật khẩu hiện tại không chính xác",
  "Password reset has not been requested for this account": "Tài khoản này chưa gửi yêu cầu đặt lại mật khẩu",
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
}

export function getApiErrorMessageFromBackendMessage(message: string) {
  return BACKEND_ERROR_MESSAGE_TRANSLATIONS[message] || message
}

export function getApiErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return "Đã có lỗi xảy ra. Vui lòng thử lại."
  }

  return API_ERROR_MESSAGES[error.response.code] || getApiErrorMessageFromBackendMessage(error.response.message) || "Đã có lỗi xảy ra. Vui lòng thử lại."
}
