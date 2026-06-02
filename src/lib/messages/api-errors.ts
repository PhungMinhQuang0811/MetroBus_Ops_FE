import { ApiError } from "@/lib/api"

export const API_ERROR_MESSAGES: Record<number, string> = {
  1000: "Thành công",


  2000: "Vui lòng nhập đầy đủ thông tin bắt buộc",
  2001: "Email không đúng định dạng",
  2002: "Mật khẩu phải có ít nhất 9 ký tự và bao gồm cả chữ lẫn số",
  2003: "Vai trò được chọn không hợp lệ",
  2004: "Số điện thoại không đúng định dạng",


  3000: "Thông tin đăng nhập không chính xác. Vui lòng thử lại.",
  3001: "Email không tồn tại. Vui lòng kiểm tra lại.",
  3002: "Tên đăng nhập hoặc email đã tồn tại",
  3003: "Không thể vô hiệu hóa token",
  3004: "Không thể tạo token đăng nhập",
  3005: "Định dạng token không hợp lệ",
  3006: "Tài khoản này đã được xác thực trước đó",
  3007: "Không tìm thấy người dùng",
  3008: "Không thể đăng xuất. Vui lòng thử lại.",
  3009: "Không tìm thấy vai trò",
  3010: "Không tìm thấy quyền",
  3011: "Mã OTP không hợp lệ hoặc đã hết hạn",
  3012: "Không thể gửi OTP. Vui lòng thử lại.",
  3013: "OTP vừa được gửi gần đây. Vui lòng thử lại sau.",
  3014: "Bạn đã đạt giới hạn yêu cầu OTP trong ngày. Vui lòng thử lại sau.",

  
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
}

export function getApiErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return "Đã có lỗi xảy ra. Vui lòng thử lại."
  }

  return API_ERROR_MESSAGES[error.response.code] || error.response.message
}
