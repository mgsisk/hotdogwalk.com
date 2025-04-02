export interface Env {
  DB: D1Database;
  open: string;
  seats: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  let seats = parseInt(context.env.seats);
  const year = context.env.open.split("-").shift();
  const count: Record<string, number> | null = await context.env.DB.prepare(
    `select count() as total from walk${year} where ticket in ("combo", "event")`,
  ).first();

  if (count && count.total) {
    seats -= count.total;
  }

  return new Response(JSON.stringify({ seats: seats }), {
    headers: { "Content-Type": "application/json" },
  });
};
