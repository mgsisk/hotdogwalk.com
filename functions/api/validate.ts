export interface Env {
  DB: D1Database;
  open: string;
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

type Color = "r" | "o" | "b" | "p";
type ShirtSize =
  | "shirts"
  | "shirtm"
  | "shirtl"
  | "shirtx"
  | "shirtxx"
  | "shirtxxx";
type Size = "s" | "m" | "l" | "x" | "xx" | "xxx";
type Ticket = "combo" | "event" | "voucher" | "shirt";

const getTotal = (data: FormData, fees: { [index: string]: number }) => {
  let total = parseInt(data.get("donation") as string);

  if (!data.get("free2025")) {
    total += fees[data.get("ticket") as Ticket];
  }

  for (const field of data.entries()) {
    if (!field[0].match(/^shirt(s|m|l|x|xx|xxx)-(r|o|b|p)$/)) {
      continue;
    }

    total +=
      parseInt(field[1] as string) *
      fees[field[0].split("-").shift() as ShirtSize];
  }

  if (["voucher", "shirt"].indexOf(data.get("ticket") as Ticket) > -1) {
    total -= fees.shirt;
  }

  return total < 0 ? 0 : total;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const output = {
    error: 0,
    total: getTotal(formData, {
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
  };

  if (
    ["shirt", "voucher", "event", "combo"].indexOf(
      formData.get("ticket") as Ticket,
    ) === -1
  ) {
    output.error++;
  }

  if (
    !formData.get("fname") ||
    (formData.get("fname") as string).length > 255
  ) {
    output.error++;
  }

  if (
    !formData.get("lname") ||
    (formData.get("lname") as string).length > 255
  ) {
    output.error++;
  }

  if (
    !formData.get("email") ||
    (formData.get("email") as string).length > 255
  ) {
    output.error++;
  }

  if ((formData.get("tel") as string).replace(/\D+/g, "").length < 10) {
    output.error++;
  }

  if (
    ["combo", "event"].indexOf(formData.get("ticket") as Ticket) > -1 &&
    ["r", "o", "b", "p"].indexOf(formData.get("shirtc") as Color) === -1
  ) {
    output.error++;
  }

  if (
    ["combo", "event"].indexOf(formData.get("ticket") as Ticket) > -1 &&
    ["s", "m", "l", "x", "xx", "xxx"].indexOf(
      formData.get("shirts") as Size,
    ) === -1
  ) {
    output.error++;
  }

  if (["shirt", "voucher"].indexOf(formData.get("ticket") as Ticket) > -1) {
    let minShirt = 1;

    for (const field of formData.entries()) {
      if (field[0].match(/^shirt(s|m|l|x|xx|xxx)-(r|o|b|p)$/)) {
        minShirt = 0;
        break;
      }
    }

    output.error += minShirt;
  }

  if (parseInt(formData.get("donation") as string) < 0) {
    output.error++;
  }

  if (!output.total && !formData.get("free2025")) {
    output.error++;
  }

  return new Response(JSON.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
};
