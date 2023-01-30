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

document.addEventListener("adapted", adaptBackground);
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
    setVertical(
        ".background__top-stripes",
        "#vertical-stripe",
        verticalContWidth,
        verticalContLeft - 1
    );
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