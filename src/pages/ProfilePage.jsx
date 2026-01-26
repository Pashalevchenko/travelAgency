import React, { useEffect, useState } from "react";
import { http } from "../api/http";
import { getJwtPayload } from "../auth/authToken";

export default function ProfilePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);


  const payload = getJwtPayload();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await http.get("/api/users/" + payload.userId);
        console.log(res)
        if (alive) setUser(res.data);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || "Не удалось загрузить профиль");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>My profile</h2>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && user && (
        <div style={{ border: "1px solid #ddd", padding: 12, maxWidth: 520 }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            <p>name : {user?.username}</p>
            <p>my balance : {user?.balance}</p>
            <p>my phone number : {user?.phoneNumber}</p>
            <p>my role : {user?.role}</p>
          </pre>
          Vouchers: 
          {
            user.vouchers.map((voucher) => (
              <ul key={voucher.id} style={{ borderTop: "1px solid #000",borderBottom: "1px solid #000"  }}>
                <li>
                <p>Title: {voucher.title}</p>
                <p>Description: {voucher.description}</p>
                <p>HotelType: {voucher.hotelType}</p>
                <p>Price: {voucher.price}</p>
                <p>Status: {voucher.status}</p>
                <p>TourType: {voucher.tourType}</p>
                <p>TransferType: {voucher.transferType}</p>
                <p>Arrival date{voucher.arrivalDate}</p>
                </li>
              </ul>
            ))
          }
        </div>
      )}
    </div>
  );
}