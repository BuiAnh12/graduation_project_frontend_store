"use client";
import React, { useEffect, useState } from "react";
import StepRegister from "@/components/fragments/StepRegister";
import Step1OwnerAccount from "@/components/registers/Step1OwnerAccount";
import Step2BasicStoreInfo from "@/components/registers/Step2BasicStoreInfo";
import Step3StoreAddress from "@/components/registers/Step3StoreAddress";
import Step4Paperwork from "@/components/registers/Step4Paperwork";
import Step5Confirm from "@/components/registers/Step5Confirm";
// import các bước tiếp theo nếu có

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [files, setFiles] = useState({
    avatarFile: null,
    coverFile: null,
    ICFrontFile: null,
    ICBackFile: null,
    BusinessLicenseFile: null,
  });

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phonenumber: "",
    password: "",
    gender: "male",
    name: "",
    description: "",
    location: { type: "Point", coordinates: [0, 0] },
    address_full: "",
    systemCategoryId: [],
    avatarImage: "",
    coverImage: "",
    openHour: "",
    closeHour: "",
    ICFrontImage: "",
    ICBackImage: "",
    BusinessLicenseImage: "",
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const steps = {
    1: (
      <Step1OwnerAccount
        data={formData}
        setData={setFormData}
        nextStep={nextStep}
      />
    ),
    2: (
      <Step2BasicStoreInfo
        data={formData}
        setData={setFormData}
        files={files}
        setFiles={setFiles}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    ),
    3: (
      <Step3StoreAddress
        data={formData}
        setData={setFormData}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    ),
    4: (
      <Step4Paperwork
        files={files}
        setFiles={setFiles}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    ),
    5: (
      <Step5Confirm
        data={formData}
        setData={setFormData}
        files={files}
        setFiles={setFiles}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    ),
  };

  useEffect(() => {
    console.log("📝 formData cập nhật:", formData);
    console.log("📝 files cập nhật:", files);
  }, [formData, files]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-200 px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">
        Đăng ký cửa hàng
      </h1>

      {/* Step Progress */}
      <StepRegister currentStep={currentStep} />

      {/* Form Step */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        {steps[currentStep]}
      </div>
    </div>
  );
};

export default RegisterPage;
