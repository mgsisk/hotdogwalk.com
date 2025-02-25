import { Resend } from "resend";

export interface Env {
  DB: D1Database;
  open: string;
  resend_key: string;
}

const sendMail = async (
  walker: Record<string, unknown>,
  merch: Record<string, unknown>[],
  resend: Resend,
): Promise<boolean> => {
  try {
    let message = `<p>Hi ${walker.fname},</p>`;

    const tickets = {
      shirt: "Shirt Only",
      voucher: "Voucher Only",
      event: "Event Only",
      combo: "Combo Meal",
    };
    const colors = {
      r: "Red",
      o: "Orange",
      b: "Blue",
      p: "Purple",
    };
    const sizes = {
      s: "Small",
      m: "Medium",
      l: "Large",
      x: "X-Large",
      xx: "XX-Large",
      xxx: "XXX-Large",
    };

    message += `<p>Thank you for registering for the 2025 Kalamazoo Hot Dog Walk!</p>`;

    if (["shirt", "voucher"].indexOf(walker.ticket as string) > -1) {
      message +=
        "<p>Pickup begins at noon on Thursday, May 22 at <a href='https://maps.app.goo.gl/J2pQm6g6UECT8dPY7'>Kalamazoo Loaves and Fishes</a> or any day after during their normal business hours.</p>";
    } else {
      message +=
        "<p>Please take a moment to read this important information:</p>";
      message += "<ul>";
      message +=
        "<li>Check-in starts at 1 p.m., with the event starting promptly at 1:30 p.m. on Friday, May 23, rain or shine at <a href='https://maps.app.goo.gl/TxhqLBQFVdM7UvRXA'>Shakespeare's Pub</a>. Please note that we cannot accommodate late arrivals. Here, you will pick up your shirt and board the bus.</li>";
      message +=
        "<li>An ending time is difficult to predict, but we expect to finish around 5:30 p.m. We ask that you be on time for the start and flexible about the finish.</li>";
      message +=
        "<li>Remember, you'll need to be available for the entire afternoon; you may not join the event in progress or leave early.</li>";
      message +=
        "<li>We recommend you bring a full, refillable water bottle. Fresh water will be provided throughout the event.</li>";
      message +=
        "<li>Should you become unavailable for the event, email <a href='mailto:info@hotdogwalk.com'>info@hotdogwalk.com</a> as early as possible. Remember, payments are nonrefundable, but you are still welcome to pick up your shirt at a later date if you cannot attend. <strong>Do not simply no-show the event. We're nice people who care about you and worry if we don't hear from you.</strong></li>";
      message += "</ul>";
      message += "<p>We look forward to seeing you on Friday, May 23!</p>";
    }

    message +=
      "<p>Don't hesitate to <a href='mailto:info@hotdogwalk.com'>email us</a> with any questions.</p>";
    message += "<p>Thanks,</p>";
    message += "<p>The Kalamazoo Hot Dog Walk Committee</p>";
    message += "<hr><h1>Registration Info</h1><table>";
    message += `<tr><th style="text-align:left">Name</th><td>${walker.fname} ${walker.lname}</td></tr>`;
    message += `<tr><th style="text-align:left">Email</th><td><a href="mailto:${walker.email}">${walker.email}</a></td></tr>`;
    message += `<tr><th style="text-align:left">Phone</th><td><a href="tel:${walker.tel}">${(walker.tel as string).replace(/(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")}</a></td></tr>`;
    message += `<tr><th style="text-align:left">Registered For</th><td>${tickets[walker.ticket as string]}</td></tr>`;
    message += `<tr><th style="text-align:left">Registered On</th><td>${new Date(walker.created as string).toLocaleDateString("en-US")}</td></tr>`;
    message += "</table>";

    if (["event", "combo"].indexOf(walker.ticket as string) > -1) {
      message += "<h2>Dogs</h2>";
      message +=
        "<p>Your registration includes one hot dog at each stop chosen from a selection of the best dogs each partner restaurant has to offer, or you can request a custom dog at any stop during the event if none of the prepared dogs work for you.</p>";
    }

    if (["voucher", "combo"].indexOf(walker.ticket as string) > -1) {
      message += "<h2>Voucher Book</h2>";
      message +=
        "<p>Your registration includes a voucher book good for one hot dog at each partner restaurant, redeemable throughout the year.</p>";
    }

    message += "<h2>Shirts</h2><table>";

    if (["event", "combo"].indexOf(walker.ticket as string) > -1) {
      message += `<tr><th style="text-align:left">For the Walk</th><td>${sizes[walker.shirts as string]}</td><td>${colors[walker.shirtc as string]}</td></tr>`;
    }

    merch.forEach((shirt) => {
      message += `<tr><th style="text-align:left">${shirt.quantity}</th><td>${sizes[shirt.size as string]}</td><td>${colors[shirt.color as string]}</td></tr>`;
    });

    message += "</table>";

    if (walker.donation) {
      message += `<h2>Donation</h2><p>Thank you for your \$${walker.donation} to Kalamazoo Loaves &amp; Fishes!</p>`;
    }

    const send = await resend.emails.send({
      from: "Kalamazoo Hot Dog Walk <info@hotdogwalk.com>",
      to: walker.email as string,
      subject: "Registration Complete",
      html: message,
    });

    return !send.error;
  } catch (e: any) {
    return false;
  }
};

export const onRequestGet: PagesFunction<Env> = async (
  context,
): Promise<Response> => {
  let sent = true;
  const year = context.env.open.split("-").shift();
  const walker = await context.env.DB.prepare(
    `select * from walk${year} where id = ?`,
  )
    .bind(context.params.id)
    .first();

  if (walker && !walker.updated) {
    const { results = [] } = await context.env.DB.prepare(
      `select * from merch${year} where walker = ? order by quantity desc`,
    )
      .bind(context.params.id)
      .all();

    sent = await sendMail(walker, results, new Resend(context.env.resend_key));

    if (sent) {
      await context.env.DB.prepare(
        `update walk${year} set updated = ?1 where id = ?2`,
      )
        .bind(new Date().toISOString(), context.params.id)
        .run();
    }
  }

  return new Response(JSON.stringify({ sent: sent }), {
    headers: { "Content-Type": "application/json" },
  });
};
