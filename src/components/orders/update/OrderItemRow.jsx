"use client";

import Image from "next/image";
import { formatVND } from "@/utils/pricing";

export default function OrderItemRow({
  item,
  catalog,
  onQty,
  onNote,
  onOpenToppings,
  onRemove,
}) {
  const catalogPrice = catalog?.price ?? item.dish?.price ?? item.price ?? 0;
  const toppingsSum = (item.toppings || []).reduce(
    (s, t) => s + (t.price || 0),
    0
  );
  const lineTotal = item.quantity * (catalogPrice + toppingsSum);

  return (
    <div className="border rounded-xl bg-white shadow-sm p-4 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Top Section: Image + Details */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {(catalog?.image?.url || item.dish?.image?.url) && (
            <Image
              src={catalog?.image?.url || item.dish?.image?.url}
              alt={item.dishName || catalog?.name || "Dish"}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-gray-800">
                {item.dishName || catalog?.name}
              </div>
              {catalog?.stockStatus && catalog.stockStatus !== "available" && (
                <div className="text-xs text-red-500 mt-0.5">
                  Món này hiện không còn trên menu
                </div>
              )}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              {formatVND(catalogPrice)}
            </div>
          </div>

          {/* Toppings */}
          <div className="mt-2">
            {(item.toppings || []).length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {item.toppings.map((t) => (
                  <span
                    key={t._id}
                    className="text-xs border rounded-lg px-2 py-0.5 bg-gray-50"
                  >
                    {t.name} — {formatVND(t.price)}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">
                Không chọn topping
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Field */}
      <div>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#fc6011] focus:border-[#fc6011] outline-none"
          placeholder="Ghi chú cho món (tuỳ chọn)"
          value={item.note || ""}
          onChange={(e) => onNote(e.target.value)}
        />
      </div>

      {/* Bottom Section: Quantity + Actions + Price */}
      <div className="flex items-center justify-between gap-3 border-t pt-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 text-lg font-bold"
            onClick={() => onQty(Math.max(0, item.quantity - 1))}
          >
            −
          </button>
          <input
            className="w-14 border rounded-lg text-center py-1 text-sm focus:ring-2 focus:ring-[#fc6011] focus:border-[#fc6011] outline-none"
            type="number"
            min={1}
            max={50}
            value={item.quantity}
            onChange={(e) => onQty(Number(e.target.value))}
          />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 text-lg font-bold"
            onClick={() => onQty(Math.min(50, item.quantity + 1))}
          >
            +
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm text-gray-700"
            onClick={onOpenToppings}
          >
            Chọn topping
          </button>
          <button
            className="px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 text-sm text-red-600 hover:bg-red-100"
            onClick={onRemove}
          >
            Xoá
          </button>
        </div>

        {/* Line Total */}
        <div className="text-[#fc6011] font-bold text-base min-w-[90px] text-right">
          {formatVND(lineTotal)}
        </div>
      </div>
    </div>
  );
}
