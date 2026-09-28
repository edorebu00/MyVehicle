-- My Vehicle - cancellazione del proprio account (diritto alla cancellazione, art. 17 GDPR)
--
-- L'app non usa la service_role key, quindi il browser non puo' eliminare un utente di
-- auth.users: lo fa questa funzione, che gira con i privilegi del proprietario ma agisce
-- soltanto su auth.uid(), cioe' su chi la chiama. Tutte le tabelle dell'app referenziano
-- auth.users con "on delete cascade", quindi profilo, veicoli, sezioni, documenti, ricerche
-- e chat spariscono con l'utente.
--
-- I file nei bucket NON vengono toccati qui: Supabase non consente di cancellarli con SQL,
-- vanno rimossi con l'API Storage. Li rimuove il client (components/DeleteAccountButton.tsx)
-- prima di chiamare questa funzione. Il client la chiama prima con dry_run = true: se la
-- migrazione non e' stata applicata la chiamata fallisce e nessun file viene rimosso.

create or replace function public.delete_own_account(dry_run boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if dry_run then
    return;
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account(boolean) from public, anon;
grant execute on function public.delete_own_account(boolean) to authenticated;
