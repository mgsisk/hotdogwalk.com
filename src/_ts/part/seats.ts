const go = (seats: number): number | void => {
  const output: NodeListOf<HTMLElement> | null =
    document.querySelectorAll(".seats");

  if (!output) {
    return;
  }

  output.forEach(
    (element: HTMLElement): string =>
      (element.textContent = `${seats} Remaining`),
  );

  if (seats > 0) {
    return window.setTimeout(
      () =>
        fetch("/api/seats")
          .then((response) => response.json())
          .then((data) => go(parseInt(data.seats))),
      5000,
    );
  }

  output.forEach(
    (element: HTMLElement): string => (element.textContent = "Sold Out"),
  );

  const form: HTMLFormElement | null = document.querySelector("form");
  const regTypes: RadioNodeList | Element | null = form!.ticket;

  if (!(regTypes instanceof RadioNodeList) || form!.free2025 || form!.vip2025) {
    return;
  }

  for (let i = 0; i < regTypes.length; i++) {
    const element: HTMLInputElement = regTypes[i] as HTMLInputElement;

    if (element.value === "voucher" || element.value === "shirt") {
      return;
    }

    element.checked = false;
    element.disabled = true;
    element.dispatchEvent(new Event("change"));
  }
};

export default () =>
  fetch("/api/seats")
    .then((response) => response.json())
    .then((data) => go(parseInt(data.seats)));
