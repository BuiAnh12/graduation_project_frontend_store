"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { loginUser, getOwneStore, logoutUser } from "@/service/auth";
import localStorageService from "@/utils/localStorageService";

const Page = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Email không hợp lệ!")
      .required("Vui lòng nhập Email!"),
    password: yup.string().required("Vui lòng nhập mật khẩu!"),
  });

  const checkStoreStatus = async () => {
    try {
      const storerResult = await getOwneStore();
      console.log("Store result:", storerResult);
      const storeData = storerResult.data;

      console.log("Store data:", storeData);
      if (storeData.status == "APPROVED") {
        return "APPROVED";
      } else if (storeData.status == "PENDING") {
        return "PENDING";
      } else if (storeData.status == "BLOCKED") {
        return "BLOCKED";
      }
      if (!storerResult.data || !storerResult.success) {
        if (storerResult.message == "No store found for this user") {
          return "NOT_REGISTERED";
        }
        toast.error(storerResult.message || "Lỗi khi lấy thông tin cửa hàng!");
        return "NONE";
      }
    } catch (err) {
      console.error("Error checking store status:", err);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkStoreStatus();
      switch (status) {
        case "APPROVED":
          router.push("/home");
          break;
        case "PENDING":
          router.push("/auth/verification-pending");
          break;
        case "BLOCKED":
          router.push("/auth/blocked");
          break;
        case "NOT_REGISTERED":
          localStorageService.clearAll();
          await logoutUser();
          router.push("/auth/register");
          break;
        case "NONE":
          // No action (let user login)
          break;
        default:
          break;
      }
    };
    checkStatus();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const loginResult = await loginUser(values);
        if (!loginResult.success) {
          toast.error(loginResult.message || "Đăng nhập thất bại!");
          return;
        }

        const status = await checkStoreStatus();
        switch (status) {
          case "APPROVED":
            toast.success("Đăng nhập thành công!");
            router.push("/home");
            break;
          case "PENDING":
            toast.success("Đăng nhập thành công!");
            router.push("/auth/verification-pending");
            break;
          case "BLOCKED":
            toast.success("Đăng nhập thành công!");
            router.push("/auth/blocked");
            break;
          case "NOT_REGISTERED":
            toast.error("Bạn chưa đăng ký cửa hàng!");
            localStorageService.clearAll();
            await logoutUser();
            router.push("/auth/register");
            break;
          default:
            break;
        }
      } catch (err) {
        toast.error("Đăng nhập thất bại!");
      }
      formik.resetForm();
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-start md:bg-[#f9f9f9]">
      <div className="bg-white w-full lg:w-[60%] md:w-[80%] md:border md:border-[#a3a3a3a3] md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden mt-[30px]">
        <div className="flex flex-col items-center py-[50px] h-screen md:h-full">
          <h3 className="text-[#4A4B4D] text-[30px] font-bold pb-[20px]">
            Đăng nhập
          </h3>
          <Image
            src="/assets/logo.jpg"
            alt="App logo"
            height={180}
            width={180}
            className="mb-[10px]"
          />

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-center w-full"
          >
            {/* Email Field */}
            <div className="w-[80%] my-[10px]">
              <div
                className={`relative flex items-center h-[55px] bg-[#f5f5f5] text-[#636464] rounded-full border px-[20px] ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-[#7a7a7a]"
                }`}
              >
                <Image
                  src="/assets/email.png"
                  alt="email"
                  width={20}
                  height={20}
                  className="mr-[10px]"
                />
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Nhập email của bạn"
                  className="bg-transparent text-[16px] w-full outline-none"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-[5px] ml-[10px]">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="w-[80%] my-[10px]">
              <div
                className={`relative flex items-center h-[55px] bg-[#f5f5f5] text-[#636464] rounded-full border px-[20px] ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-[#7a7a7a]"
                }`}
              >
                <Image
                  src="/assets/lock.png"
                  alt="lock"
                  width={20}
                  height={20}
                  className="mr-[10px]"
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Nhập mật khẩu của bạn"
                  className="bg-transparent text-[16px] w-full outline-none"
                />
                <Image
                  src={
                    showPass ? "/assets/eye_show.png" : "/assets/eye_hide.png"
                  }
                  alt="toggle visibility"
                  width={20}
                  height={20}
                  className="ml-[10px] cursor-pointer"
                  onClick={() => setShowPass(!showPass)}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-[5px] ml-[10px]">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`text-center text-white font-semibold w-[80%] h-[55px] rounded-full my-[10px] transition ${
                formik.isValid && formik.dirty
                  ? "bg-[#fc6011] hover:bg-[#e45700] cursor-pointer"
                  : "bg-[#f5854d] cursor-not-allowed"
              }`}
            >
              Đăng nhập
            </button>
            <a
              href="/auth/register"
              class="text-black hover:underline font-medium mt-9"
            >
              Đăng ký cửa hàng
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
