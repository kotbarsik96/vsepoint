const ratios = [
    "10x10",
    "2x1",
    "4x3",
    "5x4",
    "11x10",
    "12x10",
    "13x10",
    "16x9",
    "16x10",
    "19x10",
    "21x9",
    "25x16",
    "64x27"
];

let currentRatio = null;
async function doAdapt() {
    const wrapperSvg = document.querySelector(".wrapper__svg");

    const wWidth = document.documentElement.clientWidth || window.innerWidth;
    const wHeight = document.documentElement.clientHeight || window.innerHeight;
    const divisor = findLeastClosestDivisor(wWidth, wHeight);
    const ratio = findClosestRatio(wWidth, wHeight, divisor);

    const isMobileR = isMobileRatio();

    if (ratio === currentRatio && !isMobileR) {
        adaptBackground();
        return;
    };

    // mobile ratio
    if (isMobileR) {
        const response = await fetch("sizes/mobile.svg");
        const layout = await response.text();
        doLayout(layout);
        document.body.style.background = "#fff";
        toggleMaxHeight();
    }
    // mobile browser
    else if (isMobileBrowser()) {
        const response = await fetch(`sizes/mobile-${ratio}.svg`);
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
    console.log(currentRatio);

    function doLayout(layout) {
        wrapperSvg.innerHTML = "";
        wrapperSvg.insertAdjacentHTML("afterbegin", layout);
        setLinks();
        adaptBackground();
    }
    function toggleMaxHeight() {
        const svg = document.querySelector(".wrapper__svg>svg");

        if (isMobileBrowser()) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            svg.style.maxHeight = `calc(100vh - ${headerHeight}px - 55px)`;
        } else {
            svg.style.removeProperty("max-height");
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
        const height = svgContainer.offsetHeight;
        const width = ratio * height;
        svg.style.height = `${height}px`;
        svg.style.width = `${width}px`;

        img.remove();

        const headerContainers = document.querySelectorAll(".header__container");
        const wWidth = document.documentElement.clientWidth || window.innerWidth;
        const wHeight = document.documentElement.clientHeight || window.innerHeight;
        const mediaMatch = wWidth / wHeight > 1.59 && wWidth / wHeight < 2.3;
        const leftPoint = getCoords(document.querySelector("#g29090")).left;
        const rightPoint = getCoords(document.querySelector("#monday-link")).right;
        const maxHeaderContWidth = rightPoint - leftPoint;
        console.log(mediaMatch, wWidth / wHeight);

        if (mediaMatch && maxHeaderContWidth > 1500) {
            headerContainers.forEach(cont => {
                cont.style.maxWidth = `${maxHeaderContWidth}px`;
                cont.classList.add("header__container--adapted");
            });
        } else {
            headerContainers.forEach(cont => {
                cont.style.removeProperty("max-width");
                cont.classList.remove("header__container--adapted");
            });
        }
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