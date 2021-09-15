//Credit for better footers goes to https://stackoverflow.com/questions/53076202/stick-div-at-the-bottom-of-equally-height-cards

const cardbody = document.getElementById("cardBody");
const aboutMeBody = document.getElementById("aboutMe")

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
    console.log(data);
    createAboutMe(data.aboutMe);
    data.cards.forEach(createCard);
});

function createAboutMe(aboutMeData) {
    console.log(aboutMeData);
    createDesktopAboutMe(aboutMeData)
    createMobileAboutMe(aboutMeData)
}

function createDesktopAboutMe(aboutMeData) {
    base = document.createElement('div');
    base.className = "is-hidden-touch";
    base.style = "padding: 2% 5%;"
    aboutMeBody.appendChild(base);

    frame = document.createElement('div');
    frame.className = "box has-background-grey-lighter";
    base.appendChild(frame);

    card = document.createElement('div')
    card.className = "card"
    frame.appendChild(card)

    media = document.createElement('article')
    media.className = "media"
    card.appendChild(media)

    mediaLeft = document.createElement('figure')
    mediaLeft.className = "media-left"
    media.appendChild(mediaLeft)

    column = document.createElement('div')
    column.className = "column"
    mediaLeft.appendChild(column)

    image = document.createElement('p')
    image.className = "image is-128x128"
    column.appendChild(image)

    imageSource = document.createElement('img')
    imageSource.src = aboutMeData.image
    imageSource.alt = "Loading..."
    image.appendChild(imageSource)

    mediaContent = document.createElement('div')
    mediaContent.className = "media-content"
    media.appendChild(mediaContent)

    content = document.createElement('div')
    content.className = "content"
    content.style = "padding-top: 1%;"
    mediaContent.appendChild(content)

    title = document.createElement('p')
    title.className = "title is-5"
    content.appendChild(title)

    strong = document.createElement('strong')
    strong.innerHTML = "About Me"
    title.appendChild(strong)

    description = document.createElement('p')
    description.style = "padding-right: 1%; padding-bottom: 2%;"
    description.innerHTML = "I am a graduate from Worcester Polytechnic Institute, where I earned a double major in Computer Science and Interactive Media and Game Development. As a student from WPI, I have gained valuable classroom and project experiences that I am looking to leverage. WPI’s philosophy of project based learning and its stress on team based projects as part of the curriculum have helped me gain not only exposure to topics within my majors, but invaluable experience working and collaborating as a member of a team in order to gain hands-on training as well. I am adaptable and driven with a strong work ethic and the ability to thrive in team-based or individually motivated settings."
    content.append(description);
}

function createMobileAboutMe(aboutMeData) {
    base = document.createElement('div');
    base.className = "is-hidden-desktop columns";
    base.style = "padding: 5%;"
    aboutMeBody.appendChild(base);

    frame = document.createElement('div');
    frame.className = "box has-background-grey-lighter";
    base.appendChild(frame);

    card = document.createElement('div')
    card.className = "card"
    frame.appendChild(card)

    media = document.createElement('div')
    media.className = "card-image"
    card.appendChild(media)

    image = document.createElement('figure')
    image.className = "image"
    media.appendChild(image)

    imageSource = document.createElement('img')
    imageSource.src = aboutMeData.image
    imageSource.alt = "Loading..."
    image.appendChild(imageSource)

    cardContent = document.createElement('div')
    cardContent.className = "card-content"
    card.appendChild(cardContent)

    media = document.createElement('div')
    media.className = "media"
    cardContent.appendChild(media)

    mediaContent = document.createElement('div')
    mediaContent.className = "media-content"
    media.appendChild(mediaContent)

    title = document.createElement('p')
    title.className = "title is-5"
    mediaContent.appendChild(title)

    strong = document.createElement('strong')
    strong.innerHTML = "About Me"
    title.appendChild(strong)

    description = document.createElement('p')
    description.style = "padding-right: 1%; padding-bottom: 2%;"
    description.innerHTML = "I am a graduate from Worcester Polytechnic Institute, where I earned a double major in Computer Science and Interactive Media and Game Development. As a student from WPI, I have gained valuable classroom and project experiences that I am looking to leverage. WPI’s philosophy of project based learning and its stress on team based projects as part of the curriculum have helped me gain not only exposure to topics within my majors, but invaluable experience working and collaborating as a member of a team in order to gain hands-on training as well. I am adaptable and driven with a strong work ethic and the ability to thrive in team-based or individually motivated settings."
    mediaContent.appendChild(description);
}

function createCard(cardData) {
    base = document.createElement('div');
    base.className = "column is-one-third-desktop is-full-touch"
    cardBody.appendChild(base)

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