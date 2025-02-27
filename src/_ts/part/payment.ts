type Validation = {
  error: number;
  total: number;
};

type Completion = {
  location: string;
  message: string;
};

const getError = (message: string): HTMLParagraphElement => {
  const p = document.createElement("p");
  p.textContent = message;

  return p;
};

export default () => {
  // @ts-expect-error Stripe is loaded externally.
  if (typeof Stripe !== "function") {
    return;
  }

  // @ts-expect-error Stripe is loaded externally.
  const stripe = Stripe(
    window.location.host === "hotdogwalk.com"
      ? "pk_live_519kwRNDbPsEvuyro3rmyucNffyny87P6c972CRHGdpqrpK8SYrHvtVBAhbHjBzEc4wBKvDvBBKxQkeCv8FOnoZ0B00PWA89gOO"
      : "pk_test_51QuyeADExxj7eQXoLPDzEb1iogWsRnUZfr73H0pVfXtyU4GWyRY7e6ctAJR8NP1gc3ggj63adkm76xDqGYmxbQOM00EBLbKpyJ",
  );
  const stripeElements = stripe.elements();
  const stripePayment = stripeElements.create("card", {
    style: {
      base: {
        backgroundColor: "#fff",
        color: "#333",
        iconColor: "#197fe6",
        fontFamily: "fira, sans-serif",
        fontSize: "16px",
      },
    },
  });

  stripePayment.mount("#stripe-payment");

  document.querySelector("form")!.addEventListener("submit", (event): void => {
    event.preventDefault();

    const form: HTMLFormElement = event.target as HTMLFormElement;
    const stripeError = form.querySelector(".stripe-error")!;

    stripeError.innerHTML = "";
    form.register.disabled = true;

    const formData = new FormData(form);

    fetch("/api/validate", {
      method: "post",
      body: formData,
    })
      .then((validateResponse) => validateResponse.json())
      .then((validateData) => {
        if ((validateData as Validation).error > 0 || !form.checkValidity()) {
          form.register.disabled = false;
          form.reportValidity();

          return;
        }

        if (!(validateData as Validation).total) {
          formData.append("total", "0");
          formData.append("payment-method", "comp");

          return fetch("/api/save", {
            method: "post",
            body: formData,
          })
            .then((freeResponse) => freeResponse.json())
            .then((freeData) => {
              if ((freeData as Completion).message !== "success") {
                form.register.disabled = false;

                return stripeError.appendChild(
                  getError((freeData as Completion).message),
                );
              }

              window.location.href = (freeData as Completion).location;
            });
        }

        stripe
          .createPaymentMethod({
            type: "card",
            card: stripePayment,
            billing_details: {
              name: `${form.fname.value} ${form.lname.value}`,
              email: form.email.value,
              phone: form.tel.value,
            },
          })
          .then(
            (result: {
              error: { message: string };
              paymentMethod: { id: string };
            }) => {
              if (result.error) {
                form.register.disabled = false;

                return stripeError.appendChild(getError(result.error.message));
              }

              formData.append(
                "total",
                (validateData as Validation).total.toString(),
              );
              formData.append("payment-method", result.paymentMethod.id);

              fetch("/api/process", {
                method: "post",
                body: formData,
              })
                .then((processResponse) => processResponse.json())
                .then((processData) => {
                  console.log(processData);
                  if ((processData as Completion).message !== "success") {
                    form.register.disabled = false;

                    return stripeError.appendChild(
                      getError((processData as Completion).message),
                    );
                  }

                  fetch("/api/save", {
                    method: "post",
                    body: formData,
                  })
                    .then((paidResponse) => paidResponse.json())
                    .then((paidData) => {
                      if ((paidData as Completion).message !== "success") {
                        form.register.disabled = false;

                        return stripeError.appendChild(
                          getError((paidData as Completion).message),
                        );
                      }

                      window.location.href = (paidData as Completion).location;
                    });
                });
            },
          );
      });
  });
};
