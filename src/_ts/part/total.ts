const updateTotal = (form: HTMLFormElement): void => {
  fetch("/api/fees")
    .then((response): Promise<{ [index: string]: string }> => response.json())
    .then((fees: { [index: string]: string }): void => {
      let total: number = parseInt(form.donation.value);
      const shirts = form.querySelectorAll("table input");

      if (form.ticket.value && !form.free2025) {
        total += parseInt(fees[form.ticket.value]);
      }

      for (let i = 0; i < shirts.length; i++) {
        total +=
          parseInt((shirts[i] as HTMLInputElement).value) *
          parseInt(fees[(shirts[i] as HTMLInputElement).name.split("-")[0]]);
      }

      if (
        shirts.length &&
        form.ticket.value !== "combo" &&
        form.ticket.value !== "event"
      ) {
        total -= parseInt(fees.shirt);
      }

      if (total < 0) {
        total = 0;
      }

      form.querySelector("output")!.textContent = `\$${total.toString()}`;
    });
};

export default () => {
  const form: HTMLFormElement | null = document.querySelector("form");

  if (!form) {
    return;
  }

  form.ticket.forEach((element: HTMLInputElement): void => {
    element.addEventListener("change", (_event: Event) => updateTotal(form));
  });

  form.merchShirtAdd.addEventListener("click", (_event: Event) =>
    updateTotal(form),
  );
  form.donation.addEventListener("change", (_event: Event) =>
    updateTotal(form),
  );

  form.ticket[0].dispatchEvent(new Event("change"));
};
