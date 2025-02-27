type Color = "r" | "o" | "b" | "p";
type Shirts = { r: number; o: number; b: number; p: number };

const go = (shirts: Shirts) => {
  const output: NodeListOf<HTMLElement> | null = document.querySelectorAll(
    ".reg-shirts-event .count",
  );

  if (!output) {
    return;
  }

  let keepCounting = false;
  const form: HTMLFormElement = document.querySelector("form")!;

  output.forEach((element: HTMLElement): void => {
    const color = element.classList.value
      .split(" ")
      .pop()!
      .replace("count-", "");

    if (shirts[color as Color] <= 0 && !form.free2025 && !form.vip2025) {
      element.textContent = "Sold Out";
      element.closest("div")!.querySelector("input")!.checked = false;
      element.closest("div")!.querySelector("input")!.disabled = true;

      return;
    }

    keepCounting = true;
    element.textContent = `${shirts[color as Color]} Remaining`;
  });

  if (!keepCounting) {
    return;
  }

  window.setTimeout(
    () =>
      fetch("/api/shirts")
        .then((response) => response.json())
        .then((data) => go(data as Shirts)),
    5000,
  );
};

export default () =>
  fetch("/api/shirts")
    .then((response) => response.json())
    .then((data) => go(data as Shirts));
