"use client";

import { useRef } from "react";
import { toast } from "react-toastify";

// items: current array of items
// setItems: state setter
// timeoutMs: how long we keep the undo window open
export default function useUndoableRemove(
  items,
  setItems,
  { timeoutMs = 5000 } = {}
) {
  const timersRef = useRef({});

  const removeItem = (lineId) => {
    const original = items.find((i) => i.lineId === lineId);
    if (!original) return;

    // Optimistic remove
    const next = items.filter((i) => i.lineId !== lineId);
    setItems(next);

    const tid = setTimeout(() => {
      delete timersRef.current[lineId]; // finalize
    }, timeoutMs);
    timersRef.current[lineId] = tid;

    const undo = () => {
      clearTimeout(timersRef.current[lineId]);
      delete timersRef.current[lineId];
      setItems((curr) => {
        if (curr.some((i) => i.lineId === lineId)) return curr;
        const idx = items.findIndex((i) => i.lineId === lineId);
        const copy = [...curr];
        copy.splice(idx === -1 ? curr.length : idx, 0, original);
        return copy;
      });
    };

    // Show a toast with an Undo button
    toast(
      ({ closeToast }) => (
        <div className="flex items-center gap-3">
          <span>Đã xoá {original.dishName}.</span>
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50"
            onClick={() => {
              undo();
              closeToast && closeToast();
            }}
          >
            Hoàn tác
          </button>
        </div>
      ),
      { autoClose: timeoutMs, type: "info", position: "bottom-center" }
    );
  };

  // If user sets qty to 0, warn & remove with undo
  const handleQtyChange = (lineId, nextQty) => {
    if (nextQty <= 0) {
      toast.warn(
        "Số lượng = 0 sẽ xoá món khỏi đơn. Đã xoá — bạn có thể Hoàn tác.",
        {
          position: "bottom-center",
        }
      );
      removeItem(lineId);
      return;
    }
    setItems((curr) =>
      curr.map((i) =>
        i.lineId === lineId
          ? { ...i, quantity: Math.min(50, Math.max(1, nextQty)) }
          : i
      )
    );
  };

  return { removeItem, handleQtyChange };
}
