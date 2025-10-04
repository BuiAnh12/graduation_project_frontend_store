import React, { useEffect, useState, useCallback } from "react";
import MapBoxComponent from "../../components/registers/MapboxContainer";
import { toast } from "react-toastify";

// debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const Step3StoreAddress = ({
  data,
  setData,
  nextStep,
  prevStep,
}) => {
  const [locationReady, setLocationReady] = useState(false);
  const [addressInput, setAddressInput] = useState(data.address_full || "");

  // Lấy vị trí hiện tại nếu có
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setData({
            ...data,
            location: { type: "Point", coordinates: [longitude, latitude] },
          });
          setLocationReady(true);
        },
        () => setLocationReady(true) // Nếu user từ chối
      );
    } else setLocationReady(true);
  }, []);

  // Hàm gọi Geocoding API
  const geocodeAddress = useCallback(
    async (value) => {
      if (!value.trim()) return;
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESSTOKEN;
        const encodedAddress = encodeURIComponent(value);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&country=VN`
        );
        const json = await res.json();
        if (json.features && json.features.length > 0) {
          const [lon, lat] = json.features[0].geometry.coordinates;
          setData({
            ...data,
            address_full: value,
            location: { type: "Point", coordinates: [lon, lat] },
          });
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    },
    [data, setData]
  );

  const debouncedGeocode = useCallback(debounce(geocodeAddress, 400), [
    geocodeAddress,
  ]);

  // Khi user nhập địa chỉ
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressInput(value);
    debouncedGeocode(value);
  };

  // Khi user kéo marker hoặc click map
  const handleLocationSelect = (lat, lon) => {
    setData({
      ...data,
      location: { type: "Point", coordinates: [lon, lat] },
    });
  };

  const validateStep = () =>
    data?.address_full &&
    data?.location?.coordinates?.[0] &&
    data?.location?.coordinates?.[1];

  return (
    <div className="text-black">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Địa chỉ cửa hàng
      </h2>
      <div className="p-6">
        <div>
          <label className="font-medium block mb-1">Địa chỉ</label>
          <input
            type="text"
            name="full_address"
            placeholder="Số nhà, đường, quận/huyện..."
            value={addressInput}
            onChange={handleAddressChange}
            className="w-full border-solid border border-gray-300 px-4 py-2 rounded-2xl"
          />
        </div>

        <label className="font-medium block mb-2 mt-4">
          Chọn vị trí trên bản đồ (kéo marker nếu cần)
        </label>

        {locationReady ? (
          <MapBoxComponent
            currentLatitude={data.location.coordinates[1]} // default TP.HCM
            currentLongitude={data.location.coordinates[0]}
            onLocationSelect={handleLocationSelect}
          />
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            Đang lấy vị trí của bạn...
          </p>
        )}

        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep()) nextStep();
              else toast.error("Vui lòng điền đầy đủ thông tin!");
            }}
            className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3StoreAddress;
