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
    backgroundLeftTopCorner = document.querySelector(".background__left-top-corner"),
    backgroundTopStripes = document.querySelector(".background__top-stripes"),
    backgroundLeftStripes = document.querySelector(".background__left-stripes"),
    backgroundLeftBottomCorner = document.querySelector(".background__left-bottom-corner"),
    backgroundBottomStripes = document.querySelector(".background__bottom-stripes"),
    topVerticalStripes = document.querySelectorAll(".vertical-stripe--top"),
    leftHorizontalStripes = document.querySelectorAll(".horizontal-stripe");

function adaptBackground() {
    const svg = document.querySelector(".wrapper__svg > svg"),
        width = svg.clientWidth,
        height = svg.clientHeight;

    const verticalStripe = document.querySelector("#vertical-stripe"),
        topHorizontalStripe = document.querySelector("#top-rectangle"),
        horizontalStripe = document.querySelector("#horizontal-stripe"),
        verticalStripeBottom = document.querySelector("#vertical-stripe-bottom");

    const coords = {
        verticalStripe: getCoords(verticalStripe),
        topHorizontalStripe: getCoords(topHorizontalStripe),
        horizontalStripe: getCoords(horizontalStripe),
        verticalStripeBottom: getCoords(verticalStripeBottom),
    }

    background.style.width = `${getCoords(verticalStripe).right}px`;
    backgroundLeftTopCorner.style.cssText = `
        width: ${coords.topHorizontalStripe.right}px;
        height: ${coords.topHorizontalStripe.top}px;
    `;
    backgroundLeftStripes.style.cssText = `
        top: ${coords.topHorizontalStripe.top}px;
        width: ${coords.topHorizontalStripe.right}px;
    `;
    backgroundTopStripes.style.cssText = `
        left: ${coords.topHorizontalStripe.right}px;
        width: ${coords.verticalStripe.right - coords.topHorizontalStripe.right}px;
        height: ${coords.topHorizontalStripe.bottom}px;
    `;
    backgroundBottomStripes.style.cssText = `
        left: ${coords.topHorizontalStripe.right}px;
        width: ${coords.verticalStripe.right - coords.topHorizontalStripe.right}px;
    `;

    const topVerticalStripeWidth = verticalStripe.getBoundingClientRect().width,
        leftHorizontalStripeHeight = topHorizontalStripe.getBoundingClientRect().height;

    topVerticalStripes.forEach((stripe, index) => {
        if (index === 0) {
            const smallest = document.querySelector("#smallest-v-stripe");
            const width = smallest.getBoundingClientRect().width + .75;
            stripe.style.width = stripe.style.flexBasis = `${width}px`;
            return;
        }

        stripe.style.width = stripe.style.flexBasis = `${topVerticalStripeWidth}px`;
    });
    leftHorizontalStripes.forEach(stripe => {
        stripe.style.height = `${leftHorizontalStripeHeight}px`;
    });
}