// определить браузер
function getBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    let browser = [
        userAgent.match(/chrome/),
        userAgent.match(/opera/),
        userAgent.match(/safari/),
        userAgent.match(/firefox/)
    ].find(br => br);
    if (browser) browser = browser[0];

    return browser;
}
function isMobileBrowser() {
    let isMobile = false;
    const userAgent = navigator.userAgent;
    const mobilesRegExp =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    if (mobilesRegExp.test(userAgent)) isMobile = true;

    return isMobile;
}
const browser = getBrowser();

function browsersFix() {
    if (browser !== "firefox" && browser !== "safari") {
        let addFixClass = [];
        // addFixClass = addFixClass
        //     .concat(Array.from(document.querySelectorAll(".header__button.link")));

        addFixClass.forEach(el => {
            el.classList.add("__chromium-fix");
        });
    }
    if (browser === "firefox") {
        let addMozfixClass = [];
        addMozfixClass = addMozfixClass
            .concat(Array.from(document.querySelectorAll(".header__mobile-signup.button")));
        addMozfixClass = addMozfixClass
            .concat(Array.from(document.querySelectorAll(".button")));

        addMozfixClass.forEach(el => {
            el.classList.add("__moz-fix");
        });
    }
}
browsersFix();

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

function alignArrowsVertically() {
    const arrowLeft = document.querySelector("#l_b");
    const arrowRight = document.querySelector("#r_b");
    const media = window.matchMedia("(max-width: 520px)");

    if(media.matches && isMobileRatio()) arrowLeft.style.transform = arrowRight.style.transform = "translate(0, -60%)";
    else arrowLeft.style.transform = arrowRight.style.transform = "translate(0, -40%)";
}

function getCoords(el) {
    const box = el.getBoundingClientRect();

    return {
        top: box.top + window.pageYOffset,
        left: box.left + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        right: box.right + window.pageXOffset
    }
}

function createElement(tagName, className, insertingHTML) {
    let element = document.createElement(tagName);
    if (className) element.className = className;
    if (insertingHTML) element.insertAdjacentHTML("afterbegin", insertingHTML);
    return element;
}

// найдет ближайший элемент по отношению к node
function findClosest(node, selector) {
    let element = node.querySelector(selector);
    if (!element) {
        do {
            if (!node.parentNode) break;
            element = node.parentNode.querySelector(selector);
            node = node.parentNode;
        } while (!element && node)
    }
    return element;
}

// динамический адаптив: на указанном медиа-запросе (max-width=${query}px) перемещает блоки из одного места в другое посредством замены другого элемента
/* Чтобы работало, нужно: 
    1) создать элемент-"якорь", который будет заменен при адаптиве (достижении медиа-запроса max-width) и указать ему класс, id или любой другой селектор;
    2) элементу, который перемещается при адаптиве, задать атрибут data-dynamic-adaptive="query, selector", где query - значение медиа-запроса (max-width=${query}px), а selector - селектор заменяемого элемента (из шага 1)
*/
class DynamicAdaptive {
    constructor(node) {
        this.onMediaChange = this.onMediaChange.bind(this);

        this.rootElem = node;
        let data = this.rootElem.dataset.dynamicAdaptive.split(", ");
        this.mediaValue = data[0];
        this.mediaQuery = window.matchMedia(`(max-width: ${this.mediaValue}px)`);
        this.adaptiveSelector = data[1];
        this.adaptiveNode = findClosest(this.rootElem, this.adaptiveSelector);
        this.backAnchor = createElement("div");

        this.onMediaChange();
        this.mediaQuery.addEventListener("change", this.onMediaChange);
    }
    onMediaChange() {
        if (this.mediaQuery.matches) {
            this.rootElem.replaceWith(this.backAnchor);
            this.adaptiveNode.replaceWith(this.rootElem);
            this.isReplaced = true;
        } else if (this.isReplaced) {
            this.rootElem.replaceWith(this.adaptiveNode);
            this.backAnchor.replaceWith(this.rootElem);
        }
    }
}

