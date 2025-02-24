import Stripe from "stripe";

export interface Env {
  DB: D1Database;
  open: string;
  stripe_secret: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const stripe = new Stripe(context.env.stripe_secret);
  const year = context.env.open.split("-").shift();
  const output = {
    message: "Payment could not be processed, please try again.",
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(formData.get("total")) * 100,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      confirm: true,
      currency: "usd",
      description: `HDW ${year} - ${formData.get("fname")} ${formData.get("lname")}`,
      payment_method: formData.get("payment-method"),
    });

    if (paymentIntent.status === "succeeded") {
      output.message = "success";
    }
  } catch (e: any) {
    output.message = e.message;
  }

  return new Response(JSON.stringify(output), {
    headers: { "Content-Type": "application/json" },
  });
};
