//Credit for better footers goes to https://stackoverflow.com/questions/53076202/stick-div-at-the-bottom-of-equally-height-cards
//Credit for preventing doubles goes to https://stackoverflow.com/questions/1988349/array-push-if-does-not-exist
//Credit for json parsing goes to https://gist.github.com/jokester/4a543ea76dbc5ae1bf05
//Credit for save function goes to https://stackoverflow.com/questions/27177661/save-html-locally-with-javascript
//Credit for shallow copy goes to https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript

const aboutMe = document.getElementById("aboutMe");
const aboutMeImage = document.getElementById("aboutMeImage");
const headerName = document.getElementById("headerName");
const headerSocials = document.getElementById("headerSocials");
const projectContainer = document.getElementById("projectContainer");
const htmlTag = document.getElementById("html");
const scriptTag = document.getElementById("script");

const colors = new Map();
colors.set("black", "dark");
colors.set("grey", "secondary");
colors.set("white", "light");
colors.set("teal", "info");
colors.set("blue", "primary");
colors.set("green", "success");
colors.set("yellow", "warning");
colors.set("red", "danger");

const socials = new Map();
socials.set("email", "fas fa-envelope ")
socials.set("github", "fab fa-github")
socials.set("linkedin", "fab fa-linkedin-in")
socials.set("pdf", "fas fa-file-alt")

function main() {
  let hash = window.location.hash.slice(1);
  let jsonStr = decodeURIComponent(hash)
  let formattedData = JSON.parse(jsonStr);
  createHeader(formattedData.header);
  createAboutMe(formattedData.aboutMe);
  formattedData.cardSections.forEach((element) => {
    createCardSectionHeader(element.name);
    if (formattedData.features.filters && formattedData.cardSections.length === 1) {
      createFilterButtons(element.filters)

      filtersElement = document.createElement("h4");
      filtersElement.className = "row";
      filtersElement.id = "filters";
      projectContainer.appendChild(filtersElement);
    }

    projects = document.createElement("div");
    projects.className = "row"
    projectContainer.appendChild(projects);
    element.cards.forEach((element) => { createCard(element, projects) });

  })

  if (formattedData.features.filters && formattedData.cardSections.length === 1) {
    createFilterCode();
    addEvents();
  }
}

function createAboutMe(aboutMeData) {
  aboutMe.innerHTML = aboutMeData.description;
  aboutMeImage.src = aboutMeData.image;
}

function createCard(cardData, projects) {
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

function createHeader(data) {
  headerNameStrong = document.createElement("strong");
  headerNameStrong.innerHTML = data.name;
  headerName.appendChild(headerNameStrong);

  data.socials.forEach(element => {
    createHeaderSocialIcon(element);
  });
}

function createHeaderSocialIcon(data) {
  socialLink = document.createElement("a");
  socialLink.style = "padding: 1em;"
  socialLink.href = data.link;
  headerSocials.appendChild(socialLink);

  socialSpan = document.createElement("span");
  socialSpan.className = "icon subtitle";
  socialLink.appendChild(socialSpan);

  socialIcon = document.createElement("i");
  socialIcon.className = "text-white " + socials.get(data.type);
  socialIcon.style = style = "font-size: 40px;"
  socialSpan.appendChild(socialIcon);
}

function createCardSectionHeader(data) {
  container = document.createElement("div");
  container.className = "row";
  projectContainer.appendChild(container);

  cardSectionHeader = document.createElement("h1");
  cardSectionHeader.innerHTML = data;
  container.appendChild(cardSectionHeader);
}

function createFilterButtons(data) {
  container = document.createElement("h3");
  container.className = "row";
  container.id = "perminant-filters";
  projectContainer.appendChild(container);

  data.forEach((element) => {
    filterButton = document.createElement("a");
    filterButton.className = "badge badge-secondary add-filter-badge button-badge-spacing filter-button";
    filterButton.setAttribute("filter", element.filter);
    filterButton.innerHTML = element.display;
    container.appendChild(filterButton);
  })
}

function save() {
  copiedHTML = htmlTag.cloneNode(true)
  removeElement(copiedHTML, "script", "mainScript")
  removeElement(copiedHTML, "p", "previewView")
  let htmlFile = new Blob([copiedHTML.outerHTML], { type: "text/html" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(htmlFile);
  a.download = "generated.html";
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
}

function removeElement(html, tag, id) {
  let e = html.getElementsByTagName(tag).namedItem(id)
  console.log(e)
  e.parentElement.removeChild(e);
}

main()

function createFilterCode() {
  script = document.createElement("script");
  //This is a hack horrible hack
  //I am so so so so sorry to the unluck soul that is reading this
  script.innerHTML = `
  
  let tagFilters = [];
  const filtersElement = document.getElementById("filters");
  addEvents();

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
    if(!filtersElement) return;
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
  `
  htmlTag.appendChild(script);
}