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
    <ol className="flex flex-col sm:flex-row justify-between items-center w-full space-y-6 sm:space-y-0 sm:space-x-0 mb-6">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <li key={index} className="flex-1 flex items-center">
            <div className="flex items-center w-full relative">
              {/* Line (except first item) */}
              {index > 0 && (
                <div
                  className={`flex-grow h-1 ${
                    isCompleted ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Circle + Content */}
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-blue-600 bg-blue-100 text-blue-600"
                      : isCompleted
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-500 bg-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="hidden sm:block">
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

              {/* Line (for the current item except last) */}
              {index < steps.length - 1 && (
                <div className="flex-grow h-1 bg-gray-300 ml-2 hidden sm:block"></div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default StepRegister;
