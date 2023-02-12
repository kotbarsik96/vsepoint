const resolutions = [
    "414x736",
    "480x360",
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

const mobileMedia = window.matchMedia("(max-width: 447px)");

const background = document.querySelector(".background"),
    backgroundLeftTopCorner = document.querySelector(".background__left-top-corner");

function adaptBackground() {
    document.querySelectorAll(".link-tip").forEach(link => link.remove());
    if (mobileMedia.matches) return;

    const svg = document.querySelector(".wrapper__svg > svg");

    setBackground();
    setLeftStripes();

    function setBackground() {
        const bg = document.querySelector(".background"),
            leftEdgePoint = getCoords(document.querySelector("#monday")).right;
        bg.style.top = `${getCoords(svg).top}px`;
        bg.style.width = `${leftEdgePoint}px`;
    }
    function setLeftStripes() {
        const originalLeftStripes = document.querySelectorAll("#horizontal-stripes-original > g"),
            backgroundLeftStripes = document.querySelectorAll(".background__left-stripes > rect"),
            bgLsContainer = document.querySelector(".background__left-stripes");

        let shift = 0;
        backgroundLeftStripes.forEach((stripe, index) => {
            const original = originalLeftStripes[index];
            if (!original) return;

            const heightRaw = original.getBoundingClientRect().height;
            const height = heightRaw - (heightRaw / 100 * 3.2);
            stripe.setAttribute("height", height);
            stripe.setAttribute("y", shift);
            shift += height;
        });
        bgLsContainer.style.width = `${getCoords(svg).left + 10}px`;
    }
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
        if(!link) return;
        link.addEventListener("click", () => routeTo("1/"));
        initHover(link, `Перейти на отдельную страницу "Понедельник"`);
    });
    tuesdays.forEach(link => {
        if(!link) return;
        link.addEventListener("click", () => routeTo("2/"));
        initHover(link, `Перейти на отдельную страницу "Вторник"`);
    });
    wednesdays.forEach(link => {
        if(!link) return;
        link.addEventListener("click", () => routeTo("3/"));
        initHover(link, `Перейти на отдельную страницу "Среда"`);
    });
    thursdays.forEach(link => {
        if(!link) return;
        link.addEventListener("click", () => routeTo("4/"));
        initHover(link, `Перейти на отдельную страницу "Четверг"`);
    });
    fridays.forEach(link => {
        if(!link) return;
        link.addEventListener("click", () => routeTo("5/"));
        initHover(link, `Перейти на отдельную страницу "Пятница"`);
    });

    risunokMain.forEach(link => {
        if(!link) return;
        initHover(link, "Нажмите мышкой, чтобы скачать", true);
    });

    function routeTo(path) {
        const link = document.createElement("a");
        link.style.cssText = "visibility: hidden; position: absolute;";
        link.setAttribute("href", `/vsepoint/${path}`);
        link.click();
    }
    function initHover(link, text, stickyToCursor = false) {
        const wrapper = document.querySelector(".wrapper");
        link.addEventListener("mouseover", onMouseover);
        link.addEventListener("mouseleave", onMouseleave);
        const tip = document.createElement("div");
        tip.classList.add("link-tip");
        tip.innerHTML = text;
        if(stickyToCursor) link.style.position = "fixed";

        function onMouseover() {
            link.addEventListener("mousemove", onMousemove);
            if (!tip.closest("body")) wrapper.append(tip);
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
                tip.style.top = `${getCoords(event.currentTarget).top - 40}px`;
                tip.style.left = `${getCoords(event.currentTarget).left}px`;
            }
        }
    }
}