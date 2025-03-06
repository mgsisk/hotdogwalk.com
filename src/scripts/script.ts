import cta from "./component/cta.ts";
import hero from "./component/hero.ts";
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
  payment();
  register();
  seats();
  shirts();
  total();
};

go();
