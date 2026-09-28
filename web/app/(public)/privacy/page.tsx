import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Section = { title: string; paragraphs: string[] };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return { title: `${t("title")} · MyVehicle` };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as Section[];
  // Indirizzo di contatto del titolare: sta in una variabile d'ambiente perche' il repository e'
  // pubblico e l'indirizzo non va scritto nel codice.
  const contact = process.env.PRIVACY_CONTACT_EMAIL?.trim();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">{t("title")}</h1>
      <p className="mt-2 text-sm text-graphite-500">{t("lastUpdated")}</p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-graphite-900">{t("contactTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-graphite-600">{t("contactText")}</p>
        <p className="mt-2 text-sm text-graphite-900">
          {contact ? (
            <a href={`mailto:${contact}`} className="font-medium text-brand-600 hover:underline">
              {contact}
            </a>
          ) : (
            t("contactMissing")
          )}
        </p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="text-lg font-semibold text-graphite-900">{section.title}</h2>
          {section.paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-2 text-sm leading-relaxed text-graphite-600">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
