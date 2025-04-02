export interface Env {
  DB: D1Database;
  open: string;
  seats: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const seats = parseInt(context.env.seats);
  const year = context.env.open.split("-").shift();
  let red = seats / 4;
  let orange = seats / 4;
  let blue = seats / 4;
  let purple = seats / 4;

  const shirts: Record<string, number> | null = await context.env.DB.prepare(
    `select
      count(case when shirtc = "r" then 1 end) as redTotal,
      count(case when shirtc = "o" then 1 end) as orangeTotal,
      count(case when shirtc = "b" then 1 end) as blueTotal,
      count(case when shirtc = "p" then 1 end) as purpleTotal
    from walk${year} where ticket in ("combo", "event")`,
  ).first();

  if (shirts) {
    red -= shirts.redTotal;
    orange -= shirts.orangeTotal;
    blue -= shirts.blueTotal;
    purple -= shirts.purpleTotal;
  }

  return new Response(
    JSON.stringify({
      red,
      orange,
      blue,
      purple,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
