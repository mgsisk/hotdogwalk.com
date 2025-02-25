import cta from "./part/cta.ts";
import hero from "./part/hero.ts";
import register from "./part/register.ts";
import seats from "./part/seats.ts";
import shirts from "./part/shirts.ts";
import payment from "./part/payment.js";
import total from "./part/total.js";

const go = () => {
  if (document.readyState === "loading") {
    return document.addEventListener("DOMContentLoaded", go);
  }

  cta();
  hero();
  payment();
  register();
  seats();
  shirts();
  total();
};

go();
