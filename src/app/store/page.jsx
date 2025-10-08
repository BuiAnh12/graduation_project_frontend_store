"use client";
import Header from "@/components/Header";
import {
  getInformation,
  toggleOpenStatus,
  updateInfo,
  updateAddress,
  updateHours,
  updateImages,
  updatePaperwork,
} from "@/service/storeInfo";
import { getAllSystemCategories } from "@/service/systemCategory";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StoreTime from "@/components/store/StoreTime";
import StoreInfo from "@/components/store/StoreInfo";
import StoreImages from "@/components/store/StoreImage";
import { uploadImages } from "@/service/upload";
import StorePaperwork from "@/components/store/StorePaperwork";
import StoreAddress from "@/components/store/StoreAddress";
import localStorageService from "@/utils/localStorageService";

const page = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const storeId = localStorageService.getStoreId();

  const fetchStore = async () => {
    const res = await getInformation(storeId);
    if (res.success) {
      setStoreInfo(res.data); // set toàn bộ object vào luôn
    } else {
      console.error("Lỗi khi lấy thông tin cửa hàng:", res.message);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllSystemCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Không thể tải danh mục cửa hàng:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle toggle
  const handleToggleOpenStatus = async () => {
    try {
      const res = await toggleOpenStatus(storeId);
      console.log("RES toggle ", res);
      if (res && res.success) {
        setStoreInfo((prev) => ({
          ...prev,
          openStatus: res.data,
        }));
      } else {
        toast.error("Lỗi khi chuyển trạng thái");
      }
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái mở cửa:", error.message);
    }
  };

  const handleUpdateTime = async (data) => {
    try {
      const res = await updateHours(data);
      console.log(res);
      if (res && res.success === true) {
        // Gọi lại API để lấy dữ liệu mới
        await fetchStore();
        toast.success("Cập nhật giờ thành công");
      } else {
        toast.error("Lỗi khi cập nhật giờ hoạt động");
      }
    } catch (error) {
      toast.error("Không thể cập nhật giờ:", error.message);
    }
  };

  const handleUpdateInfo = async (data) => {
    try {
      const res = await updateInfo(storeId, data); // gọi API update
      if (res && res.success === true) {
        await fetchStore();
        toast.success("Cập nhật thông tin cửa hàng thành công");
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật:", err.message);
    }
  };

  const handleUpdateImages = async (data) => {
    try {
      // Giữ nguyên ảnh cũ nếu không upload mới
      let avatarImage = data.originalAvatarUrl;
      let coverImage = data.originalCoverUrl;

      // Upload avatar nếu có
      if (data.avatar) {
        const res = await uploadImages(data.avatar); // gọi API upload
        console.log("resImg ", res);
        if (res._id) {
          avatarImage = res._id;
        } else {
          throw new Error(
            "Upload avatar failed: " + (res?.message || "Unknown error")
          );
        }
      }

      // Upload cover nếu có
      if (data.cover) {
        const res = await uploadImages(data.cover);

        if (res._id) {
          coverImage = res._id;
        } else {
          throw new Error(
            "Upload cover failed: " + (res?.message || "Unknown error")
          );
        }
      }

      // Cập nhật store với avatarUrl và coverUrl mới
      const updateRes = await updateImages(storeId, {
        avatarImage,
        coverImage,
      });

      if (updateRes?.success) {
        await fetchStore(); // làm mới dữ liệu hiển thị
        toast.success("Cập nhật thông tin cửa hàng thành công");
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      toast.error("Lỗi khi cập nhật: " + err.message);
    }
  };

  const handleUpdatePaperwork = async (data) => {
    try {
      // Giữ nguyên ảnh cũ nếu không upload mới
      let ICFrontImage;
      let ICBackImage;
      let BusinessLicenseImage;

      if (data.ICFront) {
        const res = await uploadImages(data.ICFront); // gọi API upload
        if (res._id) {
          ICFrontImage = res._id;
        } else {
          throw new Error(
            "Upload IC Front failed: " + (res?.message || "Unknown error")
          );
        }
      }

      if (data.ICBack) {
        const res = await uploadImages(data.ICBack); // gọi API upload
        if (res._id) {
          ICBackImage = res._id;
        } else {
          throw new Error(
            "Upload IC Back failed: " + (res?.message || "Unknown error")
          );
        }
      }

      if (data.BusinessLicense) {
        const res = await uploadImages(data.BusinessLicense); // gọi API upload
        if (res._id) {
          BusinessLicenseImage = res._id;
        } else {
          throw new Error(
            "Upload Business License failed: " +
              (res?.message || "Unknown error")
          );
        }
      }

      // Upload cover nếu có
      if (data.cover) {
        const res = await uploadImages(data.cover);

        if (res._id) {
          coverImage = res._id;
        } else {
          throw new Error(
            "Upload cover failed: " + (res?.message || "Unknown error")
          );
        }
      }

      // Cập nhật store với avatarUrl và coverUrl mới
      const updateRes = await updatePaperwork(storeId, {
        ICFrontImage,
        ICBackImage,
        BusinessLicenseImage,
      });

      if (updateRes?.success) {
        await fetchStore(); // làm mới dữ liệu hiển thị
        toast.success("Cập nhật thông tin cửa hàng thành công");
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      toast.error("Lỗi khi cập nhật: " + err.message);
    }
  };

  const handleUpdateAddress = async (data) => {
    try {
      const res = await updateAddress(storeId ,data);
      console.log(res);
      if (res && res.success === true) {
        // Gọi lại API để lấy dữ liệu mới
        await fetchStore();
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        toast.error("Lỗi khi cập nhật địa chỉ");
      }
    } catch (error) {
      toast.error("Không thể cập nhật địa chỉ:", error.message);
    }
  };

  return (
    <>
      <Header title="Thông tin cửa hàng" goBack={true} />
      <div className="pt-[70px] pb-[10px] bg-gray-100 px-[100px]">
        {storeInfo && (
          <div className="space-y-6">
            {/* Giờ hoạt động cửa hàng */}
            <StoreTime
              openHour={storeInfo.openHour}
              closeHour={storeInfo.closeHour}
              openStatus={storeInfo.openStatus}
              onToggle={handleToggleOpenStatus}
              onUpdateTime={handleUpdateTime}
            />

            {/* Thông tin cửa hàng */}
            <StoreInfo
              storeInfo={storeInfo}
              categories={categories}
              onUpdateInfo={handleUpdateInfo}
            />

            {/* Ảnh cửa hàng */}
            <StoreImages
              avatarUrl={storeInfo.avatarImage?.url}
              coverUrl={storeInfo.coverImage?.url}
              onUpdateImages={handleUpdateImages}
            />

            {/* Địa chỉ cửa hàng */}
            <StoreAddress
              address_full={storeInfo.address_full}
              location={storeInfo.location}
              onUpdateAddress={handleUpdateAddress}
            />

            {/* Giấy tờ */}
            <StorePaperwork
              ICFrontUrl={storeInfo.ICFrontImage?.url}
              ICBackUrl={storeInfo.ICBackImage?.url}
              BusinessLicenseUrl={storeInfo.BusinessLicenseImage?.url}
              onUpdatePaperwork={handleUpdatePaperwork}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default page;
