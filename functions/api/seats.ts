export interface Env {
  DB: D1Database;
  open: string;
  seats: number;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  let seats = context.env.seats;
  const year = context.env.open.split("-").shift();
  const preReg: Record<string, number> = await context.env.DB.prepare(
    `select count(*) as count, created from walk${year} where ticket in ("event", "combo") and created <= ?`,
  )
    .bind(context.env.open.split("T").shift())
    .first();
  const allReg: Record<string, number> = await context.env.DB.prepare(
    `select count(*) as count from walk${year} where ticket in ("event", "combo")`,
  ).first();

  if (preReg && allReg) {
    const difReg = allReg.count - preReg.count;

    if (difReg < preReg.count) {
      seats += preReg.count - difReg;
    }

    seats -= allReg.count;
  }

  return new Response(JSON.stringify({ seats: seats }), {
    headers: { "Content-Type": "application/json" },
  });
};
