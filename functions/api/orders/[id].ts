export interface Env {
  DB: D1Database;
  open: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const year = context.env.open.split("-").shift();
  const walker = await context.env.DB.prepare(
    `select ticket, access, fname, lname, shirts, shirtc, price, donation from walk${year} where id = ?`,
  )
    .bind(context.params.id)
    .first();

  let error = true;

  if (walker) {
    error = false;

    walker.merch = (
      await context.env.DB.prepare(
        `select size, color, quantity from merch${year} where walker = ?`,
      )
        .bind(context.params.id)
        .all()
    ).results;
  }

  return new Response(JSON.stringify({ walker, error }), {
    headers: { "Content-Type": "application/json" },
  });
};
