const alertDog = (text: string): void => {
  const alert: HTMLDivElement = document.createElement("div");
  const content: HTMLDivElement = document.createElement("div");

  alert.classList.add("alert");
  content.textContent = text;

  alert.addEventListener("click", () => alert.remove());
  content.addEventListener("click", () => alert.remove());

  alert.appendChild(content);
  document.querySelector("body")!.appendChild(alert);

  window.setTimeout(() => alert.classList.add("show"), 100);
  window.setTimeout(() => alert.classList.remove("show"), 5000);
  window.setTimeout(() => alert.remove(), 5500);
};

const inputDog = (name: string, value: string): HTMLInputElement => {
  const input = document.createElement("input");

  input.type = "hidden";
  input.name = name;
  input.value = value;

  return input;
};

const emailDog = (address: string): void => {
  fetch(`/api/email/${address}`)
    .then((response) => response.json())
    .then((data) =>
      data.date
        ? alertDog(
            `It looks like you already registered on ${new Date(data.date).toLocaleDateString("en-US")}. You should only continue if you're registering another person using the same email address.`,
          )
        : null,
    );
};

const addShirtDog = (form: HTMLFormElement): void => {
  const size: string = form.merchShirtSize.value;
  const color: string = form.merchShirtColor.value;
  const table: HTMLTableElement = form.querySelector(".reg-shirts table")!;

  const row = table!.querySelector(`tr.shirt${size}-${color}`);

  if (row) {
    let count = row.querySelector("input")!.value;

    row.querySelector("td:last-child")!.textContent = (
      parseInt(count) + 1
    ).toString();
    row.querySelector("input")!.value = (parseInt(count) + 1).toString();

    return;
  }

  const template: HTMLTemplateElement =
    document.querySelector("#merch-shirt-row")!;
  const clone: DocumentFragment = template.content.cloneNode(
    true,
  ) as DocumentFragment;

  const cloneCell: HTMLTableCellElement = clone.querySelector("td")!;

  clone.querySelector("tr")?.classList.add(`shirt${size}-${color}`);
  clone.querySelector("input")?.setAttribute("name", `shirt${size}-${color}`);
  cloneCell.textContent = cloneCell.textContent!.replace(
    /\[size\]/,
    form.merchShirtSize[form.merchShirtSize.selectedIndex].textContent,
  );
  cloneCell.textContent = cloneCell.textContent.replace(
    /\[color\]/,
    form.merchShirtColor[form.merchShirtColor.selectedIndex].textContent,
  );

  clone
    .querySelector("button")!
    .addEventListener("click", (event: Event) =>
      subShirtDog((event.target as HTMLButtonElement).closest("tr")!),
    );

  table.appendChild(clone);

  checkShirtDog(form);
};

const subShirtDog = (element: HTMLTableRowElement): void => {
  const countCell: HTMLTableCellElement =
    element.querySelector("td:last-child")!;
  const countInput: HTMLInputElement = element.querySelector("input")!;
  const table: HTMLTableElement = element.closest("table")!;

  let count: number = parseInt(countInput.value);

  if (count === 1) {
    element.remove();

    checkShirtDog(table.closest("form")!);

    return;
  }

  countInput.value = (count - 1).toString();
  countCell.textContent = (count - 1).toString();
  checkShirtDog(table.closest("form")!);
};

const checkShirtDog = (form: HTMLFormElement): void => {
  const ticket = form.ticket.value;

  if (ticket === "combo" || ticket === "event") {
    form.shirtb.required = !(form.shirtc.value && form.shirts.value);
    form.donation.dispatchEvent(new Event("change"));

    return;
  }

  form.shirtb.required = form.querySelectorAll("table input").length === 0;
  form.donation.dispatchEvent(new Event("change"));
};

const toggleDog = (ticket: string, form: HTMLFormElement) => {
  const dogs: HTMLElement | null = form.querySelector(".reg-dogs");
  const shirts: HTMLElement | null = form.querySelector(".reg-shirts-event");
  const waivers: HTMLElement | null = form.querySelector(".reg-waivers");

  if (!dogs || !shirts || !waivers) {
    return;
  }

  dogs.classList.remove("hide");
  shirts.classList.remove("hide");
  waivers.classList.remove("hide");

  waivers
    .querySelectorAll("input")
    .forEach((element: HTMLInputElement): boolean => (element.required = true));

  if (ticket === "event" || ticket === "combo") {
    return;
  }

  dogs.classList.add("hide");
  shirts.classList.add("hide");
  waivers.classList.add("hide");

  waivers
    .querySelectorAll("input")
    .forEach(
      (element: HTMLInputElement): boolean => (element.required = false),
    );
};

export default () => {
  const form: HTMLFormElement | null = document.querySelector("form");

  if (!form || !form.ticket) {
    return;
  }

  form.ticket.forEach((element: HTMLSelectElement): void =>
    element.addEventListener("change", (event: Event): void => {
      toggleDog(form.ticket.value, form);
      checkShirtDog(form);
    }),
  );

  if (window.location.search.match(/[?&]free2025(?:&|$)/)) {
    form.appendChild(inputDog("free2025", "1"));
  }

  if (window.location.search.match(/[?&]vip2025(?:&|$)/)) {
    form.appendChild(inputDog("vip2025", "1"));
  }

  form.email.addEventListener("change", (event: Event): void =>
    emailDog((event.target as HTMLInputElement).value),
  );

  form.shirts.forEach((element: HTMLSelectElement): void =>
    element.addEventListener("change", (event: Event): void =>
      checkShirtDog(form),
    ),
  );

  form.shirtc.forEach((element: HTMLSelectElement): void =>
    element.addEventListener("change", (event: Event): void =>
      checkShirtDog(form),
    ),
  );

  form.merchShirtAdd.addEventListener("click", (event: Event): void =>
    addShirtDog(form),
  );

  form.ticket[0].dispatchEvent(new Event("change"));
};
