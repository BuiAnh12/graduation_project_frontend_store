import React from "react";

const steps = [
  { title: "Tạo tài khoản", description: "Tài khoản chủ cửa hàng" },
  { title: "Thông tin cửa hàng", description: "Thông tin cơ bản" },
  { title: "Địa chỉ", description: "Vị trí cửa hàng" },
  { title: "Hồ sơ", description: "Giấy tờ pháp lý & một số ảnh" },
  { title: "Xác nhận", description: "Hoàn tất đăng ký cửa hàng" },
];

const StepRegister = ({ currentStep = 0 }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
      <h1 className="text-center text-lg font-bold mb-6">Đăng ký cửa hàng</h1>

      <ol className="flex flex-col sm:flex-row justify-between items-center w-full space-y-6 sm:space-y-0">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <li
              key={index}
              className="relative flex-1 flex items-center justify-center"
            >
              {/* Line trái */}
              {index > 0 && (
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 hidden sm:block h-1 w-1/2 
                ${isCompleted ? "bg-blue-600" : "bg-gray-300"}`}
                />
              )}

              {/* Circle */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${
                  isActive
                    ? "border-blue-600 bg-blue-100 text-blue-600"
                    : isCompleted
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
                >
                  {index + 1}
                </div>

                {/* Text */}
                <div className="hidden sm:block mt-2">
                  <div
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Line phải */}
              {index < steps.length - 1 && (
                <span
                  className={`absolute right-0 top-1/2 -translate-y-1/2 hidden sm:block h-1 w-1/2 
                ${index < currentStep ? "bg-blue-600" : "bg-gray-300"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StepRegister;
