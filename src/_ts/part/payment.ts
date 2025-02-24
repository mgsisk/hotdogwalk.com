export default () => {
  // @ts-ignore
  if (typeof Stripe !== "function") {
    return;
  }

  // @ts-ignore
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
        if (validateData.error > 0 || !form.checkValidity()) {
          form.register.disabled = false;
          form.reportValidity();

          return;
        }

        if (!validateData.total) {
          formData.append("total", "0");
          formData.append("payment-method", "comp");

          return fetch("/api/save", {
            method: "post",
            body: formData,
          })
            .then((freeResponse) => freeResponse.json())
            .then((freeData) => {
              if (freeData.message !== "success") {
                let p = document.createElement("p");
                p.textContent = freeData.message;
                form.register.disabled = false;
                return stripeError.appendChild(p);
              }

              window.location = freeData.location;
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
          .then((result: { [index: string]: any }) => {
            if (result.error) {
              let p = document.createElement("p");
              p.textContent = result.error.message;
              form.register.disabled = false;
              return stripeError.appendChild(p);
            }

            formData.append("total", validateData.total);
            formData.append("payment-method", result.paymentMethod.id);

            fetch("/api/process", {
              method: "post",
              body: formData,
            })
              .then((processResponse) => processResponse.json())
              .then((processData) => {
                console.log(processData);
                if (processData.message !== "success") {
                  let p = document.createElement("p");
                  p.textContent = processData.message;
                  form.register.disabled = false;
                  return stripeError.appendChild(p);
                }

                fetch("/api/save", {
                  method: "post",
                  body: formData,
                })
                  .then((paidResponse) => paidResponse.json())
                  .then((paidData) => {
                    if (paidData.message !== "success") {
                      let p = document.createElement("p");
                      p.textContent = paidData.message;
                      form.register.disabled = false;
                      return stripeError.appendChild(p);
                    }

                    window.location = paidData.location;
                  });
              });
          });
      });
  });
};
