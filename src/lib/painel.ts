import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@novaarte.com.br";

export type QuoteRow = {
  id: string;
  name: string;
  company: string;
  phone: string;
  peca: string;
  color: string;
  technique: string;
  qty: number;
  status: string;
  notes: string;
  created_at: string;
};

async function assertAdmin(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ email: string }>`
    select email from "user" where id = ${userId} limit 1
  `;
  const email = rows[0]?.email?.toLowerCase();
  if (email !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error("Sem permissão para o painel.");
  }
  return email;
}

function asIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

export const ensureAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const email = (process.env.ADMIN_EMAIL ?? "admin@novaarte.com.br").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "NovaArte10";
  const sql = await getSql();
  const existing = await sql<{ id: string }>`
    select id from "user" where email = ${email} limit 1
  `;
  if (existing.length) return { created: false as const };

  const { auth } = await import("@/lib/auth/server");
  await auth.api.signUpEmail({
    body: { email, password, name: "Nova Arte" },
  });
  return { created: true as const };
});

export const listQuotes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      company: string;
      phone: string;
      peca: string;
      color: string;
      technique: string;
      qty: number;
      status: string;
      notes: string;
      created_at: unknown;
    }>`
      select id, name, company, phone, peca, color, technique, qty, status, notes, created_at
      from quotes
      order by created_at desc
      limit 80
    `;
    return rows.map((row) => ({
      ...row,
      created_at: asIso(row.created_at),
    })) satisfies QuoteRow[];
  });

const quoteInput = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  peca: z.string().optional(),
  color: z.string().optional(),
  technique: z.string().optional(),
  qty: z.number().optional(),
  notes: z.string().optional(),
});

export const saveQuote = createServerFn({ method: "POST" })
  .validator(quoteInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = uid("orc");
    await sql`
      insert into quotes (id, name, company, phone, peca, color, technique, qty, notes)
      values (
        ${id},
        ${data.name ?? ""},
        ${data.company ?? ""},
        ${data.phone ?? ""},
        ${data.peca ?? ""},
        ${data.color ?? ""},
        ${data.technique ?? ""},
        ${data.qty ?? 0},
        ${data.notes ?? ""}
      )
    `;
    return { id };
  });
