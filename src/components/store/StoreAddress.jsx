"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";
import MapBoxComponent from "../registers/MapboxContainer";
import { toast } from "react-toastify";

// debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const StoreAddress = ({ address_full, location, onUpdateAddress }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [addressInput, setAddressInput] = useState(address_full || "");
  const [locationReady, setLocationReady] = useState(false);

  // Lấy lat/lon từ DB
  const initialLat = location?.coordinates ? location.coordinates[1] : 10.7769; // TP.HCM default
  const initialLon = location?.coordinates ? location.coordinates[0] : 106.7009;

  const [tempLocation, setTempLocation] = useState({
    lat: initialLat,
    lon: initialLon,
  });

  // Lấy vị trí hiện tại nếu user chưa có
  useEffect(() => {
    if (
      (!location?.coordinates || !location.coordinates[0]) &&
      navigator.geolocation
    ) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setTempLocation({ lat: latitude, lon: longitude });
          setLocationReady(true);
        },
        () => setLocationReady(true)
      );
    } else {
      setLocationReady(true);
    }
  }, []);

  // Geocoding address
  const geocodeAddress = useCallback(async (value) => {
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
        setTempLocation({ lat, lon });
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  }, []);

  const debouncedGeocode = useCallback(debounce(geocodeAddress, 400), [
    geocodeAddress,
  ]);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressInput(value);
    debouncedGeocode(value);
  };

  const handleLocationSelect = (lat, lon) => {
    setTempLocation({ lat, lon });
  };

  const handleSave = () => {
    if (!addressInput.trim()) {
      toast.error("Địa chỉ không được để trống!");
      return;
    }

    const latNum = parseFloat(tempLocation.lat);
    const lonNum = parseFloat(tempLocation.lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      toast.error("Vĩ độ/Kinh độ không hợp lệ!");
      return;
    }

    onUpdateAddress({
      address_full: addressInput,
      lat: latNum,
      lon: lonNum,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setAddressInput(address_full);
    setTempLocation({
      lat: initialLat,
      lon: initialLon,
    });
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-full space-y-6 rounded-xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Địa chỉ</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
            title="Chỉnh sửa"
          >
            <FaPen />
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={addressInput}
            onChange={handleAddressChange}
            placeholder="Số nhà, đường, quận/huyện..."
          />

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="w-full">
              <label className="font-bold text-gray-700">Vĩ độ</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={tempLocation.lat}
                onChange={(e) =>
                  setTempLocation({
                    ...tempLocation,
                    lat: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="w-full">
              <label className="font-bold text-gray-700">Kinh độ</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={tempLocation.lon}
                onChange={(e) =>
                  setTempLocation({
                    ...tempLocation,
                    lon: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {locationReady ? (
            <MapBoxComponent
              currentLatitude={tempLocation.lat}
              currentLongitude={tempLocation.lon}
              onLocationSelect={handleLocationSelect}
            />
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Đang lấy vị trí của bạn...
            </p>
          )}

          <div className="flex justify-end gap-4 mt-2">
            <button
              className="text-green-600 hover:text-green-800"
              onClick={handleSave}
              title="Lưu"
            >
              <FaCheck />
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={handleCancel}
              title="Hủy"
            >
              <FaTimes />
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
            value={address_full}
          />
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="w-full">
              <label className="font-bold text-gray-700">Vĩ độ</label>
              <input
                type="text"
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
                value={initialLat}
              />
            </div>
            <div className="w-full">
              <label className="font-bold text-gray-700">Kinh độ</label>
              <input
                type="text"
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
                value={initialLon}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreAddress;
