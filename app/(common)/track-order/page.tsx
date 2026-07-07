"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiHome,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

type OrderStatus = "PENDING" | "CONFIRMED" | "FULFILLED" | "DELIVERED" | "CANCELLED";

interface Order {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  status: OrderStatus;
  sellerName: string;
  createdAt: string;
  imageUrl?: string;
}

const STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: "PENDING", label: "Order Placed", icon: FiClock },
  { key: "CONFIRMED", label: "Confirmed", icon: FiCheckCircle },
  { key: "FULFILLED", label: "Fulfilled", icon: FiPackage },
  { key: "DELIVERED", label: "Delivered", icon: FiHome },
];

function statusIndex(status: OrderStatus) {
  return STEPS.findIndex((s) => s.key === status);
}

export default function TrackOrder() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/orders/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data?.message || "Could not load order.");
          return;
        }

        setOrder(data.data);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#12331F]/15 border-t-[#12331F]" />
        <p className="text-sm text-[#12331F]/50">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <FiXCircle className="text-red-400" size={32} />
        <p className="text-sm font-medium text-[#12331F]/70">
          {error || "Order not found."}
        </p>
        <Link
          href="/dashboard/orders"
          className="mt-2 text-xs font-semibold text-[#12331F] underline"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const cancelled = order.status === "CANCELLED";
  const currentStep = statusIndex(order.status);

  return (
    <div className="min-h-screen bg-[#FDFCF9] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-[#12331F]/50 hover:text-[#12331F]"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

        {/* Header card */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-[#12331F]/5">
                {order.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={order.imageUrl}
                    alt={order.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiPackage className="text-[#12331F]/30" size={22} />
                )}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#12331F]/40">
                  Order #{order.id.slice(0, 8)}
                </p>
                <h1 className="text-lg font-bold text-[#12331F]">
                  {order.productName}
                </h1>
                <p className="text-xs text-[#12331F]/50">
                  Sold by {order.sellerName}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-[#12331F]/40">
                {order.quantity} {order.unit}
              </p>
              <p className="text-lg font-black text-[#12331F]">
                ₹{order.totalPrice}
              </p>
            </div>
          </div>
        </div>

        {/* Status timeline */}
        <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-8 text-sm font-bold uppercase tracking-wide text-[#12331F]/50">
            Order Status
          </h2>

          {cancelled ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4">
              <FiXCircle className="text-red-500" size={22} />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Order Cancelled
                </p>
                <p className="text-xs text-red-600/70">
                  This order was cancelled and is no longer active.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative flex justify-between">
              {/* connecting line */}
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-black/[0.06]">
                <div
                  className="h-full bg-[#12331F] transition-all duration-500"
                  style={{
                    width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {STEPS.map((step, i) => {
                const done = i <= currentStep;
                const Icon = step.icon;
                return (
                  <div
                    key={step.key}
                    className="relative z-10 flex flex-col items-center gap-2"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        done
                          ? "border-[#12331F] bg-[#12331F] text-white"
                          : "border-black/10 bg-white text-[#12331F]/30"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      className={`max-w-[70px] text-center text-[11px] font-medium ${
                        done ? "text-[#12331F]" : "text-[#12331F]/35"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order info */}
        <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#12331F]/50">
            Order Details
          </h2>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#12331F]/45">Placed on</dt>
              <dd className="font-medium text-[#12331F]">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-[#12331F]/45">Status</dt>
              <dd className="font-medium text-[#12331F]">{order.status}</dd>
            </div>
          </dl>
        </div>

        {/* Cancel action — only if still cancellable */}
        {!cancelled && order.status !== "DELIVERED" && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={async () => {
                const res = await fetch(`/api/orders/${order.id}/cancel`, {
                  method: "POST",
                  credentials: "include",
                });
                if (res.ok) {
                  setOrder((o) => (o ? { ...o, status: "CANCELLED" } : o));
                }
              }}
              className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}