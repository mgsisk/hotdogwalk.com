export default (): void => {
  const hero: HTMLElement | null = document.querySelector(".hero");

  if (!hero) {
    return;
  }

  hero.classList.add("stage");

  setTimeout(() => {
    hero.classList.remove("stage");
    hero.classList.add("animate");
  }, 1000);
};
