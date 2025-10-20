"use client";

import { useEffect, useState } from "react";
import { getStoreRatings, replyToRating } from "@/service/rating";
import Modal from "@/components/Modal";
import ReactPaginate from "react-paginate";
import { ThreeDots } from "react-loader-spinner";
import Header from "@/components/Header";

const StoreReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const replied =
        filter === "replied"
          ? "true"
          : filter === "not_replied"
          ? "false"
          : undefined;

      const res = await getStoreRatings({ page, limit: 5, replied });

      if (res?.success) {
        // ✅ đồng bộ với cấu trúc backend: data + meta
        setReviews(res.data || []);
        setTotalPages(res.meta?.totalPages || 0);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, filter]);

  const handleReplyOpen = (review) => {
    setSelectedReview(review);
    setReplyText(review.storeReply || "");
  };

  const handleReplySave = async () => {
    if (selectedReview) {
      const res = await replyToRating(selectedReview._id, replyText);
      if (res?.success) {
        setSelectedReview(null);
        fetchReviews(); // refresh lại list
      }
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Header title="Đánh giá" goBack={true} />

      {/* --- Filter --- */}
      <div className="mb-4 mt-20">
        <select
          value={filter}
          onChange={(e) => {
            setPage(1);
            setFilter(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="replied">Đã phản hồi</option>
          <option value="not_replied">Chưa phản hồi</option>
        </select>
      </div>

      {/* --- Loading --- */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#fc6011"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Không có đánh giá nào.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const user = review.users || {}; // ✅ fix: đúng field từ backend
            const avatarUrl =
              user.avatar?.url ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";

            return (
              <div
                key={review._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                {/* --- User Info --- */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={avatarUrl}
                    alt={user.name || "Người dùng"}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="font-semibold">
                    {user.name || "Ẩn danh"}
                  </span>
                </div>

                {/* --- Rating --- */}
                <div className="text-yellow-500 mb-1">
                  {Array(review.ratingValue).fill("★").join("")}
                  {Array(5 - review.ratingValue)
                    .fill("☆")
                    .join("")}
                </div>

                {/* --- Comment --- */}
                <p className="mb-2">
                  {review.comment || "(Không có bình luận)"}
                </p>

                {/* --- Store Reply --- */}
                {review.storeReply ? (
                  <div className="bg-gray-100 p-2 rounded mb-2 text-sm text-gray-700">
                    <strong>Phản hồi của cửa hàng:</strong> {review.storeReply}
                  </div>
                ) : null}

                {/* --- Reply Button --- */}
                <button
                  onClick={() => handleReplyOpen(review)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  {review.storeReply ? "Chỉnh sửa phản hồi" : "Phản hồi"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={<span className="px-2">&lt;</span>}
            nextLabel={<span className="px-2">&gt;</span>}
            breakLabel="..."
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            forcePage={page - 1}
            containerClassName="flex space-x-2"
            activeClassName="bg-orange-500 text-white"
            pageClassName="border px-3 py-1 rounded-lg cursor-pointer"
            previousClassName="border px-3 py-1 rounded-lg cursor-pointer"
            nextClassName="border px-3 py-1 rounded-lg cursor-pointer"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      )}

      {/* --- Reply Modal --- */}
      <Modal
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Phản hồi khách hàng"
        confirmTitle="Lưu phản hồi"
        onConfirm={handleReplySave}
      >
        <textarea
          className="w-full border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Nhập phản hồi của bạn tại đây..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default StoreReviewPage;
