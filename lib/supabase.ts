import { createClient } from "@supabase/supabase-js"

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

// ── Tipos que espelham a tabela PostgreSQL ────────────────────────────────────

export interface OrcamentoDB {
  id:          string
  created_at:  string
  nome_obra:   string
  cliente:     string | null
  status:      string
  valor_total: number | null
  dados:       Record<string, unknown>
}
