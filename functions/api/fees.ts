export interface Env {
  combo: number;
  event: number;
  voucher: number;
  shirt: number;
  shirts: number;
  shirtm: number;
  shirtl: number;
  shirtx: number;
  shirtxx: number;
  shirtxxx: number;
}

export const onRequestGet: PagesFunction<Env> = async (context) =>
  new Response(
    JSON.stringify({
      combo: context.env.combo,
      event: context.env.event,
      voucher: context.env.voucher,
      shirt: context.env.shirt,
      shirts: context.env.shirts,
      shirtm: context.env.shirtm,
      shirtl: context.env.shirtl,
      shirtx: context.env.shirtx,
      shirtxx: context.env.shirtxx,
      shirtxxx: context.env.shirtxxx,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
