create table if not exists quotes (
  id text primary key,
  name text not null default '',
  company text not null default '',
  phone text not null default '',
  peca text not null default '',
  color text not null default '',
  technique text not null default '',
  qty integer not null default 0,
  notes text not null default '',
  status text not null default 'novo',
  created_at timestamptz not null default now()
);

create index if not exists quotes_created_at_idx on quotes (created_at desc);
