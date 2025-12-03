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
    <div className="w-full min-h-screen bg-gradient-to-r from-[#ff8743] to-[#f38d52] px-4 pt-4">
      {/* Step Progress */}
      <div className="lg:block hidden">
        <StepRegister currentStep={currentStep} />
      </div>
      {steps[currentStep]}
    </div>
  );
};

export default RegisterPage;
