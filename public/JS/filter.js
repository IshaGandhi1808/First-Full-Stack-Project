const categories = document.querySelectorAll(".filter-category");

const removeBtn = document.querySelector(".remove-filter");

categories.forEach((category) => {
  category.addEventListener("click", function () {
    removeBtn.classList.add("active");

    const categoryValue = this.querySelector("span").innerText;

    const filterListings = allListing.filter(
      (listing) => listing.category === categoryValue,
    );

    renderFilterList(filterListings);
  });
});

const allListings = document.querySelector(".all-listings");

function renderFilterList(filterLists) {
  allListings.innerHTML = "";

  if (filterLists.length == 0) {
    allListings.innerHTML = `
      <div class="alert alert-info m-auto w-auto mt-5" role="alert">
        No results found for this category. Please try another category.
      </div>`;
  } else {
    filterLists.forEach((listing) => {
      const filterListHTML = `
          <div class="col p-2">
            <div class="card mb-4 p-0 card-img">
              <a href="listings/${listing._id}" class="d-flex flex-column gap-2">
                <img src="${listing.image.url}" class="card-img-top rounded-4" alt="Card Image" style="aspect-ratio: 1/1;" loading="lazy" >
                <div class="card-img-overlay"></div>
                <div class="card-body p-0">
                  <p class="card-text list-title">${listing.title}</p>
                  <p class="card-text list-price">&#8377;${listing.price.toLocaleString("en-IN")} / night </p>
                </div>
              </a>
            </div>
          </div>
        `;

      allListings.innerHTML += filterListHTML;
    });
  }
}

removeBtn.addEventListener("click", () => {
  renderFilterList(allListing);
  removeBtn.classList.remove("active");
});
