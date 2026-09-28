import Link from "next/link";
import { getTranslations } from "next-intl/server";
import PublicHeader from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations("privacy");

  return (
    <div className="min-h-screen">
      <PublicHeader loggedIn={!!user} />
      {children}
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-xs text-graphite-500">
        <Link href="/privacy" className="hover:text-graphite-900 hover:underline">
          {t("footerLink")}
        </Link>
      </footer>
    </div>
  );
}
