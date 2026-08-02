-- MetaFit — schema inicial do Supabase
-- Rode este script inteiro no SQL Editor do Supabase (projeto novo "metafit")

-- 1. Perfil do usuário (dados do onboarding + metas calculadas)
create table if not exists perfis (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  idade int,
  sexo text,
  altura numeric,
  peso numeric,
  peso_meta numeric,
  objetivo text,
  nivel_atividade text,
  dias_treino int,
  tempo_treino text,
  local_treino text,
  equipamentos text,
  meta_calorias int,
  meta_proteina int,
  meta_carboidrato int,
  meta_gordura int,
  criado_em timestamptz default now()
);

alter table perfis enable row level security;

create policy "usuarios podem gerenciar seu proprio perfil"
  on perfis for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Refeições (diário alimentar)
create table if not exists refeicoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  categoria text not null,
  nome text not null,
  horario text,
  calorias numeric default 0,
  proteina numeric default 0,
  carboidrato numeric default 0,
  gordura numeric default 0,
  data date default current_date,
  criado_em timestamptz default now()
);

alter table refeicoes enable row level security;

create policy "usuarios podem gerenciar suas proprias refeicoes"
  on refeicoes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Treinos (planejado + histórico)
create table if not exists treinos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nome text not null,
  grupo_muscular text,
  exercicios jsonb not null default '[]',
  duracao_estimada int,
  status text default 'planejado',
  duracao_real int,
  dificuldade text,
  sensacao text,
  observacoes text,
  data date default current_date,
  criado_em timestamptz default now()
);

alter table treinos enable row level security;

create policy "usuarios podem gerenciar seus proprios treinos"
  on treinos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Evolução de peso
create table if not exists peso_historico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  peso numeric not null,
  data date default current_date,
  criado_em timestamptz default now()
);

alter table peso_historico enable row level security;

create policy "usuarios podem gerenciar seu proprio historico de peso"
  on peso_historico for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Medidas corporais
create table if not exists medidas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  braco numeric, peito numeric, cintura numeric,
  quadril numeric, coxa numeric, panturrilha numeric,
  data date default current_date,
  criado_em timestamptz default now()
);

alter table medidas enable row level security;

create policy "usuarios podem gerenciar suas proprias medidas"
  on medidas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Metas
create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  label text not null,
  atual numeric,
  alvo numeric,
  unidade text,
  criado_em timestamptz default now()
);

alter table metas enable row level security;

create policy "usuarios podem gerenciar suas proprias metas"
  on metas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
