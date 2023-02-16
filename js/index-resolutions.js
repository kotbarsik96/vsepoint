const resolutions = [
    "414x736",
    "480x360",
    "800x600",
    "853x683",
    "1024x614",
    "1024x819",
    "1152x647",
    "1152x872",
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

const mobileMedia = window.matchMedia("(max-width: 447px)");

function adaptBackground() {
    const url = `sizes/${currentResolution}.svg`;
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