import React, { useEffect, useState } from "react";
import { http } from "../api/http";
import { getJwtPayload } from "../auth/authToken";

export default function VouchersPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const payload = getJwtPayload();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await http.get("/api/vouchers");
        const list = res.data?.results ?? res.data ?? [];
        if (alive) setItems(list);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || "Не удалось загрузить ваучеры");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);


  const handleVoucherClick = (id) => {
   
    
      console.log(id)
       http.post("/api/vouchers/order/" + payload.userId, {id: id})
  
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Vouchers</h2>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((v) => (
            <div key={v.id || JSON.stringify(v)} style={{ border: "1px solid #ddd", padding: 12 }}>
              <div><b>{v.title ?? "No title"}</b></div>
              <div>Price: {v.price ?? "-"}</div>
              <div>Tour: {v.tourType ?? "-"}</div>
              <div>Transfer: {v.transferType ?? "-"}</div>
              <div>Hotel: {v.hotelType ?? "-"}</div>
              <div>Hot: {String(v.isHot ?? v.hot ?? false)}</div>
              <button onClick={() => handleVoucherClick(v.id)}>
               Выбрать ID
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}