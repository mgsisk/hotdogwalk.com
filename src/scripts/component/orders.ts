type ShirtColors = {
  r: number;
  o: number;
  b: number;
  p: number;
};
type FetchedData = {
  walkers: {
    total: number;
    event: number;
    vouchers: number;
    donations: number;
    comps: number;
    payout: number;
  };
  shirts: {
    s: ShirtColors;
    m: ShirtColors;
    l: ShirtColors;
    x: ShirtColors;
    xx: ShirtColors;
    xxx: ShirtColors;
  };
  orders: {
    id: number;
    fname: string;
    lname: string;
  }[];
};

const go = (data: FetchedData) => {
  const orderSummaryCells: NodeList = document.querySelectorAll(
    "#order-summary tbody td",
  );
  const shirtSummaryCells: NodeList = document.querySelectorAll(
    "#shirt-summary tbody td",
  );
  const orderList: HTMLUListElement | null =
    document.querySelector("#order-individuals");

  orderSummaryCells[0].textContent = data.walkers.total.toString();
  orderSummaryCells[1].textContent = data.walkers.event.toString();
  orderSummaryCells[2].textContent = data.walkers.vouchers.toString();
  orderSummaryCells[3].textContent = "$" + data.walkers.donations.toString();
  orderSummaryCells[4].textContent = "$" + data.walkers.comps.toString();
  orderSummaryCells[5].textContent = "$" + data.walkers.payout.toString();

  shirtSummaryCells[0].textContent = data.shirts.s.r.toString();
  shirtSummaryCells[1].textContent = data.shirts.s.o.toString();
  shirtSummaryCells[2].textContent = data.shirts.s.b.toString();
  shirtSummaryCells[3].textContent = data.shirts.s.p.toString();

  shirtSummaryCells[4].textContent = data.shirts.m.r.toString();
  shirtSummaryCells[5].textContent = data.shirts.m.o.toString();
  shirtSummaryCells[6].textContent = data.shirts.m.b.toString();
  shirtSummaryCells[7].textContent = data.shirts.m.p.toString();

  shirtSummaryCells[8].textContent = data.shirts.l.r.toString();
  shirtSummaryCells[9].textContent = data.shirts.l.o.toString();
  shirtSummaryCells[10].textContent = data.shirts.l.b.toString();
  shirtSummaryCells[11].textContent = data.shirts.l.p.toString();

  shirtSummaryCells[12].textContent = data.shirts.x.r.toString();
  shirtSummaryCells[13].textContent = data.shirts.x.o.toString();
  shirtSummaryCells[14].textContent = data.shirts.x.b.toString();
  shirtSummaryCells[15].textContent = data.shirts.x.p.toString();

  shirtSummaryCells[16].textContent = data.shirts.xx.r.toString();
  shirtSummaryCells[17].textContent = data.shirts.xx.o.toString();
  shirtSummaryCells[18].textContent = data.shirts.xx.b.toString();
  shirtSummaryCells[19].textContent = data.shirts.xx.p.toString();

  shirtSummaryCells[20].textContent = data.shirts.xxx.r.toString();
  shirtSummaryCells[21].textContent = data.shirts.xxx.o.toString();
  shirtSummaryCells[22].textContent = data.shirts.xxx.b.toString();
  shirtSummaryCells[23].textContent = data.shirts.xxx.p.toString();

  data.orders.forEach((order) => {
    const listItem = document.createElement("li");
    const itemLink = document.createElement("a");

    itemLink.href = `/info?id=${order.id}`;
    itemLink.textContent = `${order.fname} ${order.lname}`;
    listItem.appendChild(itemLink);
    orderList?.appendChild(listItem);
  });
};

export default (): void => {
  const orderSummary: HTMLTableElement | null =
    document.querySelector("#order-summary");

  if (!orderSummary) {
    return;
  }

  fetch("/api/orders")
    .then((response) => response.json())
    .then((data) => go(data as FetchedData));
};
