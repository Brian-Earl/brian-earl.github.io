//Credit for better footers goes to https://stackoverflow.com/questions/53076202/stick-div-at-the-bottom-of-equally-height-cards

const body = document.getElementById("cardBody");

const colors = new Map();
colors.set("black", "is-black");
colors.set("darkGrey", "is-dark");
colors.set("lightGrey", "is-light");
colors.set("white", "is-white");
colors.set("teal", "is-primary");
colors.set("darkBlue", "is-link");
colors.set("lightBlue", "is-info");
colors.set("green", "is-success");
colors.set("yellow", "is-warning");
colors.set("red", "is-danger");

$.getJSON('https://raw.githubusercontent.com/Brian-Earl/brian-earl.github.io/master/index.json', function (data) {
    data.cards.forEach(createCard);
});

function createCard(cardData) {
    base = document.createElement('div');
    base.className = "column is-one-third-desktop is-full-touch"
    body.appendChild(base)

    frame = document.createElement('div');
    frame.className = "box has-background-grey-lighter"
    base.appendChild(frame)

    card = document.createElement('div')
    card.className = "card equal-height"
    frame.appendChild(card)

    cardImage = document.createElement('div')
    cardImage.className = "card-image"
    card.appendChild(cardImage)

    cardFigure = document.createElement('figure')
    cardFigure.className = "image is-16by9"
    cardImage.appendChild(cardFigure)

    cardImageSrc = document.createElement('img')
    cardImageSrc.src = cardData.image
    cardImageSrc.alt = "Loading..."
    cardFigure.appendChild(cardImageSrc)

    cardContent = document.createElement('div')
    cardContent.className = "card-content"
    card.appendChild(cardContent)

    cardTitle = document.createElement('div')
    cardTitle.className = "Media"
    cardContent.appendChild(cardTitle)

    cardMediaContent = document.createElement('div')
    cardMediaContent.className = "media-content"
    cardTitle.appendChild(cardMediaContent)

    cardTitleText = document.createElement('p')
    cardTitleText.className = "title is-4"
    cardTitleText.innerHTML = cardData.title
    cardMediaContent.appendChild(cardTitleText)

    cardTags = document.createElement('div')
    cardTags.className = "tags"
    cardContent.appendChild(cardTags)

    cardData.tags.forEach((element) => {
        tagSpan = document.createElement('span')
        console.log(element.color)
        if(colors.has(element.color)){
            tagSpan.className = "tag " + colors.get(element.color);
        }
        else{
            console.log(element.color + " is not a supported color");
            tagSpan.className = "tag";
        }
        tagSpan.innerHTML = element.title
        cardTags.appendChild(tagSpan)
    });

    cardMainBody = document.createElement('div')
    cardMainBody.className = "card-main-body"
    cardMainBody.innerHTML = cardData.description
    cardContent.appendChild(cardMainBody)

    cardFooter = document.createElement('footer')
    cardFooter.className = "card-footer"
    card.appendChild(cardFooter)

    cardData.links.forEach((element) => {
        buttonLink = document.createElement('a')
        buttonLink.href = element.link
        cardFooter.appendChild(buttonLink)
        button = document.createElement('button')
        button.className = "card-footer-item button is-link"
        button.innerHTML = element.title
        buttonLink.appendChild(button)
    });
}