"use client";
import { registerStore } from "@/service/store";
import { uploadImages } from "@/service/upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
const Step5Confirm = ({
  data,
  setData,
  files,
  setFiles,
  nextStep,
  prevStep,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
    setLoading(true);
    try {
      const responseAvatar = await uploadImages(files.avatarFile);
      console.log("response avatar: ", responseAvatar);
      const responseCover = await uploadImages(files.coverFile);
      const responseICFront = await uploadImages(files.ICFrontFile);
      const responseICBack = await uploadImages(files.ICBackFile);
      const responseBusinessLicencse = await uploadImages(
        files.BusinessLicenseFile
      );

      const newData = {
        ...data,
        avatarImage: responseAvatar._id,
        coverImage: responseCover._id,
        ICFrontImage: responseICFront._id,
        ICBackImage: responseICBack._id,
        BusinessLicenseImage: responseBusinessLicencse._id,
      };

      // setData(newData);

      // 2. Format Data
      const convertedData = {
        ...newData,
        systemCategoryId: newData.systemCategoryId.map((item) => item._id),
      };

      const res = await registerStore(convertedData);
      if (res.success) {
        toast.success("Thành công");
        router.push("/auth/login");
        return;
      }
    } catch (error) {
      if (error.data.errorCode && error.data.errorCode === "EMAIL_EXISTS") {
        toast.error("Email đã tồn tại");
      } else if (error.data.errorCode) {
        toast.error("Lỗi tạo cửa hàng: ", error.data.errorCode);
      } else {
        toast.error("Lỗi tạo cửa hàng: ", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Thông tin cửa hàng
      </h2>

      {/* Chủ cửa hàng */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black mb-3">
          Xác nhận thông tin
        </h3>
        <div className="text-gray-700 flex flex-col gap-2 p-4">
          <div className="flex justify-between">
            <p className="flex-1">
              <strong>Họ tên:</strong> {data.ownerName}
            </p>
            <p className="flex-1">
              <strong>Email:</strong> {data.email}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="flex-1">
              <strong>Số điện thoại:</strong> {data.phonenumber}
            </p>
            <p className="flex-1">
              <strong>Giới tính:</strong>{" "}
              {data.gender === "male"
                ? "Nam"
                : data.gender === "female"
                ? "Nữ"
                : "Khác"}
            </p>
          </div>
        </div>
      </div>

      {/* Cửa hàng */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black mb-3">
          Xác nhận thông tin
        </h3>
        <div className="text-gray-700 flex flex-col gap-2 p-4">
          <p>
            <strong>Tên cửa hàng:</strong> {data.name}
          </p>
          <p>
            <strong>Danh mục:</strong>{" "}
            {data.systemCategoryId.map((cat) => cat.name).join(", ")}
          </p>
          <p>
            <strong>Mô tả:</strong> {data.description}
          </p>
        </div>

        <div className="flex gap-4 px-4">
          {files.avatarFile && (
            <div>
              <p className="text-gray-600">
                <strong>Ảnh đại diện</strong>
              </p>
              <img
                src={URL.createObjectURL(files.avatarFile)}
                alt="avatar"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
          {files.coverFile && (
            <div>
              <p className="text-gray-600">
                <strong>Ảnh bìa</strong>
              </p>
              <img
                src={URL.createObjectURL(files.coverFile)}
                alt="cover"
                className="w-max h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Địa chỉ */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black mb-3">Địa chỉ cửa hàng</h3>
        <div className="text-gray-700 flex flex-col gap-2 p-4">
          <p>
            <strong>Địa chỉ đầy đủ:</strong> {data.address_full}
          </p>
          <div className="flex justify-between gap-2">
            <p className="flex-1">
              <strong>Vĩ độ:</strong> {data.location.coordinates[0]}
            </p>
            <p className="flex-1">
              <strong>Kinh độ:</strong> {data.location.coordinates[1]}
            </p>
          </div>
        </div>
      </div>

      {/* Giấy tờ */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-black mb-3">Giấy tờ</h3>
        <div className="text-gray-700 flex flex-col gap-2 p-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-4">
              {files.ICFrontFile && (
                <div>
                  <p className="text-gray-600">
                    <strong>Căn cước công dân mặt trước</strong>
                  </p>
                  <img
                    src={URL.createObjectURL(files.ICFrontFile)}
                    alt="IC Front"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
              {files.ICBackFile && (
                <div>
                  <p className="text-gray-600">
                    <strong>Căn cước công dân mặt sau</strong>
                  </p>
                  <img
                    src={URL.createObjectURL(files.ICBackFile)}
                    alt="IC Back"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            {files.BusinessLicenseFile && (
              <div>
                <p className="text-gray-600">
                  <strong>Giấy phép kinh doanh</strong>
                </p>
                <img
                  src={URL.createObjectURL(files.BusinessLicenseFile)}
                  alt="Business License"
                  className="w-30 h-50 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Quay lại
        </button>
        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Gửi đăng ký
        </button>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <ClipLoader
            visible={true}
            height="80"
            width="80"
            color="#fc6011"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      )}
    </div>
  );
};

export default Step5Confirm;
