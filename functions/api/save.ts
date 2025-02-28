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

type Error = {
  message: string;
};

type Ticket = "combo" | "event" | "voucher" | "shirt";
type Size = "s" | "m" | "l" | "x" | "xx" | "xxx";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const output = {
    message: "Registration data could not be saved, please try again.",
    location: "",
  };
  const now = new Date();
  const year = context.env.open.split("-").shift();

  let access = "general";
  let shirts = formData.get("shirts");
  let shirtc = formData.get("shirtc");

  if (
    parseInt(formData.get("total") as string) > 0 &&
    formData.get("payment-method") === "comp"
  ) {
    output.message = "Processing error, please try again.";
  } else {
    if (formData.get("payment-method") === "comp") {
      const compStr = `${formData.get("fname")}${formData.get("lname")}${now.toTimeString()}`;
      let hash = 0;

      for (let i = 0, len = compStr.length; i < len; i++) {
        const chr = compStr.charCodeAt(i);

        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }

      formData.set("payment-method", `comp_${Math.abs(hash)}`);
    }

    if (formData.get("free2025") && formData.get("vip2025")) {
      access = "super";
    } else if (formData.get("vip2025")) {
      access = "vip";
    } else if (formData.get("free2025")) {
      access = "comp";
    }

    if (["voucher", "shirt"].indexOf(formData.get("ticket") as string) > -1) {
      shirts = "";
      shirtc = "";
    }

    try {
      const insert = await context.env.DB.prepare(
        `insert into walk${year} (created, updated, ticket, access, fname, lname, email, tel, shirts, shirtc, price, donation, total, payment) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)`,
      )
        .bind(
          now.toISOString(),
          "",
          formData.get("ticket"),
          access,
          formData.get("fname"),
          formData.get("lname"),
          formData.get("email"),
          (formData.get("tel") as string).replace(/\D+/g, ""),
          shirts,
          shirtc,
          parseInt(context.env[formData.get("ticket") as Ticket]),
          formData.get("donation"),
          formData.get("total"),
          formData.get("payment-method"),
        )
        .run();

      if (insert.success) {
        let merchQuery = `insert into merch${year} (walker, type, size, color, price, quantity, total) values`;

        for (const field of formData.entries()) {
          if (!field[0].match(/^shirt(s|m|l|x|xx|xxx)-(r|o|b|p)$/)) {
            continue;
          }

          const [size, color] = field[0].replace(/^shirt/, "").split("-");
          const shirtFee = parseInt(context.env[`shirt${size as Size}`]);
          const shirtCount = field[1] as string;
          const shirtTotal = shirtFee * parseInt(shirtCount);

          merchQuery += `, (${insert.meta.last_row_id}, 'shirt', '${size}', '${color}', ${shirtFee}, ${parseInt(shirtCount)}, ${shirtTotal})`;
        }

        if (merchQuery.indexOf("values,") === -1) {
          output.message = "success";
          output.location = `/success?id=${insert.meta.last_row_id}`;
        } else {
          const insertMerch = await context.env.DB.prepare(
            merchQuery.replace("values,", "values"),
          ).run();

          if (insertMerch.success) {
            output.message = "success";
            output.location = `/success?id=${insert.meta.last_row_id}`;
          }
        }
      }
    } catch (e) {
      output.message = (e as Error).message;
    }
  }

  return new Response(JSON.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
};
