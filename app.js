//Api Key
const apiKey = "563492ad6f917000010000018d3d632d159841c3be25f142d4629eba";

// Selectors
const photoGallery = document.querySelector(".photo-gallery");
const searchInput = document.querySelector(".search");
const form = document.querySelector(".form");
const morePhotosButton = document.querySelector(".more-btn");

//Variables
let searchInputValue;
let pageIndex = 1;
let apiLink;
let presentSearch;

// Event Listeners
searchInput.addEventListener("input", updateInput);
morePhotosButton.addEventListener("click", loadMoreImg);

// Async Functions
async function fetchApi(url) {
  const fetchPhoto = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: apiKey,
    },
  });
  const imgData = await fetchPhoto.json();
  return imgData;
}

async function getPhotos() {
  apiLink = `https://api.pexels.com/v1/curated?per_page=20&page=1`;
  const imgData = await fetchApi(apiLink);
  generateImg(imgData);
}

async function searchPhoto(search) {
  apiLink = `https://api.pexels.com/v1/search?query=${search}&per_page=20&page=1`;
  clearInput();
  const imgData = await fetchApi(apiLink);
  generateImg(imgData);
}

async function loadMoreImg() {
  pageIndex++;
  if (presentSearch) {
    apiLink = `https://api.pexels.com/v1/search?query=${presentSearch}&per_page=20&page=${pageIndex}`;
  } else {
    apiLink = `https://api.pexels.com/v1/curated?per_page=20&page=1${pageIndex}`;
  }
  const imgData = await fetchApi(apiLink);
  generateImg(imgData);
}

// Functions
function generateImg(imgData) {
  imgData.photos.forEach((photo) => {
    const galleryElement = document.createElement("div");
    galleryElement.classList.add("gallery-img");
    photoGallery.append(galleryElement);
    galleryElement.innerHTML = `
    <div class="gallery-info">
    <a href=${photo.photographer_url}><p>${photo.photographer}</p></a>
    <a href=${photo.src.original}>Download</a>
    </div>
    <img src=${photo.src.large}>`;
  });
}

function updateInput(event) {
  searchInputValue = event.target.value;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    presentSearch = searchInputValue;
    searchPhoto(searchInputValue);
  });
}

function clearInput() {
  photoGallery.innerHTML = "";
  searchInput.value = "";
}

// Invoke the function when the page loads
getPhotos();
