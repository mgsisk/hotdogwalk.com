export interface Env {
  DB: D1Database;
  open: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  let output: string = "";
  const year = context.env.open.split("-").shift();

  const { results = [] } = await context.env.DB.prepare(
    `select id from walk${year} where updated = ""`,
  ).all();
  results.forEach(
    (value) =>
      (output += `<a href="/api/success/${value.id}">${value.id}</a><br>`),
  );

  return new Response(output, { headers: { "Content-Type": "text/html" } });
};
