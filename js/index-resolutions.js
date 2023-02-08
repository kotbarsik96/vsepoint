const resolutions = [
    "414x736",
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
    const verticalStripe = document.querySelector("#vertical-stripe");
    if(!verticalStripe) return;
    const backgroundEndpoint = getCoords(verticalStripe).right;
    const svgCoords = getCoords(document.querySelector(".wrapper__svg > svg"));

    background.style.width = `${backgroundEndpoint}px`;
    // backgroundLeftTopCorner.style.cssText = `
    //     width: ${getCoords(document.querySelector("#top-rectangle")).right}px;
    //     height: ${getCoords(document.querySelector("#top-rectangle")).top}px;
    // `;

    // const verticalContWidth = backgroundEndpoint - backgroundLeftTopCorner.clientWidth,
    //     verticalContLeft = backgroundLeftTopCorner.clientWidth,
    // verticalContBottom = backgroundLeftTopCorner.clientHeight;
    // // верхние полоски
    // setVertical(
    //     ".background__top-stripes",
    //     "#vertical-stripe",
    //     verticalContWidth,
    //     verticalContLeft - 1
    // );
    // document.querySelector(".background__top-stripes")
    //     .style.height = `${svgCoords.top}px`;
    // const smallestTopStripe = document.querySelector("#smallest-v-stripe");
    // if (smallestTopStripe) {
    //     const w = smallestTopStripe.getBoundingClientRect().width;
    //     const verticalStripeSelector = ".background__top-stripes .vertical-stripe";
    //     const diff = document.querySelectorAll(verticalStripeSelector)[2].getBoundingClientRect()
    //         .width - w;
    //     const firstVerticalStripe = document.querySelector(verticalStripeSelector);

    //     firstVerticalStripe.setAttribute("width", w + diff * 2);
    // }

    // // нижние полоски
    // setVertical(
    //     ".background__bottom-stripes",
    //     "#vertical-stripe-bottom",
    //     verticalContWidth,
    //     verticalContLeft - 1.5
    // );
    // const windowHeight = document.documentElement.clientHeight || window.innerHeight;
    // document.querySelector(".background__bottom-stripes")
    //     .style.height = `${windowHeight - svgCoords.bottom}px`;

    // горизонтальные полоски
    const horizontalHeight = getCoords(document.querySelector("#horizontal-stripe")).bottom;
    setHorizontal(
        ".background__left-stripes",
        "#horizontal-stripe",
        svgCoords.bottom - svgCoords.top,
        svgCoords.top
    );
    document.querySelector(".background__left-stripes")
        .style.width = `${svgCoords.left + 10}px`;

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

function setLinks() {
    const mondays = document.querySelectorAll(".monday-link"),
        tuesdays = document.querySelectorAll(".tuesday-link"),
        wednesdays = document.querySelectorAll(".wednesday-link"),
        thursdays = document.querySelectorAll(".thursday-link"),
        fridays = document.querySelectorAll(".friday-link");

    mondays.forEach(m => m.addEventListener("click", () => routeTo("1/")));
    tuesdays.forEach(t => t.addEventListener("click", () => routeTo("2/")));
    wednesdays.forEach(w => w.addEventListener("click", () => routeTo("3/")));
    thursdays.forEach(th => th.addEventListener("click", () => routeTo("4/")));
    fridays.forEach(f => f.addEventListener("click", () => routeTo("5/")));

    function routeTo(path) {
        const link = document.createElement("a");
        link.style.cssText = "visibility: hidden; position: absolute;";
        link.setAttribute("href", `/vsepoint/${path}`);
        link.click();
    }
}