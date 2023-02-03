const resolutions = [
    "800x600",
    "853x683",
    "1024x614",
    "1024x819",
    "1280x768",
    "1280x1024",
    "1320x743",
    "1584x891",
    "1980x1114"
];

document.addEventListener("adapted", () => {
    adaptBackground();
    setLinks();
});
window.addEventListener("resize", adaptBackground);

const background = document.querySelector(".background"),
    backgroundLeftTopCorner = document.querySelector(".background__left-top-corner");

function adaptBackground() {
    const backgroundEndpoint = getCoords(document.querySelector("#vertical-stripe")).right;

    background.style.width = `${backgroundEndpoint}px`;
    backgroundLeftTopCorner.style.cssText = `
        width: ${getCoords(document.querySelector("#top-rectangle")).right}px;
        height: ${getCoords(document.querySelector("#top-rectangle")).top}px;
    `;

    const verticalContWidth = backgroundEndpoint - backgroundLeftTopCorner.clientWidth,
        verticalContLeft = backgroundLeftTopCorner.clientWidth,
        verticalContBottom = backgroundLeftTopCorner.clientHeight;
    // верхние полоски
    setVertical(
        ".background__top-stripes",
        "#vertical-stripe",
        verticalContWidth,
        verticalContLeft - 1
    );
    const smallestTopStripe = document.querySelector("#smallest-v-stripe");
    if (smallestTopStripe) {
        const w = smallestTopStripe.getBoundingClientRect().width;
        const verticalStripeSelector = ".background__top-stripes .vertical-stripe";
        const diff = document.querySelectorAll(verticalStripeSelector)[2].getBoundingClientRect()
            .width - w;
        const firstVerticalStripe = document.querySelector(verticalStripeSelector);
        const oldShift = parseInt(firstVerticalStripe.getAttribute("x"));

        firstVerticalStripe.setAttribute("width", w + diff * 2);
    }

    // нижние полоски
    setVertical(
        ".background__bottom-stripes",
        "#vertical-stripe-bottom",
        verticalContWidth,
        verticalContLeft - 1.5
    );

    const horizontalHeight = getCoords(document.querySelector("#horizontal-stripe")).bottom;
    setHorizontal(
        ".background__left-stripes",
        "#horizontal-stripe",
        horizontalHeight - verticalContBottom,
        verticalContBottom
    );
    document.querySelector(".background__left-stripes")
        .style.width = getCoords(document.querySelector(".wrapper__svg > svg")).left + 10;


    function setVertical(containerSelector, stripeSelector, containerWidth, leftPosition) {
        const container = document.querySelector(containerSelector),
            exampleStripe = document.querySelector(stripeSelector),
            exmpStripeBox = exampleStripe.getBoundingClientRect(),
            containerStripes = container.querySelectorAll(".vertical-stripe");

        container.style.width = `${containerWidth}px`;
        container.style.left = `${leftPosition}px`;
        containerStripes.forEach((stripe, index) => {
            stripe.setAttribute("width", exmpStripeBox.width);
            stripe.setAttribute("x", exmpStripeBox.width * index);
        });
    }
    function setHorizontal(containerSelector, stripeSelector, containerHeight, containerTop) {
        const container = document.querySelector(containerSelector),
            exampleStripe = document.querySelector(stripeSelector),
            exmpStripeBox = exampleStripe.getBoundingClientRect(),
            containerStripes = container.querySelectorAll(".horizontal-stripe");

        container.style.height = `${containerHeight}px`;
        container.style.top = `${containerTop}px`;
        containerStripes.forEach((stripe, index) => {
            stripe.setAttribute("height", exmpStripeBox.height);
            stripe.setAttribute("y", exmpStripeBox.height * index);
        });
    }
}

function setLinks(){
    const monday = document.querySelector("#monday-link");
    const tuesday = document.querySelector("#tuesday-link");
    const wednesday = document.querySelector("#wednesday-link");
    const thursday = document.querySelector("#thursday-link");
    const friday = document.querySelector("#friday-link");

    monday.addEventListener("click", () => routeTo("1/"));
    tuesday.addEventListener("click", () => routeTo("2/"));
    wednesday.addEventListener("click", () => routeTo("3/"));
    thursday.addEventListener("click", () => routeTo("4/"));
    friday.addEventListener("click", () => routeTo("5/"));

    function routeTo(path){
        const link = document.createElement("a");
        link.style.cssText = "visibility: hidden; position: absolute;";
        link.setAttribute("href", `/vsepoint/${path}`);
        link.click();
    }
}