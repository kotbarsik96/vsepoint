const resolutions = [
    "1920x1080",
    "1536x864",
    "1280x720"
];
let currentLayout = null;

async function adaptOnResize() {
    const wrapperSvg = document.querySelector(".wrapper__svg");
    const svg = document.querySelector(".wrapper__svg > svg");

    const windowWidth = document.documentElement.clientWidth || window.innerWidth;
    const windowHeight = document.documentElement.clientHeight || window.innerHeight;

    const closestResolution = findClosestResolution(windowWidth, windowHeight);
    if (!closestResolution || closestResolution === currentLayout) return;

    const request = await fetch(`sizes/${closestResolution}.svg`);
    const layout = await request.text();
    currentLayout = closestResolution;

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
function findClosestResolution(wWidth) {
    const widths = resolutions.map(res => res.split("x")[0]);

    let closestWidth = widths.sort((w1, w2) => {
        w1 = parseInt(w1);
        w2 = parseInt(w2);

        const res1 = Math.abs(wWidth - w1);
        const res2 = Math.abs(wWidth - w2);
        if (res1 < res2) return -1;
        if (res1 > res2) return 1;
        return 0;
    })[0];
    if (!closestWidth) return;

    closestWidth = closestWidth.toString();
    const closestResolution = resolutions.find(res => res.startsWith(closestWidth));

    return closestResolution;
}

adaptOnResize();
window.addEventListener("resize", adaptOnResize);