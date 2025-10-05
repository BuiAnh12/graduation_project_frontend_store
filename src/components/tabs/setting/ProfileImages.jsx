"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useUploadImagesMutation, useDeleteFileMutation } from "../../../redux/features/upload/uploadApi";
import { useUpdateStoreInformationMutation } from "../../../redux/features/store/storeApi";

const ProfileImages = ({ store }) => {
  const [avatarPreview, setAvatarPreview] = useState(store?.avatar?.url || "/assets/shop_logo.png");
  const [coverPreview, setCoverPreview] = useState(store?.cover?.url || "/assets/default_cover.jpg");
  const [uploadImages] = useUploadImagesMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [updateStoreInformation] = useUpdateStoreInformationMutation();

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Delete old image first
      if (store[type]?.url) await deleteFile(store[type].url);

      // Upload new image
      const uploadResponse = await uploadImages(formData).unwrap();
      const newImage = {
        filePath: uploadResponse[0].filePath,
        url: uploadResponse[0].url,
      };

      // Update store data
      await updateStoreInformation({ storeId: store._id, updates: { [type]: newImage } });

      // Set preview
      type === "avatar" ? setAvatarPreview(newImage.url) : setCoverPreview(newImage.url);
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold">Ảnh đại diện</h3>
        <Image src={avatarPreview} alt="Avatar" width={100} height={100} className="rounded-full border" />
        <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, "avatar")} />
        <label htmlFor="avatarUpload" className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md">Thay đổi ảnh</label>
      </div>

      {/* Cover Image Section */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold">Ảnh bìa</h3>
        <div className="relative w-full h-48">
          <Image src={coverPreview} alt="Cover" layout="fill" objectFit="cover" className="rounded-lg border" />
        </div>
        <input type="file" id="coverUpload" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, "cover")} />
        <label htmlFor="coverUpload" className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md">Thay đổi ảnh</label>
      </div>
    </div>
  );
};

export default ProfileImages;
