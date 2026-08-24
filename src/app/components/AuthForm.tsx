"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const isSignup = mode === "signup";
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
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
        setMessageType("error");
        setMessage(data.detail ?? "درخواست ناموفق بود.");
        return;
      }

      const tokenData = data as ApiTokenResponse;
      localStorage.setItem("access_token", tokenData.access_token);
      setMessageType("success");
      setMessage(isSignup ? "حساب ساخته شد." : "ورود موفق بود.");
      router.push("/dashboard");
    } catch {
      setMessageType("error");
      setMessage("اتصال به بک اند برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-6 py-8 text-[#201c18]">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden rounded-[28px] border border-[#ddcdbc] bg-[#2f5d50] p-8 text-white shadow-2xl shadow-[#594534]/10 lg:block">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#f6c177]/30 blur-3xl" />
          <div className="absolute -bottom-24 right-8 h-72 w-72 rounded-full bg-[#8fc7a6]/25 blur-3xl" />
          <div className="relative">
            <Link className="text-sm font-bold text-[#f6c177]" href="/">
              بازگشت به خانه
            </Link>
            <h1 className="mt-10 text-4xl font-black leading-tight">
              {isSignup ? "ساخت حساب امن و سریع" : "ورود دوباره به حساب"}
            </h1>
            <p className="mt-5 leading-8 text-white/75">
              {isSignup
                ? "بعد از ثبت نام، بک اند کاربر را ذخیره می کند و توکن JWT برمی گرداند."
                : "با یوزرنیم و پسورد ثبت شده، یک توکن تازه از بک اند دریافت کن."}
            </p>
            <img
              alt="Authentication visual"
              className="mt-10 w-full rounded-[22px] bg-white/95 p-3"
              src="/auth-visual.svg"
            />
          </div>
        </aside>

        <div className="mx-auto w-full max-w-md">
          <Link className="text-sm font-bold text-[#8b4f2f] lg:hidden" href="/">
            بازگشت به خانه
          </Link>

          <div className="mt-5 rounded-[24px] border border-[#ddcdbc] bg-white p-6 shadow-xl shadow-[#594534]/10 sm:p-8">
            <div className="mb-7">
              <p className="text-sm font-bold text-[#8b4f2f]">
                {isSignup ? "Signup" : "Signin"}
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#1f352e]">
                {isSignup ? "ثبت نام" : "ورود"}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {isSignup && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput label="نام" name="name" />
                    <TextInput label="نام خانوادگی" name="lastname" />
                  </div>
                )}

                <TextInput dir="ltr" label="یوزرنیم" name="username" />

                {isSignup && (
                  <TextInput dir="ltr" label="ایمیل" name="email" type="email" />
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#3f3933]">
                    پسورد
                  </span>
                  <div className="flex h-12 overflow-hidden rounded-md border border-[#d8c7b4] bg-[#fffcf8] focus-within:border-[#2f5d50]">
                    <input
                      className="min-w-0 flex-1 bg-transparent px-3 text-left outline-none"
                      dir="ltr"
                      minLength={8}
                      name="password"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      className="w-20 border-r border-[#d8c7b4] text-sm font-bold text-[#2f5d50] transition hover:bg-[#eef4ef]"
                      onClick={() => setShowPassword((value) => !value)}
                      type="button"
                    >
                      {showPassword ? "مخفی" : "نمایش"}
                    </button>
                  </div>
                </label>
              </div>

              <button
                className="mt-6 h-12 w-full rounded-md bg-[#2f5d50] px-4 font-black text-white shadow-lg shadow-[#2f5d50]/20 transition hover:-translate-y-0.5 hover:bg-[#24483e] disabled:cursor-not-allowed disabled:bg-[#9aa9a4] disabled:shadow-none"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "در حال ارسال..." : isSignup ? "ساخت حساب" : "ورود"}
              </button>
            </form>

            {message && (
              <p
                className={`mt-4 rounded-md p-3 text-sm font-bold ${
                  messageType === "success"
                    ? "bg-[#e7f2ec] text-[#255347]"
                    : "bg-[#fff0ed] text-[#a44435]"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-[#6d6258]">
              {isSignup ? "قبلا حساب ساخته ای؟" : "هنوز حساب نداری؟"}{" "}
              <Link
                className="font-black text-[#8b4f2f]"
                href={isSignup ? "/signin" : "/signup"}
              >
                {isSignup ? "وارد شو" : "ثبت نام کن"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

type TextInputProps = {
  dir?: "ltr" | "rtl";
  label: string;
  name: string;
  type?: string;
};

function TextInput({ dir = "rtl", label, name, type = "text" }: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#3f3933]">{label}</span>
      <input
        className={`h-12 w-full rounded-md border border-[#d8c7b4] bg-[#fffcf8] px-3 outline-none transition focus:border-[#2f5d50] ${
          dir === "ltr" ? "text-left" : ""
        }`}
        dir={dir}
        name={name}
        required
        type={type}
      />
    </label>
  );
}
