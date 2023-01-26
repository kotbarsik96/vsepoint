const resolutions = [
    "1920x1080",
    "1536x864",
    "1280x720",
    "800x600",
    "853x683",
    "1024x819",
    "1280x768",
    "1280x1024",
    "1024x614"
];
let currentResolution = null;

async function adaptOnResize() {
    const wrapperSvg = document.querySelector(".wrapper__svg");
    const svg = document.querySelector(".wrapper__svg > svg");

    const windowWidth = document.documentElement.clientWidth || window.innerWidth;
    const windowHeight = document.documentElement.clientHeight || window.innerHeight;

    const closestResolution = findClosestResolution(windowWidth, windowHeight);
    if (!closestResolution || closestResolution === currentResolution) return;

    const request = await fetch(`sizes/${closestResolution}.svg`);
    const layout = await request.text();
    currentResolution = closestResolution;

    if (svg) svg.remove();
    wrapperSvg.insertAdjacentHTML("afterbegin", layout);
    clear();
    setTimeout(clear, 0);

    function clear() {
        const svgChildren = document.querySelectorAll(".wrapper__svg > svg");
        if (svgChildren.length > 1) {
            svgChildren[0].remove();
        }
    }
}
function findClosestResolution(wWidth, wHeight) {
    const widths = resolutions.map(res => res.split("x")[0]);
    const heights = resolutions.map(res => res.split("x")[1]);

    let closestWidth = widths.sort((w1, w2) => {
        w1 = parseInt(w1);
        w2 = parseInt(w2);

        const res1 = Math.abs(wWidth - w1);
        const res2 = Math.abs(wWidth - w2);
        if (res1 < res2) return -1;
        if (res1 > res2) return 1;
        return 0;
    })[0];
    let closestHeight = heights.sort((h1, h2) => {
        h1 = parseInt(h1);
        h2 = parseInt(h2);

        const res1 = Math.abs(wHeight - h1);
        const res2 = Math.abs(wHeight - h2);
        if (res1 < res2) return -1;
        if (res1 > res2) return 1;
        return 0;
    })[0];

    closestWidth = closestWidth.toString();
    closestHeight = closestHeight.toString();
    let closestByFullmatch = resolutions
        .filter(res => res.startsWith(closestWidth))
        .find(res => res.split("x")[1].includes(closestHeight));
    let closestByWidthMatch = resolutions.find(res => res.startsWith(closestWidth));

    return closestByFullmatch ? closestByFullmatch : closestByWidthMatch;
}

adaptOnResize();
window.addEventListener("resize", adaptOnResize);