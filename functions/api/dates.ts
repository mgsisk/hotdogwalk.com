export interface Env {
  open: string;
  close: string;
  walk: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) =>
  new Response(
    JSON.stringify({
      open: context.env.open,
      close: context.env.close,
      walk: context.env.walk,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
