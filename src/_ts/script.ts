import cta from "./part/cta.ts";
import hero from "./part/hero.ts";
import register from "./part/register.ts";
import seats from "./part/seats.ts";
import shirts from "./part/shirts.ts";
import payment from "./part/payment.js";
import total from "./part/total.js";

const go = () => {
  cta();
  hero();
  payment();
  register();
  seats();
  shirts();
  total();
};

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", go)
  : go();
