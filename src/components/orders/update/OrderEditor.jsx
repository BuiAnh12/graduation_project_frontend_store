"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getOrder, updateOrder } from "@/service/order";
import { getDishes } from "@/service/dish";
import localStorageService from "@/utils/localStorageService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/Modal";
import AddDishModal from "./AddDishModal";
import ToppingsModal from "./ToppingsModal";
import OrderItemRow from "./OrderItemRow";
import { computeTotals, formatVND } from "@/utils/pricing";
import useUndoableRemove from "@/hooks/useUndoableRemove";

const normalizeItems = (items) =>
  (items || []).map((it) => ({
    dishId: it.dishId,
    quantity: it.quantity,
    note: it.note || "",
    toppings: (it.toppings || []).map((t) => t._id ?? t.toppingId).sort(),
  }));

const makeLineId = () => `line_${Math.random().toString(36).slice(2, 10)}`;

export default function OrderEditor() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [catalogMap, setCatalogMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toppingsFor, setToppingsFor] = useState(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialSnapshotRef = useRef(null);

  useEffect(() => {
    const map = {};
    dishes.forEach((d) => (map[d._id] = d));
    setCatalogMap(map);
  }, [dishes]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data: ord } = await getOrder({ orderId: id });
        if (!mounted) return;
        setOrder(ord);

        // ✅ Normalize toppings from server (OrderItemTopping) to Topping-shaped { _id, name, price }
        const withLocalIds = (ord?.items || []).map((it) => ({
          ...it,
          lineId: makeLineId(),
          dishId: it.dishId || it.dish?._id,
          dishName: it.dishName || it.dish?.name,
          quantity: it.quantity ?? 1,
          note: it.note || "",
          toppings: (it.toppings || []).map((t) => ({
            _id: t.toppingId ?? t._id, // <-- use Topping._id for comparisons
            name: t.toppingName ?? t.name,
            price: t.price,
          })),
        }));
        setItems(withLocalIds);
        initialSnapshotRef.current = JSON.stringify(
          normalizeItems(withLocalIds)
        );

        const storeId = localStorageService.getStoreId?.() || ord?.storeId;
        const dishesRes = await getDishes(storeId);
        const list =
          dishesRes?.data?.data?.data ||
          dishesRes?.data?.data ||
          dishesRes?.data ||
          [];
        setDishes(list);
      } catch (e) {
        console.error(e);
        toast.error("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  const { subtotalPrice, finalTotal } = useMemo(
    () => computeTotals(items, order, catalogMap),
    [items, order, catalogMap]
  );

  const isDirty = useMemo(() => {
    if (!initialSnapshotRef.current) return false;
    return JSON.stringify(normalizeItems(items)) !== initialSnapshotRef.current;
  }, [items]);

  const { removeItem, handleQtyChange } = useUndoableRemove(items, setItems);

  const addDishToOrder = (dish) => {
    const newLine = {
      lineId: makeLineId(),
      orderId: order._id,
      dishId: dish._id,
      dishName: dish.name,
      quantity: 1,
      price: dish.price,
      note: "",
      toppings: [],
      dish: {
        _id: dish._id,
        name: dish.name,
        price: dish.price,
        image: dish.image || { filePath: "", url: "" },
        description: dish.description || "",
      },
    };
    setItems((curr) => [newLine, ...curr]);
  };

  const onSave = async () => {
    if ((items || []).length === 0) {
      toast.error("Đơn hàng không thể rỗng. Vui lòng thêm ít nhất 1 món.");
      setConfirmSaveOpen(false);
      return;
    }
    try {
      setSaving(true);

      // Build payload: keep only fields the server expects on OrderItem
      const payloadItems = items.map(
        ({ lineId, __v, createdAt, updatedAt, dish, ...rest }) => ({
          ...rest,
          // Server trusts: dishId, dishName, quantity, price, note, toppings
          // toppings already normalized to [{ _id: Topping._id, name, price }]
        })
      );

      const updatedData = {
        ...order,
        items: payloadItems,
        subtotalPrice,
        finalTotal,
      };

      const res = await updateOrder({ orderId: order._id, updatedData });
      toast.success(res?.message || "Cập nhật đơn hàng thành công");
      setConfirmSaveOpen(false);
      router.push(`/orders/${order._id}`);
    } catch (e) {
      console.error(e);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="mt-20 px-4">Đang tải...</div>;
  if (!order) return <div className="mt-20 px-4">Không tìm thấy đơn hàng</div>;

  return (
    <>
      <div className="mt-20 mb-24 px-4 space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <div>
            <div className="text-gray-800 font-medium">
              {order?.shipInfo?.contactName || "Không xác định"}
            </div>
            <div className="text-sm text-gray-600">
              {order?.shipInfo?.contactPhonenumber || "Không có số điện thoại"}
            </div>
          </div>
          <button
            className="px-3 py-2 bg-[#fc6011] text-white rounded hover:bg-[#e9550f]"
            onClick={() => setAddModalOpen(true)}
          >
            Thêm món
          </button>
        </div>

        <div className="space-y-3">
          {items.map((it) => (
            <OrderItemRow
              key={it.lineId}
              item={it}
              catalog={catalogMap[it.dishId]}
              onQty={(q) => handleQtyChange(it.lineId, q)}
              onNote={(note) =>
                setItems((curr) =>
                  curr.map((x) => (x.lineId === it.lineId ? { ...x, note } : x))
                )
              }
              onOpenToppings={() => setToppingsFor(it)}
              onRemove={() => removeItem(it.lineId)}
            />
          ))}
          {items.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-6">
              Đơn hàng đang rỗng — hãy nhấn{" "}
              <span className="font-medium">Thêm món</span>.
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Giảm giá</span>
            <span className="text-gray-800 font-medium">
              {formatVND(order?.totalDiscount || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Phí giao hàng</span>
            <span className="text-gray-800 font-medium">
              {formatVND(order?.shippingFee || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-bold">
              Tổng tiền món (giá gốc)
            </span>
            <span className="text-gray-800 font-medium">
              {formatVND(subtotalPrice)}
            </span>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-bold">Tổng tiền quán nhận</span>
            <span className="font-bold text-[#fc6011]">
              {formatVND(finalTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => router.back()}
          >
            Huỷ
          </button>
          <button
            className={`flex-1 py-2 px-4 text-white rounded ${
              items.length === 0 || !isDirty || saving
                ? "bg-gray-300"
                : "bg-[#fc6011] hover:bg-[#e9550f]"
            }`}
            disabled={items.length === 0 || !isDirty || saving}
            onClick={() => setConfirmSaveOpen(true)}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <AddDishModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        dishes={dishes}
        onAdd={addDishToOrder}
      />

      <ToppingsModal
        open={!!toppingsFor}
        onClose={() => setToppingsFor(null)}
        // Pass the dish catalog or fall back to the snapshot
        dish={
          toppingsFor
            ? catalogMap[toppingsFor.dishId] || toppingsFor.dish
            : null
        }
        value={toppingsFor?.toppings || []}
        onSave={(selected) => {
          const dedup = Object.values(
            (selected || []).reduce((acc, t) => {
              const id = t._id ?? t.toppingId;
              if (!id) return acc;
              if (!acc[id]) {
                acc[id] = {
                  _id: id,
                  name: t.name ?? t.toppingName,
                  price: t.price,
                  groupId: t.groupId,
                  groupName: t.groupName,
                };
              }
              return acc;
            }, {})
          );
          setItems((curr) =>
            curr.map((i) =>
              i.lineId === toppingsFor.lineId ? { ...i, toppings: dedup } : i
            )
          );
        }}
      />

      <Modal
        open={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        onConfirm={onSave}
        confirmTitle="Lưu"
        closeTitle="Không"
        title="Xác nhận lưu thay đổi"
      >
        Bạn có chắc muốn <strong>cập nhật đơn hàng</strong> này không?
      </Modal>

      <ToastContainer position="bottom-center" />
    </>
  );
}
