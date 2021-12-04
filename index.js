//Credit for better footers goes to https://stackoverflow.com/questions/53076202/stick-div-at-the-bottom-of-equally-height-cards
//Credit for preventing doubles goes to https://stackoverflow.com/questions/1988349/array-push-if-does-not-exist

const projects = document.getElementById("projects");
const aboutMe = document.getElementById("aboutMe");
const aboutMeImage = document.getElementById("aboutMeImage");
const filtersElement = document.getElementById("filters");

const colors = new Map();
colors.set("black", "dark");
colors.set("grey", "secondary");
colors.set("white", "light");
colors.set("teal", "info");
colors.set("blue", "primary");
colors.set("green", "success");
colors.set("yellow", "warning");
colors.set("red", "danger");

let tagFilters = [];

$.getJSON(
  "https://raw.githubusercontent.com/Brian-Earl/brian-earl.github.io/master/index.json",
  function (data) {
    createAboutMe(data.aboutMe);
    data.cards.forEach(createCard);
    addEvents();
  }
);

function createAboutMe(aboutMeData) {
  aboutMe.innerHTML = aboutMeData.description;

  aboutMeImage.src = aboutMeData.image;
}

function createCard(cardData) {
  base = document.createElement("div");
  base.className = "col-md-6 mb-5";
  projects.appendChild(base);

  card = document.createElement("div");
  card.className = "card h-100";
  base.appendChild(card);

  cardImage = document.createElement("img");
  cardImage.className = "card-img-top";
  cardImage.src = cardData.image;
  cardImage.alt = "https://via.placeholder.com/300x200";
  card.appendChild(cardImage);

  cardBody = document.createElement("div");
  cardBody.className = "card-body";
  card.appendChild(cardBody);

  cardTitle = document.createElement("h4");
  cardTitle.className = "cardTitle";
  cardTitle.innerHTML = cardData.title;
  cardBody.appendChild(cardTitle);

  cardTags = document.createElement("h5");
  cardTags.className = "badges";
  cardBody.appendChild(cardTags);

  cardData.tags.forEach((element) => {
    tagSpan = document.createElement("a");
    if (colors.has(element.color)) {
      tagSpan.className =
        "badge badge-" +
        colors.get(element.color) +
        " button-badge-spacing tag-badge";
    } else {
      console.log(element.color + " is not a supported badge color");
      tagSpan.className = "badge";
    }
    tagSpan.innerHTML = element.title;
    cardTags.appendChild(tagSpan);
  });

  cardMainBody = document.createElement("p");
  cardMainBody.className = "card-text";
  cardMainBody.innerHTML = cardData.description;
  cardBody.appendChild(cardMainBody);

  cardFooter = document.createElement("div");
  cardFooter.className = "card-footer";
  card.appendChild(cardFooter);

  cardData.links.forEach((element) => {
    buttonLink = document.createElement("a");
    buttonLink.className = "btn btn-primary button-badge-spacing";
    buttonLink.innerHTML = element.title;
    buttonLink.href = element.link;
    cardFooter.appendChild(buttonLink);
  });
}

function addEvents() {
  $(".tag-badge").on("click", function (e) {
    addTagFilter(e.target.innerHTML);
  });

  $(".add-filter-badge").on("click", function (e) {
    clearTagFilters();
    addTagFilter(e.target.attributes.filter.nodeValue);
  });
}

function addTagFilter(filter) {
  tagFilters.indexOf(filter) === -1
    ? tagFilters.push(filter)
    : console.log("This item already exists");
  filterElements();
}

function removeTagFilter(filter) {
  tagFilters =
    tagFilters.indexOf(filter) !== -1 &&
    tagFilters.splice(tagFilters.indexOf(tagFilters), 1);
  if (tagFilters.length) return;
  tagFilters = [];
  filterElements();
}

function clearTagFilters() {
  tagFilters = [];
  filterElements();
}

function filterElements() {
  filterRemovalBadges();
  filterCards();
  addFilterEvents();
}

function filterCards() {
  let badgesElements = document.getElementsByClassName("badges");
  Array.prototype.forEach.call(badgesElements, function (badges) {
    let tags = [];
    badges.childNodes.forEach((tag) => {
      tags.push(tag.innerHTML);
    });
    let filterOut = false;
    tagFilters.forEach((filter) => {
      filterOut = filterOut || !tags.includes(filter);
    });
    badges.parentNode.parentNode.parentNode.hidden = filterOut;
  });
}

function filterRemovalBadges() {
  removeAllChildNodes(filtersElement);
  if (tagFilters.length <= 0) return;

  if (tagFilters.length > 1) {
    xIcon = document.createElement("i");
    xIcon.className = "fas fa-times-circle text-white x-icon";
    clearAllFilter = document.createElement("a");
    clearAllFilter.className =
      "badge badge-secondary clear-all-filter-badge button-badge-spacing filter-button";
    clearAllFilter.innerHTML = "Remove All Filters";
    clearAllFilter.append(xIcon);
    filtersElement.append(clearAllFilter);
  }

  tagFilters.forEach((element) => {
    xIcon = document.createElement("i");
    xIcon.className = "fas fa-times-circle text-white x-icon";
    clearAllFilter = document.createElement("a");
    clearAllFilter.className =
      "badge badge-secondary clear-filter-badge button-badge-spacing filter-button";
    clearAllFilter.innerHTML = element;
    clearAllFilter.append(xIcon);
    filtersElement.append(clearAllFilter);
  });
}

function addFilterEvents() {
  $(".clear-all-filter-badge").on("click", function () {
    clearTagFilters();
  });

  $(".clear-filter-badge").on("click", function (e) {
    removeTagFilter(e.target.innerHTML);
  });
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
