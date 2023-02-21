const ratios = [
    "14x10", // 1.4
    "16x10", // 1.6
    "16x9", // 1.7778
    "2x1", // 2
    "22x10", // 2.2
];

let currentRatio = null;

async function doAdapt() {
    const wrapperSvg = document.querySelector(".wrapper__svg");

    const wWidth = document.documentElement.clientWidth || window.innerWidth;
    const wHeight = document.documentElement.clientHeight || window.innerHeight;
    const divisor = findLeastClosestDivisor(wWidth, wHeight);
    const ratio = findClosestRatio(wWidth, wHeight, divisor);

    const isMobileR = isMobileRatio();

    if (ratio === currentRatio && !isMobileR) return;

    // mobile ratio
    if (isMobileR) {
        const response = await fetch("sizes/mobile.svg");
        const layout = await response.text();
        doLayout(layout);
        toggleMaxHeight();
    }
    // desktop ratio
    else {
        const response = await fetch(`sizes/${ratio}.svg`);
        const layout = await response.text();
        currentRatio = ratio;
        doLayout(layout);
        toggleMaxHeight();
    }

    function doLayout(layout) {
        wrapperSvg.innerHTML = "";
        wrapperSvg.insertAdjacentHTML("afterbegin", layout);
    }
    function toggleMaxHeight() {
        if (isMobileBrowser() || isMobileRatio()) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            const value = 60;
            document.querySelector(".wrapper__svg > svg").style.maxHeight = `calc(100vh - ${headerHeight + value}px)`;
        } else {
            document.querySelector(".wrapper__svg > svg").style.removeProperty("max-height");
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
window.addEventListener("resize", doAdapt);