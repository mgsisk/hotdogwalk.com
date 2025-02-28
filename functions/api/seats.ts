export interface Env {
  DB: D1Database;
  open: string;
  seats: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  let seats = parseInt(context.env.seats);
  const year = context.env.open.split("-").shift();
  const count: Record<string, number> | null = await context.env.DB.prepare(
    `select count() as total, count(case when created <= ? then 1 end) as pre from walk${year}`,
  )
    .bind(context.env.open.split("T").shift())
    .first();

  if (count && count.total) {
    if (count.pre) {
      const difReg = count.total - count.pre;

      if (difReg < count.pre) {
        seats += count.pre - difReg;
      }
    }

    seats -= count.total;
  }

  return new Response(JSON.stringify({ seats: seats }), {
    headers: { "Content-Type": "application/json" },
  });
};
