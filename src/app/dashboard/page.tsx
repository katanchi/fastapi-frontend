"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Tab = "overview" | "profile" | "token";

type UserProfile = {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
};

type ApiErrorDetail =
  | string
  | Array<
      | string
      | {
          msg?: string;
        }
    >;

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const tabs: Array<{ id: Tab; label: string; description: string }> = [
  { id: "overview", label: "نمای کلی", description: "وضعیت حساب" },
  { id: "profile", label: "پروفایل", description: "مشاهده و ویرایش" },
  { id: "token", label: "توکن", description: "JWT ذخیره شده" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token") ?? "";
    setToken(savedToken);

    if (!savedToken) {
      router.push("/signin");
      return;
    }

    fetchProfile(savedToken);
  }, [router]);

  async function fetchProfile(savedToken: string) {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(formatApiError(data.detail));
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/signin");
        }
        return;
      }

      setProfile(data as UserProfile);
    } catch {
      setMessageType("error");
      setMessage("اتصال به بک اند برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      router.push("/signin");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name")),
      lastname: String(formData.get("lastname")),
      username: String(formData.get("username")),
      email: String(formData.get("email")),
    };

    try {
      const response = await fetch(`${apiUrl}/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(formatApiError(data.detail));
        return;
      }

      setProfile(data as UserProfile);
      setMessageType("success");
      setMessage("پروفایل با موفقیت ذخیره شد.");
    } catch {
      setMessageType("error");
      setMessage("اتصال به بک اند برقرار نشد.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/signin");
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] p-4 text-[#201c18] sm:p-6">
      <section className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[24px] border border-[#ddcdbc] bg-[#1f352e] p-5 text-white shadow-xl shadow-[#594534]/10">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-bold text-[#f6c177]">FastAPI Auth</p>
            <h1 className="mt-2 text-2xl font-black">داشبورد</h1>
            <p className="mt-3 text-sm leading-6 text-white/70">
              مدیریت حساب و پروفایل کاربر
            </p>
          </div>

          <nav className="mt-5 space-y-2">
            {tabs.map((tab) => (
              <button
                className={`w-full rounded-xl p-4 text-right transition ${
                  activeTab === tab.id
                    ? "bg-[#f6c177] text-[#1f352e]"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <span className="block font-black">{tab.label}</span>
                <span className="mt-1 block text-xs opacity-70">
                  {tab.description}
                </span>
              </button>
            ))}
          </nav>

          <button
            className="mt-5 h-11 w-full rounded-xl border border-white/20 font-bold text-white transition hover:bg-white/10"
            onClick={handleLogout}
            type="button"
          >
            خروج
          </button>
        </aside>

        <div className="rounded-[24px] border border-[#ddcdbc] bg-white p-5 shadow-xl shadow-[#594534]/10 sm:p-8">
          <header className="flex flex-col gap-4 border-b border-[#eadccc] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#8b4f2f]">User Panel</p>
              <h2 className="mt-2 text-3xl font-black text-[#1f352e]">
                {profile ? `${profile.name} ${profile.lastname}` : "حساب کاربری"}
              </h2>
              <p className="mt-3 leading-7 text-[#62584f]">
                {isLoading
                  ? "در حال دریافت اطلاعات..."
                  : "اطلاعات حساب از بک اند خوانده شده است."}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f1e8] px-4 py-3">
              <p className="text-xs font-bold text-[#8b4f2f]">Username</p>
              <p className="mt-1 font-black text-[#1f352e]">
                {profile?.username ?? "-"}
              </p>
            </div>
          </header>

          {message && (
            <p
              className={`mt-5 rounded-xl p-4 text-sm font-bold ${
                messageType === "success"
                  ? "bg-[#e7f2ec] text-[#255347]"
                  : "bg-[#fff0ed] text-[#a44435]"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6">
            {activeTab === "overview" && <OverviewTab profile={profile} />}
            {activeTab === "profile" && (
              <ProfileTab
                isSaving={isSaving}
                onSubmit={handleProfileSubmit}
                profile={profile}
              />
            )}
            {activeTab === "token" && <TokenTab token={token} />}
          </div>
        </div>
      </section>
    </main>
  );
}

function OverviewTab({ profile }: { profile: UserProfile | null }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <InfoCard label="وضعیت حساب" value={profile ? "فعال" : "در حال بارگذاری"} />
      <InfoCard label="ایمیل" value={profile?.email ?? "-"} />
      <InfoCard label="شناسه کاربر" value={profile ? String(profile.id) : "-"} />
    </div>
  );
}

function ProfileTab({
  isSaving,
  onSubmit,
  profile,
}: {
  isSaving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  profile: UserProfile | null;
}) {
  return (
    <form
      className="max-w-3xl rounded-2xl border border-[#eadccc] bg-[#fffcf8] p-5"
      key={profile ? `${profile.id}-${profile.username}-${profile.email}` : "loading"}
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput defaultValue={profile?.name} label="نام" name="name" />
        <TextInput
          defaultValue={profile?.lastname}
          label="نام خانوادگی"
          name="lastname"
        />
        <TextInput
          defaultValue={profile?.username}
          dir="ltr"
          label="یوزرنیم"
          name="username"
        />
        <TextInput
          defaultValue={profile?.email}
          dir="ltr"
          label="ایمیل"
          name="email"
          type="email"
        />
      </div>

      <button
        className="mt-6 h-12 rounded-md bg-[#2f5d50] px-7 font-black text-white shadow-lg shadow-[#2f5d50]/20 transition hover:-translate-y-0.5 hover:bg-[#24483e] disabled:cursor-not-allowed disabled:bg-[#9aa9a4] disabled:shadow-none"
        disabled={isSaving || !profile}
        type="submit"
      >
        {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}

function TokenTab({ token }: { token: string }) {
  return (
    <div className="rounded-2xl border border-[#eadccc] bg-[#fffcf8] p-5">
      <p className="mb-3 text-sm font-black text-[#3f3933]">توکن ذخیره شده</p>
      {token ? (
        <code className="block max-h-52 overflow-auto break-all text-left text-xs leading-6 text-[#2f5d50]">
          {token}
        </code>
      ) : (
        <p className="text-sm text-[#a44435]">توکنی پیدا نشد.</p>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#eadccc] bg-[#fffcf8] p-5">
      <p className="text-xs font-bold text-[#8b4f2f]">{label}</p>
      <p className="mt-2 break-words text-xl font-black text-[#1f352e]">
        {value}
      </p>
    </div>
  );
}

function TextInput({
  defaultValue,
  dir = "rtl",
  label,
  name,
  type = "text",
}: {
  defaultValue?: string;
  dir?: "ltr" | "rtl";
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#3f3933]">{label}</span>
      <input
        className={`h-12 w-full rounded-md border border-[#d8c7b4] bg-white px-3 outline-none transition focus:border-[#2f5d50] ${
          dir === "ltr" ? "text-left" : ""
        }`}
        defaultValue={defaultValue}
        dir={dir}
        name={name}
        required
        type={type}
      />
    </label>
  );
}

function formatApiError(detail: ApiErrorDetail) {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item === "string" ? item : item.msg))
      .filter(Boolean)
      .join("، ");
  }

  return "درخواست ناموفق بود.";
}
