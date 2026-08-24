import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-10 text-[#211d1a]">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center gap-10">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold text-[#8b4f2f]">
            FastAPI + Next.js
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            ورود و ثبت نام کاربران
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5f554c]">
            این پنل به بک اند FastAPI وصل است و برای ساخت کاربر جدید یا گرفتن
            توکن ورود استفاده می شود.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/signup"
            className="rounded-lg border border-[#d8c7b4] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8875d] hover:shadow-md"
          >
            <span className="text-sm font-semibold text-[#8b4f2f]">
              ساخت حساب
            </span>
            <h2 className="mt-3 text-2xl font-bold">Signup</h2>
            <p className="mt-3 leading-7 text-[#6b6057]">
              نام، یوزرنیم، ایمیل و پسورد را وارد کن و توکن بگیر.
            </p>
          </Link>

          <Link
            href="/signin"
            className="rounded-lg border border-[#d8c7b4] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8875d] hover:shadow-md"
          >
            <span className="text-sm font-semibold text-[#8b4f2f]">ورود</span>
            <h2 className="mt-3 text-2xl font-bold">Signin</h2>
            <p className="mt-3 leading-7 text-[#6b6057]">
              با یوزرنیم و پسورد قبلی وارد شو و توکن جدید دریافت کن.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
