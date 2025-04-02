export interface Env {
  DB: D1Database;
  open: string;
}

type Access = "super" | "vip" | "comp" | "general";
type Color = "r" | "o" | "b" | "p";
type Size = "s" | "m" | "l" | "x" | "xx" | "xxx";
type Ticket = "combo" | "event" | "voucher" | "shirt";
type Type = "shirt";

type Walker = {
  id: number; // auto increment
  created: string;
  update: string;
  ticket: Ticket;
  access: Access;
  fname: string;
  lname: string;
  email: string;
  tel: string;
  shirts: Size;
  shirtc: Color;
  price: number;
  donation: number;
  total: number;
  payment: number;
};

type Merch = {
  id: number;
  walker: number;
  type: Type;
  size: Size;
  color: Color;
  price: number;
  quantity: number;
  total: number;
};

type Order = {
  id: number;
  fname: string;
  lname: string;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const year = context.env.open.split("-").shift();
  const walkers = (
    await context.env.DB.prepare(
      `select id, ticket, access, fname, lname, shirts, shirtc, price, donation, total from walk${year}`,
    ).all()
  ).results;
  const merch = (
    await context.env.DB.prepare(
      `select size, color, price, quantity, total from merch${year}`,
    ).all()
  ).results;
  const orders: Order[] = [];
  const shirts = {
    s: { r: 0, o: 0, b: 0, p: 0 },
    m: { r: 0, o: 0, b: 0, p: 0 },
    l: { r: 0, o: 0, b: 0, p: 0 },
    x: { r: 0, o: 0, b: 0, p: 0 },
    xx: { r: 0, o: 0, b: 0, p: 0 },
    xxx: { r: 0, o: 0, b: 0, p: 0 },
  };

  walkers.forEach((walker) => {
    orders.push({
      id: (walker as Walker).id,
      fname: (walker as Walker).fname,
      lname: (walker as Walker).lname,
    });

    if (!walker.shirts || !walker.shirtc) {
      return;
    }

    shirts[(walker as Walker).shirts][(walker as Walker).shirtc]++;
  });

  merch.forEach((merch) => {
    shirts[(merch as Merch).size][(merch as Merch).color] += (
      merch as Merch
    ).quantity;
  });

  return new Response(
    JSON.stringify({
      walkers: {
        total: walkers.length,
        event: walkers.reduce((sum, walker) => {
          if (["combo", "event"].indexOf((walker as Walker).ticket) !== -1) {
            sum++;
          }

          return sum;
        }, 0),
        vouchers: walkers.reduce((sum, walker) => {
          if (["combo", "voucher"].indexOf((walker as Walker).ticket) !== -1) {
            sum++;
          }

          return sum;
        }, 0),
        donations: walkers.reduce(
          (sum, walker) => (sum += (walker as Walker).donation),
          0,
        ),
        comps: walkers.reduce((sum, walker) => {
          if (["super", "comp"].indexOf((walker as Walker).access) !== -1) {
            sum += (walker as Walker).price;
          }

          return sum;
        }, 0),
        payout: (
          walkers.reduce((sum, walker) => sum + (walker as Walker).total, 0) *
            0.971 -
          walkers.filter((walker) => walker.total !== 0).length * 0.3
        ).toFixed(2),
      },
      shirts,
      orders,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
