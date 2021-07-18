//327 lines of HTML into
//  > 90 lines of HTML
//  > 80 lines of js
//  > 158 lines of JSON
//  > 328 lines total (ARE YOU KIDDING ME!! ONE LINE MORE!!)

const body = document.getElementById("cardBody");

$.getJSON('https://raw.githubusercontent.com/Brian-Earl/brian-earl.github.io/master/index.json', function (data) {
    data.cards.forEach(createCard);
});

function createCard(cardData) {
    base = document.createElement('div');
    base.className = "column is-one-third"
    body.appendChild(base)

    frame = document.createElement('div');
    frame.className = "box has-background-grey-lighter"
    base.appendChild(frame)

    card = document.createElement('div')
    card.className = "card"
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
    cardTitleText.style = "margin-bottom:25px;"
    cardMediaContent.appendChild(cardTitleText)

    cardTags = document.createElement('div')
    cardTags.className = "tags"
    cardContent.appendChild(cardTags)

    cardData.tags.forEach((element) => {
        tagSpan = document.createElement('span')
        tagSpan.className = "tag " + element.color
        tagSpan.innerHTML = element.title
        cardTags.appendChild(tagSpan)
    });

    cardDescription = document.createElement('div')
    cardDescription.className = "content"
    cardDescription.innerHTML = cardData.description
    cardContent.appendChild(cardDescription)

    buttonOutter = document.createElement('div')
    buttonOutter.style = "padding-top: 3%;"
    cardDescription.appendChild(buttonOutter)

    cardData.links.forEach((element) => {
        buttonLink = document.createElement('a')
        buttonLink.href = element.link
        buttonOutter.appendChild(buttonLink)
        button = document.createElement('button')
        button.className = "button is-link"
        button.innerHTML = element.title
        button.style = "margin-right:10px;"
        buttonLink.appendChild(button)
    });
}