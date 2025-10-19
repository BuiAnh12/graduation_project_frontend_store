"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import { formatVND } from "@/utils/pricing";

export default function AddDishModal({ open, onClose, dishes, onAdd }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  if (!open) return null;

  const filtered = (dishes || []).filter((d) =>
    d.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose} title="Thêm món" confirmTitle={null}>
      <div className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Tìm món…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="max-h-[55vh] overflow-auto space-y-2 pr-1">
          {(filtered || []).map((d) => {
            const unavailable = d.stockStatus && d.stockStatus !== "available";
            return (
              <div
                key={d._id}
                className={`flex items-center gap-3 border rounded p-2 ${
                  unavailable ? "opacity-50" : ""
                }`}
              >
                <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-100 shrink-0">
                  {d.image?.url ? (
                    <Image
                      src={d.image.url}
                      alt={d.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-gray-700">
                    {formatVND(d.price)}
                  </div>
                  {unavailable && (
                    <div className="text-xs text-gray-500 mt-0.5">Hết hàng</div>
                  )}
                </div>

                <button
                  disabled={unavailable}
                  onClick={() => onAdd(d)}
                  className={`px-3 py-1.5 rounded text-white ${
                    unavailable
                      ? "bg-gray-300"
                      : "bg-[#fc6011] hover:bg-[#e9550f]"
                  }`}
                >
                  Thêm
                </button>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-6">
              Không tìm thấy món phù hợp
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
