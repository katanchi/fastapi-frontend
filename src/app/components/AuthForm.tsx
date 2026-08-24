"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

type ApiTokenResponse = {
  access_token: string;
  token_type: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setToken("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = isSignup
      ? {
          name: String(formData.get("name")),
          lastname: String(formData.get("lastname")),
          username: String(formData.get("username")),
          password: String(formData.get("password")),
          email: String(formData.get("email")),
        }
      : {
          username: String(formData.get("username")),
          password: String(formData.get("password")),
        };

    try {
      const response = await fetch(`${apiUrl}/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail ?? "درخواست ناموفق بود.");
        return;
      }

      const tokenData = data as ApiTokenResponse;
      localStorage.setItem("access_token", tokenData.access_token);
      setToken(tokenData.access_token);
      setMessage(isSignup ? "حساب ساخته شد." : "ورود موفق بود.");
    } catch {
      setMessage("اتصال به بک اند برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-[#211d1a]">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center gap-8 lg:flex-row lg:items-center">
        <div className="flex-1">
          <Link className="text-sm font-semibold text-[#8b4f2f]" href="/">
            بازگشت به خانه
          </Link>
          <h1 className="mt-6 text-4xl font-bold">
            {isSignup ? "ثبت نام" : "ورود"}
          </h1>
          <p className="mt-4 max-w-xl leading-8 text-[#64594f]">
            {isSignup
              ? "اطلاعات کاربر را وارد کن تا در دیتابیس ذخیره شود و توکن دریافت کنی."
              : "یوزرنیم و پسورد حساب ساخته شده را وارد کن تا توکن جدید بگیری."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-lg border border-[#d8c7b4] bg-white p-6 shadow-sm"
        >
          <div className="space-y-4">
            {isSignup && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">نام</span>
                  <input
                    className="h-12 w-full rounded-md border border-[#d8c7b4] px-3 outline-none focus:border-[#8b4f2f]"
                    name="name"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">
                    نام خانوادگی
                  </span>
                  <input
                    className="h-12 w-full rounded-md border border-[#d8c7b4] px-3 outline-none focus:border-[#8b4f2f]"
                    name="lastname"
                    required
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">یوزرنیم</span>
              <input
                className="h-12 w-full rounded-md border border-[#d8c7b4] px-3 text-left outline-none focus:border-[#8b4f2f]"
                dir="ltr"
                name="username"
                required
              />
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">ایمیل</span>
                <input
                  className="h-12 w-full rounded-md border border-[#d8c7b4] px-3 text-left outline-none focus:border-[#8b4f2f]"
                  dir="ltr"
                  name="email"
                  required
                  type="email"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">پسورد</span>
              <input
                className="h-12 w-full rounded-md border border-[#d8c7b4] px-3 text-left outline-none focus:border-[#8b4f2f]"
                dir="ltr"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </label>
          </div>

          <button
            className="mt-6 h-12 w-full rounded-md bg-[#2f5d50] px-4 font-bold text-white transition hover:bg-[#24483e] disabled:cursor-not-allowed disabled:bg-[#9aa9a4]"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "در حال ارسال..." : isSignup ? "ساخت حساب" : "ورود"}
          </button>

          {message && (
            <p className="mt-4 rounded-md bg-[#f1ebe2] p-3 text-sm text-[#4d433b]">
              {message}
            </p>
          )}

          {token && (
            <div className="mt-4 rounded-md border border-[#d8c7b4] bg-[#fbfaf7] p-3">
              <p className="mb-2 text-sm font-semibold">توکن دریافتی</p>
              <code className="block max-h-28 overflow-auto break-all text-left text-xs leading-5 text-[#2f5d50]">
                {token}
              </code>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
