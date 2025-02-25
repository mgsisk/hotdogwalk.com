export interface Env {
  combo: string;
  event: string;
  voucher: string;
  shirt: string;
  shirts: string;
  shirtm: string;
  shirtl: string;
  shirtx: string;
  shirtxx: string;
  shirtxxx: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) =>
  new Response(
    JSON.stringify({
      combo: parseInt(context.env.combo),
      event: parseInt(context.env.event),
      voucher: parseInt(context.env.voucher),
      shirt: parseInt(context.env.shirt),
      shirts: parseInt(context.env.shirts),
      shirtm: parseInt(context.env.shirtm),
      shirtl: parseInt(context.env.shirtl),
      shirtx: parseInt(context.env.shirtx),
      shirtxx: parseInt(context.env.shirtxx),
      shirtxxx: parseInt(context.env.shirtxxx),
    }),
    { headers: { "Content-Type": "application/json" } },
  );
