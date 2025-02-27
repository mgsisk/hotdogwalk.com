export interface Env {
  DB: D1Database;
  open: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const year = context.env.open.split("-").shift();
  const row = await context.env.DB.prepare(
    `select created from walk${year} where email = ?`,
  )
    .bind(context.params.address)
    .first();

  return new Response(JSON.stringify({ date: row ? row.created : false }), {
    headers: { "Content-Type": "application/json" },
  });
};
