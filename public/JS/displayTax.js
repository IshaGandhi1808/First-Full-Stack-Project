const taxes = document.querySelectorAll(".tax-index");
function displayTaxToggle() {
  for (const tax of taxes) {
    tax.classList.toggle("active");
  }
}

// Display Tax on click at Filter category [because Filter category Listings appear in DOM after apply filter]

let observer = new MutationObserver((e) => {
  const taxes = e[0].target.querySelectorAll(".tax-index");

  let toggle = document.querySelector("#switchCheckReverse");
  toggle.addEventListener("click", () => {
    for (const tax of taxes) {
      tax.classList.toggle("active");
    }
  });
});

observer.observe(allListings, {
  childList: true,
  subtree: true,
});
