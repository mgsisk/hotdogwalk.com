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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const fees = {
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
  };
  const output = {
    error: 0,
    total: parseInt(formData.get("donation")),
  };

  if (!formData.get("free2025")) {
    output.total += fees[formData.get("ticket")];
  }

  for (const field of formData.entries()) {
    if (!field[0].match(/^shirt(s|m|l|x|xx|xxx)\-(r|o|b|p)$/)) {
      continue;
    }

    output.total += parseInt(field[1]) * fees[field[0].split("-").shift()];
  }

  if (["voucher", "shirt"].indexOf(formData.get("ticket")) > -1) {
    output.total -= fees.shirt;
  }

  if (output.total < 0) {
    output.total = 0;
  }

  if (
    ["shirt", "voucher", "event", "combo"].indexOf(formData.get("ticket")) ===
    -1
  ) {
    output.error++;
  }

  if (!formData.get("fname") || formData.get("fname").length > 255) {
    output.error++;
  }

  if (!formData.get("lname") || formData.get("lname").length > 255) {
    output.error++;
  }

  if (!formData.get("email") || formData.get("email").length > 255) {
    output.error++;
  }

  if (formData.get("tel").replace(/\D+/g, "").length < 10) {
    output.error++;
  }

  if (
    ["combo", "event"].indexOf(formData.get("ticket")) > -1 &&
    ["r", "o", "b", "p"].indexOf(formData.get("shirtc")) === -1
  ) {
    output.error++;
  }

  if (
    ["combo", "event"].indexOf(formData.get("ticket")) > -1 &&
    ["s", "m", "l", "x", "xx", "xxx"].indexOf(formData.get("shirts")) === -1
  ) {
    output.error++;
  }

  if (["shirt", "voucher"].indexOf(formData.get("ticket")) > -1) {
    let minShirt = 1;

    for (const field of formData.entries()) {
      if (field[0].match(/^shirt(s|m|l|x|xx|xxx)\-(r|o|b|p)$/)) {
        minShirt = 0;
        break;
      }
    }

    output.error += minShirt;
  }

  if (parseInt(formData.get("donation")) < 0) {
    output.error++;
  }

  if (!output.total && !formData.get("free2025")) {
    output.error++;
  }

  return new Response(JSON.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
};
