const getCountdown = (now: number, then: number): HTMLElement => {
  const counter: HTMLElement = document.createElement("time");
  const diff: number = (then - now) / 1000;
  const labels: Array<string> = ["days", "hours", "mins", "secs"];
  const time: Array<number> = [
    Math.floor(diff / 86400),
    Math.floor((diff % 86400) / 3600),
    Math.floor((diff % 3600) / 60),
    Math.floor(diff % 60),
  ];

  time.forEach((value: number, index: number) => {
    const timer: HTMLElement = document.createElement("span");
    const count: HTMLElement = document.createElement("b");
    const label: HTMLElement = document.createElement("i");

    count.textContent = value.toString();
    label.textContent = labels[index];

    if (count.textContent.length < 2) {
      count.textContent = `0${count.textContent}`;
    }

    timer.appendChild(count);
    timer.appendChild(label);
    counter.appendChild(timer);
  });

  counter.setAttribute(
    "datetime",
    `${time[0]}d ${time[1]}h ${time[2]}m ${time[3]}s`,
  );

  return counter;
};

const ctaPreReg = (now: number, then: number): void => {
  const date: Date = new Date(then);

  ctaUpdate(
    `Registration for the ${date.getFullYear()} Walk opens in`,
    getCountdown(now, then),
  );
};

const ctaNowReg = (now: number): void => {
  const cta: HTMLAnchorElement = document.createElement("a");
  const date: Date = new Date(now);

  cta.textContent = "Register Now";
  cta.href = "/register";

  ctaUpdate(`Registration for the ${date.getFullYear()} Walk is open`, cta);
};

const ctaPreEvent = (now: number, then: number): void => {
  const date: Date = new Date(then);

  ctaUpdate(
    `The ${date.getFullYear()} Walk begins in`,
    getCountdown(now, then),
  );
};

const ctaNowEvent = (now: number): void => {
  const cta: HTMLAnchorElement = document.createElement("a");
  const date: Date = new Date(now);

  cta.textContent = "Follow us on Facebook";
  cta.href = "https://facebook.com/kzoohotdogwalk";

  ctaUpdate(`The ${date.getFullYear()} Walk is happening now`, cta);
};

const ctaPostEvent = (then: number): void => {
  const cta: HTMLAnchorElement = document.createElement("a");
  const date: Date = new Date(then);

  cta.textContent = "View highlights on Facebook";
  cta.href = "https://facebook.com/kzoohotdogwalk";

  ctaUpdate(`The ${date.getFullYear()} Walk has ended`, cta);
};

const ctaUnknown = (): void => {
  console.log("Something has gone terribly wrong...");
};

const ctaUpdate = (caption: string, content: HTMLElement): void => {
  const newCTA: HTMLElement = document.createElement("figure");
  const newCaption: HTMLElement = document.createElement("figcaption");
  const oldCTAs: NodeListOf<HTMLElement> = document.querySelectorAll(".cta");

  newCaption.textContent = caption;
  newCTA.classList.add("cta");
  newCTA.appendChild(newCaption);
  newCTA.appendChild(content);

  oldCTAs.forEach((element) => {
    element.replaceWith(newCTA.cloneNode(true));
  });
};

const go = (times: Array<number>): void => {
  const now: number = Date.now();
  const diffs: Array<number> = [
    times[0] - now,
    times[1] - now,
    times[2] - now,
  ].filter((val: number): boolean => val >= 0);
  const minTime = Math.min(...diffs);

  if (diffs.length === 0 && now - times[2] <= 21600000) {
    // NOTE 5 hour window
    ctaNowEvent(now);
  } else if (diffs.length === 0) {
    ctaPostEvent(times[2]);
  } else if (minTime === times[2] - now) {
    ctaPreEvent(now, times[2]);
  } else if (minTime === times[1] - now) {
    ctaNowReg(now);
  } else if (minTime === times[0] - now) {
    ctaPreReg(now, times[0]);
  } else {
    ctaUnknown();
  }

  setTimeout((): void => go(times), 1000);
};

export default (): void => {
  const cta: HTMLElement | null = document.querySelector(".cta");

  if (!cta) {
    return;
  }

  fetch("/api/dates")
    .then((response) => response.json())
    .then((data) =>
      go([
        Date.parse((data as { open: string }).open),
        Date.parse((data as { close: string }).close),
        Date.parse((data as { event: string }).event),
      ]),
    );
};
