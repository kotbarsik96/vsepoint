const ratios = [
    "320x480", 
    "320x568",
    "360x780",
    "14x10",
    // "16x10",
    "16x9",
    "2x1",
    "22x10",
    "25x10"
];

let currentRatio = null;

async function doAdapt() {
    const wrapperSvg = document.querySelector(".wrapper__svg");

    const wWidth = document.documentElement.clientWidth || window.innerWidth;
    const wHeight = document.documentElement.clientHeight || window.innerHeight;
    const divisor = findLeastClosestDivisor(wWidth, wHeight);
    const ratio = findClosestRatio(wWidth, wHeight, divisor);

    if (ratio === currentRatio) return;

    // desktop ratio
    const response = await fetch(`sizes/${ratio}.svg`);
    const layout = await response.text();
    currentRatio = ratio;
    doLayout(layout);
    toggleMaxHeight();

    function doLayout(layout) {
        wrapperSvg.innerHTML = "";
        wrapperSvg.insertAdjacentHTML("afterbegin", layout);
    }
    function toggleMaxHeight() {
        const wrapperSvg = document.querySelector(".wrapper__svg");
        const svg = document.querySelector(".wrapper__svg > svg");

        if (isMobileBrowser()) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            const value = 60;
            svg.style.maxHeight = `calc(100vh - ${headerHeight + value}px)`;
            wrapperSvg.style.alignSelf = "flex-start";
        } else {
            svg.style.removeProperty("max-height");
            wrapperSvg.style.alignSelf = "center";
        }
    }
}
function findClosestRatio(wWidth, wHeight, divisor) {

    let width = parseFloat(wWidth / divisor);
    let height = parseFloat(wHeight / divisor);

    const otherValues = ratios.map(val => {
        const nums = val.split("x");
        return parseInt(nums[0]) / parseInt(nums[1]);
    });
    const value = width / height;
    const closest = [...otherValues].sort((val1, val2) => {
        const res1 = Math.abs(value - val1);
        const res2 = Math.abs(value - val2);
        if (res1 < res2) return -1;
        if (res1 > res2) return 1;
        return 0;
    })[0];
    const ratioIndex = otherValues.indexOf(closest);
    const ratio = ratios[ratioIndex];

    console.log(ratio);

    return ratio;
}

doAdapt();
alignArrowsVertically();
window.addEventListener("resize", doAdapt);