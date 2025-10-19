"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { formatVND } from "@/utils/pricing";

function normName(s = "") {
  return s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/\s+/g, " "); // collapse spaces
}

export default function ToppingsModal({ open, onClose, dish, value, onSave }) {
  // Keep hook order stable
  const [checked, setChecked] = useState(new Set());

  // 1) De-dupe groups & toppings by _id (your API sometimes repeats them)
  const normalizedGroups = useMemo(() => {
    const groups = dish?.toppingGroups || [];
    const seenGroup = new Set();
    const result = [];

    for (const g of groups) {
      if (seenGroup.has(g._id)) continue;
      seenGroup.add(g._id);

      const seenTop = new Set();
      const uniqueToppings = [];
      for (const t of g.toppings || []) {
        if (seenTop.has(t._id)) continue;
        seenTop.add(t._id);
        uniqueToppings.push(t);
      }

      result.push({ ...g, toppings: uniqueToppings });
    }

    return result;
  }, [dish]);

  // 2) Build lookups from the de-duped groups
  //    a) by Topping._id
  const catalogMap = useMemo(() => {
    const m = new Map();
    for (const g of normalizedGroups) {
      for (const t of g.toppings || []) {
        m.set(t._id, { ...t, groupId: g._id, groupName: g.name });
      }
    }
    return m;
  }, [normalizedGroups]);

  //    b) fallback by (normalized name + price) -> Topping._id
  const namePriceToId = useMemo(() => {
    const m = new Map();
    for (const g of normalizedGroups) {
      for (const t of g.toppings || []) {
        const key = `${normName(t.name)}|${Number(t.price || 0)}`;
        // prefer first occurrence; ignore duplicates
        if (!m.has(key)) m.set(key, t._id);
      }
    }
    return m;
  }, [normalizedGroups]);

  // 3) Pre-check already added toppings:
  //    Try value._id (if it matches a Topping._id)
  //    Else try value.toppingId (server should send this ideally)
  //    Else try match by (name+price)
  useEffect(() => {
    if (!open) return;

    const next = new Set();
    for (const t of value || []) {
      const byId = t._id && catalogMap.has(t._id) ? t._id : null;
      const byToppingId =
        t.toppingId && catalogMap.has(t.toppingId) ? t.toppingId : null;
      const byNamePrice = namePriceToId.get(
        `${normName(t.name ?? t.toppingName)}|${Number(t.price || 0)}`
      );

      const resolved = byId || byToppingId || byNamePrice;
      if (resolved) next.add(resolved);
    }
    setChecked(next);
  }, [value, open, catalogMap, namePriceToId]);

  // Early return after hooks
  if (!open || !dish) return null;

  const toggle = (topping) => {
    const id = topping._id;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 4) Build normalized selection from the checked ids (only catalog items)
  const buildSelected = () => {
    const selected = [];
    checked.forEach((id) => {
      const hit = catalogMap.get(id);
      if (hit) {
        selected.push({
          _id: hit._id, // Topping._id
          name: hit.name,
          price: hit.price,
          groupId: hit.groupId,
          groupName: hit.groupName,
        });
      }
    });
    // Final de-dupe by _id (belt-and-suspenders)
    const map = new Map();
    for (const t of selected) if (!map.has(t._id)) map.set(t._id, t);
    return Array.from(map.values());
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={() => {
        onSave(buildSelected());
        onClose();
      }}
      title="Chọn topping"
      confirmTitle="Áp dụng"
      closeTitle="Đóng"
      className="w-[28rem] max-w-[95vw]"
    >
      <div className="space-y-4 max-h-[60vh] overflow-auto pr-1">
        {normalizedGroups.map((group) => (
          <div key={group._id} className="border rounded-md p-3">
            <div className="font-medium mb-2">{group.name}</div>
            <div className="grid grid-cols-1 gap-2">
              {(group.toppings || []).map((t) => {
                const isChecked = checked.has(t._id);
                return (
                  <label
                    key={t._id}
                    className="flex items-center justify-between border rounded px-2 py-1 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(t)}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#2563eb", // xanh dương (tuỳ)
                          cursor: "pointer",
                        }}
                      />
                      <span>{t.name}</span>
                    </div>
                    <span className="text-gray-700">{formatVND(t.price)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
