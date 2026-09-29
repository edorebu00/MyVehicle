-- My Vehicle - rafforzamento della Row Level Security
-- Da eseguire nel SQL editor di Supabase (o via `supabase db push`)
--
-- 0001 e 0002 abilitano gia' la RLS su tutte le tabelle di `public`. Questa migrazione:
--  1. forza la RLS anche per il proprietario della tabella (difesa in profondita');
--  2. toglie al ruolo `anon` (chiave pubblica NEXT_PUBLIC_SUPABASE_ANON_KEY) ogni privilegio
--     sulle tabelle: l'app funziona sempre con un utente autenticato, quindi non serve;
--  3. chiude la scrittura su `engine_variants_cache`: oggi qualunque utente registrato puo'
--     inserire righe (cache avvelenabile) e nessuna route del codice la usa.
-- Idempotente: si puo' rieseguire senza effetti collaterali.

-- 1. RLS forzata -------------------------------------------------------------
alter table public.profiles              force row level security;
alter table public.vehicles              force row level security;
alter table public.vehicle_sections      force row level security;
alter table public.section_images        force row level security;
alter table public.search_results        force row level security;
alter table public.documents             force row level security;
alter table public.chat_messages         force row level security;
alter table public.engine_variants_cache force row level security;

-- 2. Nessun accesso per `anon` -------------------------------------------------
revoke all on all tables    in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

-- Le tabelle create in futuro non devono ereditare i privilegi per `anon`.
alter default privileges in schema public revoke all on tables    from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;

-- 3. Cache motorizzazioni: sola lettura per gli utenti ---------------------------
drop policy if exists "engine_variants_cache: scrittura per utenti autenticati" on public.engine_variants_cache;
revoke insert, update, delete on public.engine_variants_cache from authenticated;

-- 4. Trigger di registrazione: non deve essere invocabile via API -----------------
revoke execute on function public.handle_new_user() from public, anon, authenticated;
