import Link from "next/link";

const stats = [
  { label: "Backend", value: "FastAPI" },
  { label: "Frontend", value: "Next.js" },
  { label: "Auth", value: "JWT" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#201c18]">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-8 inline-flex rounded-full border border-[#d8c7b4] bg-white/75 px-4 py-2 text-sm font-bold text-[#8b4f2f] shadow-sm">
            FastAPI Auth Panel
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#1f352e] sm:text-5xl lg:text-6xl">
            ورود و ثبت نام با ظاهر حرفه ای تر
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-9 text-[#62584f]">
            این فرانت اند به بک اند FastAPI وصل است، توکن JWT دریافت می کند و
            بعد از ورود موفق کاربر را به داشبورد می برد.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#2f5d50] px-6 font-bold text-white shadow-lg shadow-[#2f5d50]/20 transition hover:-translate-y-0.5 hover:bg-[#24483e]"
            >
              ساخت حساب جدید
            </Link>
            <Link
              href="/signin"
              className="inline-flex h-12 items-center justify-center rounded-md border border-[#c9b8a5] bg-white px-6 font-bold text-[#2f5d50] transition hover:-translate-y-0.5 hover:border-[#2f5d50]"
            >
              ورود به حساب
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map((item) => (
              <div
                className="rounded-lg border border-[#ddcdbc] bg-white/80 p-4 shadow-sm"
                key={item.label}
              >
                <p className="text-xs font-bold text-[#8b4f2f]">{item.label}</p>
                <p className="mt-2 text-lg font-black text-[#1f352e]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-[32px] bg-[#2f5d50] opacity-10 blur-2xl" />
          <div className="relative rounded-[28px] border border-[#ddcdbc] bg-white p-4 shadow-2xl shadow-[#5f4b3a]/10">
            <img
              alt="Authentication dashboard visual"
              className="h-auto w-full rounded-[20px]"
              src="/auth-visual.svg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
