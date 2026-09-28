"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

// L'API Storage accetta liste di percorsi: a blocchi si evita una singola richiesta enorme per chi
// ha caricato centinaia di file.
const REMOVE_CHUNK = 100;

export default function DeleteAccountButton() {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("account");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function removeAll(bucket: "vehicle-files" | "vehicle-images", paths: string[]) {
    for (let i = 0; i < paths.length; i += REMOVE_CHUNK) {
      const { error } = await supabase.storage.from(bucket).remove(paths.slice(i, i + REMOVE_CHUNK));
      if (error) return error;
    }
    return null;
  }

  async function handleDelete() {
    if (!window.confirm(t("deleteConfirm"))) return;

    setDeleting(true);
    setError(null);

    function fail(message: string) {
      setError(t("deleteError", { message }));
      setDeleting(false);
    }

    // Prova a vuoto: se la funzione di cancellazione non esiste (migrazione 0005 non applicata)
    // ci si ferma qui, prima di aver rimosso un solo file.
    const { error: probeError } = await supabase.rpc("delete_own_account", { dry_run: true });
    if (probeError) return fail(probeError.message);

    // Le righe del database spariscono in cascata con l'utente, gli oggetti nei bucket no: vanno
    // rimossi prima, finche' le righe che ne conservano i percorsi esistono ancora. Le policy RLS
    // limitano entrambe le letture ai dati di chi e' collegato.
    const { data: documents, error: documentsError } = await supabase.from("documents").select("storage_path");
    if (documentsError) return fail(documentsError.message);

    const { data: images, error: imagesError } = await supabase.from("section_images").select("storage_path");
    if (imagesError) return fail(imagesError.message);

    const filePaths = (documents || []).map((d) => d.storage_path).filter(Boolean) as string[];
    const imagePaths = (images || []).map((i) => i.storage_path).filter(Boolean) as string[];

    const filesError = await removeAll("vehicle-files", filePaths);
    if (filesError) return fail(filesError.message);

    const imagesRemoveError = await removeAll("vehicle-images", imagePaths);
    if (imagesRemoveError) return fail(imagesRemoveError.message);

    const { error: deleteError } = await supabase.rpc("delete_own_account", { dry_run: false });
    if (deleteError) return fail(deleteError.message);

    // L'utente non esiste piu': la sessione nel browser va chiusa comunque, anche se il server
    // non riconosce piu' il token e risponde con un errore.
    await supabase.auth.signOut().catch(() => undefined);
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="btn-secondary border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
      >
        {deleting ? t("deleting") : t("deleteButton")}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
