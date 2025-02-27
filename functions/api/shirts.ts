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
      count(case when shirtc = "r" and created <= ?1 then 1 end) as redPre,
      count(case when shirtc = "o" then 1 end) as orangeTotal,
      count(case when shirtc = "o" and created <= ?1 then 1 end) as orangePre,
      count(case when shirtc = "b" then 1 end) as blueTotal,
      count(case when shirtc = "b" and created <= ?1 then 1 end) as bluePre,
      count(case when shirtc = "p" then 1 end) as purpleTotal,
      count(case when shirtc = "p" and created <= ?1 then 1 end) as purplePre
    from walk${year}`,
  )
    .bind(context.env.open.split("T").shift())
    .first();

  if (shirts) {
    if (shirts.redPre) {
      const difRedShirt = shirts.redTotal - shirts.redPre;

      if (difRedShirt < shirts.redPre) {
        red += shirts.redPre - difRedShirt;
      }
    }

    red -= shirts.redTotal;

    if (shirts.orangePre) {
      const difOrangeShirt = shirts.orangeTotal - shirts.orangePre;

      if (difOrangeShirt < shirts.orangePre) {
        orange += shirts.orangePre - difOrangeShirt;
      }
    }

    orange -= shirts.orangeTotal;

    if (shirts.bluePre) {
      const difBlueShirt = shirts.blueTotal - shirts.bluePre;

      if (difBlueShirt < shirts.bluePre) {
        blue += shirts.bluePre - difBlueShirt;
      }
    }

    blue -= shirts.blueTotal;

    if (shirts.purplePre) {
      const difPurpleShirt = shirts.purpleTotal - shirts.purplePre;

      if (difPurpleShirt < shirts.purplePre) {
        purple += shirts.purplePre - difPurpleShirt;
      }
    }

    purple -= shirts.purpleTotal;
  }

  return new Response(
    JSON.stringify({
      red: red,
      orange: orange,
      blue: blue,
      purple: purple,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
