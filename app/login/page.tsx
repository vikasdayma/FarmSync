"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { Leaf, Mail, Lock, Eye, EyeOff, Sprout } from "lucide-react";

const Login = () => {
  type FormState = {
    email: string;
    password: string;
  };

  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // clear that field's error as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function validate() {
    const newErrors: Partial<FormState> = {};

    const email = form.email.trim();
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data?.message ||
          (data?.errors
            ? Object.entries(data.errors)
                .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
                .join(" | ")
            : "Login failed");

        setMessage(errMsg);
        return;
      }

      const userRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        setMessage("Login succeeded but failed to fetch user.");
        return;
      }

      login(userData.data);
      router.replace(`/dashboard`);
      setMessage("Login successful.");
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F3D2E] px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,232,107,0.18)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(143,203,79,0.15)_0%,transparent_70%)]" />
      </div>

      <Card className="relative z-10 grid w-full max-w-4xl overflow-hidden border-black/5 bg-white/95 p-0 shadow-2xl shadow-black/40 md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-[#12331F] p-8 text-[#EAF3E4] md:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,232,107,0.4)_0%,transparent_65%)]" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 text-[#C9E86B]">
              <Leaf className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Welcome back
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight">
              Good to see
              <br />
              you again.
            </h2>
            <p className="mt-3 text-sm text-[#EAF3E4]/70">
              Log in to manage your listings, orders, and connections.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-sm text-[#EAF3E4]/60">
            <Sprout className="h-4 w-4 text-[#C9E86B]" />
            Trusted by farmers &amp; suppliers nationwide
          </div>
        </div>

        <CardContent className="p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#12331F]">Login</h1>
            <p className="mt-1 text-sm text-[#12331F]/50">
              Enter your credentials to continue.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12331F]/35" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#12331F]/35 hover:text-[#12331F]/60"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#12331F]/50 hover:text-[#12331F]"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full bg-[#12331F] text-[#EAF3E4] hover:bg-[#0F3D2E]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </Button>

            {message ? (
              <p
                className={`text-center text-sm ${
                  message.includes("successful")
                    ? "text-[#3D8B3D]"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-xs font-medium uppercase tracking-wide text-[#12331F]/35">
              or
            </span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="text-center text-sm text-[#12331F]/60">
            Don&apos;t have an account?
          </div>
          <Link href="/signup" className="mt-3 block">
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#12331F]/20 text-[#12331F] hover:bg-[#12331F]/5"
            >
              Sign Up
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;