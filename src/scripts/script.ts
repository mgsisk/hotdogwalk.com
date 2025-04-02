import cta from "./component/cta.ts";
import hero from "./component/hero.ts";
import info from "./component/info.ts";
import orders from "./component/orders.ts";
import register from "./component/register.ts";
import seats from "./component/seats.ts";
import shirts from "./component/shirts.ts";
import payment from "./component/payment.js";
import total from "./component/total.js";

const go = () => {
  if (document.readyState === "loading") {
    return document.addEventListener("DOMContentLoaded", go);
  }

  cta();
  hero();
  info();
  orders();
  payment();
  register();
  seats();
  shirts();
  total();
};

go();
