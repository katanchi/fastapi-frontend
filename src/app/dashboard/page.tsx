"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("access_token") ?? "");
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/signin");
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-6 py-8 text-[#201c18]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center">
        <div className="rounded-[28px] border border-[#ddcdbc] bg-white p-6 shadow-xl shadow-[#594534]/10 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#8b4f2f]">Dashboard</p>
              <h1 className="mt-2 text-4xl font-black text-[#1f352e]">
                خوش آمدی
              </h1>
              <p className="mt-4 max-w-2xl leading-8 text-[#62584f]">
                ورود موفق بود و توکن کاربر داخل مرورگر ذخیره شده است.
              </p>
            </div>

            <button
              className="inline-flex h-11 items-center justify-center rounded-md border border-[#c9b8a5] px-5 font-bold text-[#2f5d50] transition hover:border-[#2f5d50]"
              onClick={handleLogout}
              type="button"
            >
              خروج
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard label="وضعیت" value="فعال" />
            <InfoCard label="نوع توکن" value="Bearer" />
            <InfoCard label="منبع" value="FastAPI" />
          </div>

          <div className="mt-8 rounded-lg border border-[#ddcdbc] bg-[#fbfaf7] p-4">
            <p className="mb-3 text-sm font-black text-[#3f3933]">
              توکن ذخیره شده
            </p>
            {token ? (
              <code className="block max-h-40 overflow-auto break-all text-left text-xs leading-6 text-[#2f5d50]">
                {token}
              </code>
            ) : (
              <p className="text-sm text-[#a44435]">
                توکنی پیدا نشد. دوباره وارد شو.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#ddcdbc] bg-[#fffcf8] p-4">
      <p className="text-xs font-bold text-[#8b4f2f]">{label}</p>
      <p className="mt-2 text-xl font-black text-[#1f352e]">{value}</p>
    </div>
  );
}
