export const ERROR_MESSAGES_VI = {
  // Common
  INTERNAL_SERVER_ERROR: "Đã xảy ra lỗi, vui lòng thử lại sau.",
  INVALID_KEY: "Khóa không hợp lệ.",
  INVALID_REQUEST: "Yêu cầu không hợp lệ.",

  MISSING_REQUIRED_FIELDS: "Thiếu các trường bắt buộc",
  EMAIL_EXISTS: "Email đã tồn tại",
  VALIDATION_ERROR: "Kiểm tra dữ liệu không hợp lệ",
  ACCOUNT_NOT_FOUND: "Không tìm thấy tài khoản",
  ACCOUNT_ALREADY_EXISTED: "Tài khoản đã tồn tại",
  ACCOUNT_BLOCKED: "Tài khoản bị khóa",
  ACCESS_TOKEN_NOT_FOUND: "Không tìm thấy refresh token trong cookie",
  ACCESS_TOKEN_EXPIRED: "Token đã hết hạn, vui lòng đăng nhập lại!",
  INVALID_REFRESH_TOKEN:
    "Không có refresh token trong cơ sở dữ liệu hoặc không khớp",
  REFRESH_TOKEN_EXPIRE: "Token đã hết hạn, vui lòng đăng nhập lại!",
  REFRESH_TOKEN_NOT_FOUND: "Không tìm thấy token, vui lòng đăng nhập lại!",
  ENTITY_NOT_SUPPORTED: "Thực thể đăng nhập không được hỗ trợ",
  ENTITY_NOT_FOUND: "Không tìm thấy thực thể",
  INVALID_OTP: "OTP không hợp lệ hoặc đã hết hạn",
  OTP_EXPIRED: "OTP không hợp lệ hoặc đã hết hạn",
  SHIPPER_FIRST_CHECK_REQUIRED: "Cần kiểm tra Shipper trước tiên",
  CART_NOT_FOUND: "Không tìm thấy giỏ hàng",
  CART_EMPTY: "Giỏ hàng trống",
  NOT_ENOUGH_STOCK: "Số lượng trong kho không đủ",
  VOUCHER_INVALID: "Mã giảm giá không hợp lệ hoặc đã hết hạn",
  USER_CART_MISSMATCH: "Người dùng không hợp lệ cho giỏ hàng này",
  ALREADY_IN_CART: "Người tham gia đã có trong giỏ hàng",
  NOT_PARTICIPANT: "Không phải là người tham gia của giỏ hàng",
  USER_REFERENCE_NOT_FOUND: "Không tìm thấy tham chiếu người dùng",
  USER_REFERENCE_UPDATE_FAILED: "Cập nhật tham chiếu người dùng thất bại",
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng",
  ORDER_STATUS_ALREADY_SET: "Trạng thái đơn hàng đã được thiết lập",
  INVALID_STATUS_TRANSITION: "Chuyển trạng thái đơn hàng không hợp lệ",
  ORDER_EMPTY_ITEMS: "Đơn hàng không có sản phẩm",
  ORDER_INVALID_ITEM: "Đơn hàng có sản phẩm không hợp lệ",
  ORDER_HAS_OUT_OF_STOCK: "Đơn hàng có sản phẩm đã hết hàng",
  ORDER_CANCEL_UNAUTHORIZED: "Bạn không có quyền hủy đơn hàng này",
  ORDER_CANNOT_CANCEL_STATUS:
    "Đơn hàng không thể hủy do trạng thái hiện tại không cho phép",
  INVALID_ORDER_STATUS: "Trạng thái đơn hàng không hợp lệ",
  ORDER_ALREADY_TAKEN: "Đơn hàng đã được nhận",
  UNAUTHORIZED_SHIPPER: "Shipper không hợp lệ",
  // Dish
  DISH_NOT_FOUND: "Không tìm thấy món ăn",

  // Admin
  ADMIN_NOT_FOUND: "Không tìm thấy quản trị viên",
  INVALID_CREDENTIALS: "Thông tin đăng nhập không hợp lệ",

  // Payment
  INVALID_SIGNATURE: "Chữ ký không hợp lệ",

  // User
  USER_NOT_FOUND: "Không tìm thấy người dùng",

  // Store
  STORE_NOT_FOUND: "Không tìm thấy cửa hàng",
  STORE_PENDING: "Cửa hàng đang chờ phê duyệt",
  STORE_BLOCKED: "Cửa hàng đã bị khóa",
  STORE_NOT_FOUND_FOR_USER: "Người dùng không có cửa hàng",
  INVALID_STORE_STATUS:
    "Trạng thái không hợp lệ. Phải là một trong: approved, register, blocked",
  INVALID_STATUS_TO_CHANGE: "Trạng thái không hợp lệ",
  STAFF_NOT_FOUND: "Không tìm thấy nhân viên",

  // Voucher
  VOUCHER_NOT_FOUND: "Không tìm thấy voucher",
  VOUCHER_CODE_EXISTS: "Mã voucher đã tồn tại",

  // Upload File
  NO_FILE_UPLOADED: "Chưa tải lên tệp nào",
  NO_FILES_UPLOADED: "Chưa tải lên tệp nào",
  FILE_DELETE_FAILED: "Xóa tệp thất bại",
  FILE_NOT_FOUND: "Không tìm thấy tệp",

  // Favorite
  FAVORITE_NOT_FOUND: "Không tìm thấy danh sách yêu thích",
  STORE_ALREADY_IN_FAVORITE: "Cửa hàng đã có trong danh sách yêu thích",

  // Rating
  RATING_NOT_FOUND: "Không tìm thấy đánh giá",
  ALREADY_RATED: "Bạn đã đánh giá đơn hàng này",
  INVALID_RATING_VALUE: "Giá trị đánh giá phải từ 1 đến 5",
  RATING_CONTENT_REQUIRED: "Cần có bình luận hoặc hình ảnh",
  INVALID_REPLY: "Trả lời phải là chuỗi",

  // System Category
  SYSTEM_CATEGORY_NOT_FOUND: "Loại thức ăn không tồn tại",
  SYSTEM_CATEGORY_ALREADY_EXISTS: "Loại thức ăn đã tồn tại",
  INVALID_SYSTEM_CATEGORY_NAME: "Tên loại thức ăn không hợp lệ",
  INVALID_SYSTEM_CATEGORY_IMAGE: "Ảnh loại thức ăn không hợp lệ",
  CAN_NOT_DELETE_SYSTEM_CATEGORY: "Không thể xóa danh mục này",

  // Notification
  NOTIFICATION_NOT_FOUND: "Không tìm thấy thông báo",

  // Location
  LOCATION_NOT_FOUND: "Không tìm thấy địa điểm",
  LOCATION_DUPLICATE_TYPE:
    "Bạn chỉ có thể có một địa điểm loại này (nhà hoặc công ty)",
  LOCATION_USER_REQUIRED: "Cần ID người dùng",

  // Shipping Fee
  FEE_TOO_HIGH: "Mức phí quá cao",
  DUPLICATE_FROM_DISTANCE: "Mức phí đã tồn tại",
  SHIPPING_FEE_NOT_FOUND: "Không tìm thấy mức phí",
  CANNOT_DELETE_ZERO_STEP: "Không thể xóa giá trị 0",

  // Category
  CATEGORY_NOT_FOUND: "Không tìm thấy loại này",
  INVALID_CATEGORY_NAME: "Tên không hợp lệ",
  INVALID_STORE_ID: "Không tìm thấy mã danh mục hoặc không hợp lệ",
  CATEGORY_ALREADY_EXISTS: "Tên danh mục đã tồn tại",
  CATEGORY_IN_USE: "Danh mục đang có món ăn",

  // Topping Group
  TOPPING_GROUP_NOT_FOUND: "Không tìm thấy nhóm topping này",
  INVALID_TOPPING_GROUP: "Nhóm topping không hợp lệ",
  TOPPING_GROUP_ALREADY_EXISTS: "Nhóm topping đã tồn tại",
  CAN_NOT_DELETE_TOPPING_GROUP: "Có thể còn topping trong nhóm hoặc xảy ra lỗi",
  // Topping
  TOPPING_NOT_FOUND: "Không tìm thấy topping này",
  INVALID_TOPPING: "Topping không hợp lệ",

  // AI
  AI_IMAGE_REQUIRED: "Cần có hình ảnh để dự đoán",
  AI_SERVER_CONNECTION_FAILED: "Không thể kết nối tới máy chủ AI",
  AI_PREDICTION_FAILED: "Không thể tạo dự đoán nhãn",
  AI_RECOMMENDATION_FAILED: "Không thể tạo gợi ý món ăn",
  AI_SIMILAR_DISH_FAILED: "Không thể tìm món ăn tương tự",
  AI_BEHAVIOR_TEST_FAILED: "Xử lý yêu cầu kiểm tra hành vi thất bại",

  // Tags
  COOKING_METHOD_TAG_NOT_FOUND: "Không tìm thấy tag phương pháp nấu",
  CULTURE_TAG_NOT_FOUND: "Không tìm thấy tag văn hóa",
  FOOD_TAG_NOT_FOUND: "Không tìm thấy tag món ăn",
  TASTE_TAG_NOT_FOUND: "Không tìm thấy tag vị",

  // Statistics
  INVALID_DATE_INPUT: "Đầu vào ngày không hợp lệ",
  INVALID_DATE_RANGE: "Khoảng thời gian không hợp lệ",

  // Shipper
  SHIPPER_NOT_FOUND: "Không tìm thấy shipper này",
  SHIPPER_ALREADY_BLOCKED: "Tài khoản shipper này đã bị khóa",
  SHIPPER_ALREADY_ACTIVE: "Tài khoản shipper này đã được kích hoạt",
  SHIPPER_BLOCKED_FOR_THIS_ORDER: "Shipper không thể nhận lại đơn này nữa",
  SHIPPER_BUSY: "Shipper đang có đơn",

  // Password
  CURRENT_PASSWORD_INCORRECT: "Mật khẩu cũ không chính xác",
  TAG_FETCH_FAILED: "Không thể lấy dữ liệu tag",

  // AI pretrain
  OPERATION_LOCKED: "Hoạt động đang bị khóa",
  AI_SERVICE_ERROR: "Dịch vụ AI đang gặp sự cố",
  AI_OPERATION_FAILED: "Hoạt động AI thất bại",

  // Group Cart
  CART_ALREADY_GROUP_CART: "Giỏ hàng này đã là giỏ nhóm",
  CART_REQUIRED_TO_ENABLE_GROUP: "Phải có giỏ hàng trước khi bật chế độ nhóm",
  INVALID_GROUP_CART_TOKEN: "Liên kết giỏ nhóm không hợp lệ hoặc đã hết hạn",
  GROUP_CART_EXPIRED: "Giỏ nhóm này đã hết hạn",
  GROUP_CART_NOT_ACTIVE: "Giỏ nhóm này chưa mở để tham gia",
  OWNER_CANNOT_JOIN_OWN_CART: "Bạn là chủ sở hữu giỏ hàng này",
  CART_NOT_GROUP_CART: "Hoạt động này chỉ hợp lệ với giỏ nhóm",
  CART_IS_LOCKED: "Giỏ hàng bị khóa và không thể chỉnh sửa",
  ITEM_DOES_NOT_BELONG_TO_CART: "Sản phẩm không thuộc giỏ hàng này",
  PARTICIPANT_UNAUTHORIZED_FOR_ITEM:
    "Bạn không có quyền chỉnh sửa sản phẩm này",
  NOT_OWNER_OF_CART: "Bạn không phải là chủ sở hữu giỏ hàng",
  CART_NOT_LOCKED: "Giỏ hàng hiện không bị khóa",
  OWNER_CANNOT_LEAVE_CART:
    "Chủ sở hữu không thể rời giỏ. Bạn có thể xóa giỏ thay vào đó",
  OWNER_CANNOT_REMOVE_SELF: "Chủ sở hữu không thể tự xóa bản thân khỏi giỏ",
  PARTICIPANT_NOT_FOUND: "Không tìm thấy người tham gia trong giỏ hàng",
  // Default fallback
  DEFAULT: "Đã xảy ra lỗi không xác định, vui lòng thử lại.",
};

export function getErrorMessage(errCode) {
  return ERROR_MESSAGES_VI[errCode] || ERROR_MESSAGES_VI.DEFAULT;
}
