type Ticket = "combo" | "event" | "voucher" | "shirt";
type Size = "s" | "m" | "l" | "x" | "xx" | "xxx";
type Color = "r" | "o" | "b" | "p";
type FetchedData = {
  walker: {
    ticket: Ticket;
    fname: string;
    lname: string;
    shirts: Size;
    shirtc: Color;
    donation: number;
    merch: {
      size: Size;
      color: Color;
      quantity: number;
    }[];
  };
  error: boolean;
};

const go = (data: FetchedData) => {
  if (data.error) {
    return;
  }

  const parser = new DOMParser();
  let info = `<div><dl><dt>Registered for</dt><dd>${data.walker.ticket}</dd>`;

  if (data.walker.shirts) {
    info += `<dt>Event shirt</dt><dd>${data.walker.shirts.toUpperCase()} — ${data.walker.shirtc.toUpperCase()}</dd>`;
  }

  if (data.walker.donation) {
    info += `<dt>Donation</dt><dd>$${data.walker.donation}</dd>`;
  }

  info += "</dl>";

  if (data.walker.merch.length) {
    info += "<table><tr><th>Size</th><th>Color</th><th>Quantity</th></tr>";

    data.walker.merch.forEach((m) => {
      info += `<tr><td>${m.size.toUpperCase()}</td><td>${m.color.toUpperCase()}</td><td>${m.quantity.toString()}</td></tr>`;
    });

    info += "</table>";
  }

  info += "</div>";

  document.querySelector("h1")!.textContent =
    `${data.walker.fname} ${data.walker.lname}`;
  document.querySelector("main p")?.remove();

  document
    .querySelector("main")!
    .appendChild(parser.parseFromString(info, "text/html").body.firstChild!);
};

export default (): void => {
  if (
    !location.pathname.match(/^\/info/) ||
    !location.search.match(/^\?id=\d+$/)
  ) {
    return;
  }

  fetch(`/api/orders/${location.search.replace(/\D+/g, "")}`)
    .then((response) => response.json())
    .then((data) => go(data as FetchedData));
};
