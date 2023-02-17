const ratios = [
    "1x1",
    "2x1",
    "4x3",
    "5x4",
    "16x9",
    "16x10",
    "19x10",
    "21x9",
    "25x16",
    "64x27"
];

function isMobileRatio() {
    const windowWidth = document.documentElement.clientWidth || window.innerWidth;
    const windowHeight = document.documentElement.clientHeight || window.innerHeight;

    return windowWidth < windowHeight;
}
function findLeastClosestDivisor(num1, num2) {
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    const leastNum = Math.min(num1, num2);
    let value = leastNum;
    while (num1 % value !== 0 || num2 % value !== 0) value--;

    if (value === 1) value = leastNum;

    return value;
}

function onResize() {
    doAdapt();
}

let currentRatio = null;
async function doAdapt(event) {
    const wrapperSvg = document.querySelector(".wrapper__svg");

    const wWidth = document.documentElement.clientWidth || window.innerWidth;
    const wHeight = document.documentElement.clientHeight || window.innerHeight;
    const divisor = findLeastClosestDivisor(wWidth, wHeight);
    const ratio = findClosestRatio(wWidth, wHeight, divisor);

    if (ratio === currentRatio) {
        adaptBackground();
        return;
    };

    // mobile ratio
    if (isMobileRatio()) {
        const response = await fetch("sizes/mobile.svg");
        const layout = await response.text();
        doLayout(layout);
        document.body.style.background = "#fff";
        toggleMaxHeight();
    }
    // mobile browser и 1x1 соотношение
    else if(isMobileBrowser() && ratio === "1x1") {
        const response = await fetch("sizes/mobile-1x1.svg");
        const layout = await response.text();
        currentRatio = ratio;
        doLayout(layout);
        document.body.style.removeProperty("background");
        toggleMaxHeight();
    }
    // desktop ratio
    else {
        const response = await fetch(`sizes/${ratio}.svg`);
        const layout = await response.text();
        currentRatio = ratio;
        doLayout(layout);
        document.body.style.removeProperty("background");
        toggleMaxHeight();
    }

    function doLayout(layout) {
        wrapperSvg.innerHTML = "";
        wrapperSvg.insertAdjacentHTML("afterbegin", layout);
        setLinks();
        adaptBackground();
    }
    function toggleMaxHeight() {
        if (isMobileBrowser() || isMobileRatio()) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            const value = window.matchMedia("(max-width: 447px)").matches   
                ? -20
                : 20;
            document.querySelector(".wrapper__svg > svg").style.maxHeight = `calc(90vh - ${headerHeight + value}px)`;
        } else {
            document.querySelector(".wrapper__svg > svg").style.removeProperty("max-height");
        }
    }
}
function findClosestRatio(wWidth, wHeight, divisor) {
    let width = parseInt(wWidth / divisor);
    let height = parseInt(wHeight / divisor);

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

    return ratio;
}
function adaptBackground() {
    if (isMobileRatio()) return;

    const url = `sizes/${currentRatio}.svg`;
    const img = new Image();
    img.onload = () => {
        const svg = document.querySelector(".wrapper__svg > svg");
        const svgContainer = document.querySelector(".wrapper__svg");
        img.style.cssText = "position: absolute; z-index: -999; top: -100vh;";
        document.body.append(img);
        const ratio = img.width / img.height;
        const height = svgContainer.offsetHeight - document.querySelector(".header").offsetHeight;
        const width = ratio * height;
        svg.style.height = `${height}px`;
        svg.style.width = `${width}px`;
        img.remove();
    };
    img.src = url;
}
function setLinks() {
    const mondays = [document.querySelector("#monday-link")],
        tuesdays = [document.querySelector("#tuesday-link")],
        wednesdays = [document.querySelector("#wednesday-link")],
        thursdays = [document.querySelector("#thursday-link")],
        fridays = [document.querySelector("#friday-link")]
    risunokMain = [
        document.querySelector("#risunok-main"),
        document.querySelector("#svg-background")
    ];

    mondays.forEach(link => {
        if (!link) return;
        link.addEventListener("click", () => routeTo("1/"));
        initHover(link, `Перейти на отдельную страницу "Понедельник"`);
    });
    tuesdays.forEach(link => {
        if (!link) return;
        link.addEventListener("click", () => routeTo("2/"));
        initHover(link, `Перейти на отдельную страницу "Вторник"`);
    });
    wednesdays.forEach(link => {
        if (!link) return;
        link.addEventListener("click", () => routeTo("3/"));
        initHover(link, `Перейти на отдельную страницу "Среда"`);
    });
    thursdays.forEach(link => {
        if (!link) return;
        link.addEventListener("click", () => routeTo("4/"));
        initHover(link, `Перейти на отдельную страницу "Четверг"`);
    });
    fridays.forEach(link => {
        if (!link) return;
        link.addEventListener("click", () => routeTo("5/"));
        initHover(link, `Перейти на отдельную страницу "Пятница"`);
    });

    risunokMain.forEach(link => {
        if (!link) return;
        initHover(link, "Нажмите мышкой, чтобы скачать");
    });

    function routeTo(path) {
        const link = document.createElement("a");
        link.style.cssText = "visibility: hidden; position: absolute;";
        link.setAttribute("href", `/vsepoint/${path}`);
        link.click();
    }
    function initHover(link, text, stickyToCursor = false) {
        link.addEventListener("mouseover", onMouseover);
        link.addEventListener("mouseleave", onMouseleave);
        const tip = document.createElement("div");
        tip.classList.add("link-tip");
        const isDownloadLink = link.getAttribute("id") === "risunok-main"
            || link.getAttribute("id") === "svg-background";
        if (isDownloadLink)
            tip.classList.add("link-tip--download");
        tip.innerHTML = text;
        if (stickyToCursor) link.style.position = "fixed";
        document.addEventListener("click", onMouseleave);

        function onMouseover() {
            link.addEventListener("mousemove", onMousemove);
            if (!tip.closest("body")) document.body.append(tip);
        }
        function onMouseleave() {
            link.removeEventListener("mousemove", onMousemove);
            tip.remove();
        }
        function onMousemove(event) {
            if (stickyToCursor) {
                tip.style.top = `${event.clientY - 50}px`;
                tip.style.left = `${event.clientX}px`;
            } else {
                const linkHalf = tip.offsetWidth / 2;
                const targ = event.currentTarget;
                tip.style.top = `${event.clientY - 50}px`;
                tip.style.left = `${getCoords(targ).left + targ.getBoundingClientRect().width / 2 - linkHalf}px`;
                if (isDownloadLink) {
                    const bg = document.querySelector("#svg-background");
                    tip.style.left = `${getCoords(bg).left + bg.getBoundingClientRect().width / 2 - linkHalf}px`;
                }
            }
        }
    }
}

doAdapt();
window.addEventListener("resize", doAdapt);