class FullsizeImage {
    constructor(node) {
        this.onImageClick = this.onImageClick.bind(this);
        this.onPopupClick = this.onPopupClick.bind(this);
        this.setCrossPosition = this.setCrossPosition.bind(this);
        this.removePopup = this.removePopup.bind(this);

        this.rootElem = node;
        this.rootElem.addEventListener("click", this.onImageClick);
    }
    onImageClick() {
        this.createPopup();
        const img = new Image();
        img.src = this.rootElem.src;
        img.onload = () => {
            this.img = img;
            this.insertBody(img);
        };
    }
    createPopup() {
        const popup = createElement("div", "popup");
        const body = createElement("div", "popup__body");

        body.insertAdjacentHTML("afterbegin", `
            <svg class="popup__close" fill="#dadada" width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="cross" class="icon glyph"><path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path></svg>
        `);
        popup.append(body);
        this.insertPopup(popup);
        const cross = body.querySelector(".popup__close");

        popup.addEventListener("click", this.onPopupClick);
        cross.addEventListener("click", this.removePopup);

        this.popup = { popup, body, cross };
    }
    insertPopup(popup) {
        popup.style.cssText = "background: rgba(0, 0, 0, 0); transition: 0;";
        document.body.append(popup);
        setTimeout(() => {
            popup.style.removeProperty("background");
            popup.style.removeProperty("transition");
        }, 50);
    }
    insertBody(popupBodyContent) {
        this.popup.body.style.cssText = "transform: translate(0, -100%); transition: 0s;";
        this.popup.body.append(popupBodyContent);
        setTimeout(() => {
            this.popup.body.style.cssText = "transfrom: translate(0, 0);";
        }, 50);

        this.setCrossPosition();
        window.addEventListener("resize", this.setCrossPosition);
    }
    setCrossPosition() {
        const imgCoords = getCoords(this.img);
        this.popup.cross.style.left =
            `${imgCoords.right - this.popup.cross.getBoundingClientRect().width}px`;
        this.popup.cross.style.right = "auto";
    }
    onPopupClick(event) {
        const isException = event.target.closest(".popup__body") && event.target !== this.popup.body;
        if (isException) return;

        this.removePopup();
    }
    removePopup() {
        this.popup.popup.style.cssText = "background: rgba(0, 0, 0, 0); transition-duration: .5s;";
        this.popup.body.style.cssText = "transform: translate(0, -100%); transition-duration: .5s;";
        setTimeout(() => {
            this.popup.popup.remove();
            window.removeEventListener("resize", this.setCrossPosition);
        }, 500);
    }
}

class Header {
    constructor(node) {
        this.onMenuBtnClick = this.onMenuBtnClick.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);

        this.rootElem = node;
        this.menuButtons = this.rootElem.querySelectorAll(".menu-button");

        this.menuButtons.forEach(menuBtn => {
            menuBtn.addEventListener("click", this.onMenuBtnClick);
        });
    }
    onMenuBtnClick(event) {
        const menuBtn = event.currentTarget;
        this.toggleMenu(menuBtn);
    }
    toggleMenu(btn, action = null) {
        show = show.bind(this);
        hide = hide.bind(this);

        if (action) {
            if (action === "show") return show();
            if (action === "hide") return hide();
        }

        btn.classList.contains("__active")
            ? hide()
            : show();

        function show() {
            btn.classList.add("__active")
        }
        function hide() {
            btn.classList.remove("__active")
        }
    }
}

// инициализация элементов-классов
let inittingSelectors = [
    { selector: "[data-dynamic-adaptive]", classInstance: DynamicAdaptive },
    { selector: "[data-fullsize-image]", classInstance: FullsizeImage },
    { selector: ".header", classInstance: Header },
];

const inittedInputs = [];

function createElement(tagName, className, insertingHTML) {
    let element = document.createElement(tagName);
    if (className) element.className = className;
    if (insertingHTML) element.insertAdjacentHTML("afterbegin", insertingHTML);
    return element;
}

function initInputs() {
    inittingSelectors.forEach(selectorData => {
        const selector = selectorData.selector;
        const classInstance = selectorData.classInstance;
        const notInittedNodes = Array.from(document.querySelectorAll(selector))
            .filter(node => {
                let isInitted = Boolean(
                    inittedInputs.find(inpClass => {
                        return inpClass.rootElem === node
                            && inpClass instanceof selectorData.classInstance
                    })
                );
                return isInitted ? false : true;
            });

        notInittedNodes.forEach(inittingNode => {
            inittedInputs.push(new classInstance(inittingNode));
        });
    });
}

let isInitting = false;
const inittingInputsBodyObserver = new MutationObserver(() => {
    if (isInitting) return;

    isInitting = true;
    initInputs();
    setTimeout(() => isInitting = false, 0);
});
inittingInputsBodyObserver.observe(document.body, { childList: true, subtree: true });
initInputs();

alignArrowsVertically();
window.addEventListener("resize", alignArrowsVertically);