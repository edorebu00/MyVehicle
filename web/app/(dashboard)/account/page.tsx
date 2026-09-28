import Link from "next/link";
import { getTranslations } from "next-intl/server";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const t = await getTranslations("account");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">{t("title")}</h1>
      </div>

      <section className="glass-panel space-y-2">
        <p className="label">{t("emailLabel")}</p>
        <p className="text-sm text-graphite-900">{user?.email}</p>
        <p className="pt-2 text-sm text-graphite-600">
          {t.rich("privacyText", {
            link: (chunks) => (
              <Link href="/privacy" className="font-medium text-brand-600 hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>

      <section className="glass-panel space-y-3 border-red-500/20">
        <h2 className="text-lg font-semibold text-graphite-900">{t("deleteTitle")}</h2>
        <p className="text-sm text-graphite-600">{t("deleteText")}</p>
        <DeleteAccountButton />
      </section>
    </div>
  );
}
