const go = (shirts: { [index: string]: number }): number | void => {
  const output: NodeListOf<HTMLElement> | null = document.querySelectorAll(
    ".reg-shirts-event .count",
  );

  if (!output) {
    return;
  }

  let keepCounting = false;
  const form: HTMLFormElement = document.querySelector("form")!;

  output.forEach((element: HTMLElement): void => {
    const color: string = element.classList.value
      .split(" ")
      .pop()!
      .replace("count-", "");

    if (shirts[color] <= 0 && !form.free2025 && !form.vip2025) {
      element.textContent = "Sold Out";
      element.closest("div")!.querySelector("input")!.checked = false;
      element.closest("div")!.querySelector("input")!.disabled = true;

      return;
    }

    keepCounting = true;
    element.textContent = `${shirts[color]} Remaining`;
  });

  if (!keepCounting) {
    return;
  }

  window.setTimeout(
    () =>
      fetch("/api/shirts")
        .then((response) => response.json())
        .then((data) => go(data)),
    5000,
  );
};

export default () =>
  fetch("/api/shirts")
    .then((response) => response.json())
    .then((data) => go(data));
