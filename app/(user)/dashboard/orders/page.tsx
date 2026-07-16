"use client";
import React, { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/api/orders";
import { StatCard } from "./StatCard";
import { SaleCard } from "./SaleCard";
import { Order } from "@/types/order";

const SellerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getMyOrders("seller");

        const data: Order[] = res.data?.data || []; // 👈 .data.data
        setOrders(data);
      } catch (err) {
        setError(`${err} `);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const statuses = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const filtered =
    filter === "ALL"
      ? orders
      : orders.filter((o) => (o.status || "PENDING") === filter);

  // Summary stats
  // const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0)
  const paid = orders.filter((o) => o._count.payments > 0).length;
  const pending = orders.filter(
    (o) => (o.status || "PENDING") === "PENDING",
  ).length;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#e3f3e3",
          fontFamily: "'Segoe UI', sans-serif",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div style={{  margin: "0 auto" }} className="max-w-6xl">
          {/* Header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <p
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.3em",
                color: "#b8860b",
                textTransform: "uppercase",
                marginBottom: "0.4rem",
                fontFamily: "Georgia, serif",
              }}
            >
              Seller Dashboard
            </p>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 400,
                color: "#1a1a1a",
                fontFamily: "Georgia, serif",
                margin: 0,
              }}
            >
              My Sales
            </h1>
          </div>

          {/* Stats */}
          {!loading && !error && (
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
              }}
            >
              <StatCard
                label="Total Orders"
                value={orders.length}
                color="#1a1a1a"
                unit=""
              />
              {/* <StatCard label="Total Revenue" value={`₹${tota lRevenue.toLocaleString('en-IN')}`} color="#b8860b" /> */}
              <StatCard label="Paid" value={paid} color="#16a34a" unit="" />
              <StatCard
                label="Pending"
                value={pending}
                color="#f59e0b"
                unit=""
              />
            </div>
          )}

          {/* Status filter tabs */}
          {!loading && !error && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
              }}
            >
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                    border: `1px solid ${filter === s ? "#b8860b" : "#e8e4df"}`,
                    background: filter === s ? "#b8860b" : "#fff",
                    color: filter === s ? "#fff" : "#888",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    transition: "all 0.15s ease",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "4rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "2px solid #e8e4df",
                  borderTop: "2px solid #b8860b",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            </div>
          )}

          {error && (
            <div
              style={{ textAlign: "center", padding: "4rem 0", color: "#999" }}
            >
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🏪</p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#aaa",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {filter === "ALL"
                  ? "No sales yet."
                  : `No ${filter.toLowerCase()} orders.`}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {filtered.map((order, i) => (
                <SaleCard key={order.id} order={order} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerOrders;
