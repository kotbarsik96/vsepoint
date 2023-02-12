function createElement(tagName, className, insertingHTML) {
    let element = document.createElement(tagName);
    if (className) element.className = className;
    if (insertingHTML) element.insertAdjacentHTML("afterbegin", insertingHTML);
    return element;
}


class FullsizeImage {
    constructor(node) {
        this.onImageClick = this.onImageClick.bind(this);
        this.onPopupClick = this.onPopupClick.bind(this);

        this.rootElem = node;
        this.rootElem.addEventListener("click", this.onImageClick);
    }
    onImageClick() {
        this.createPopup();
        const img = new Image();
        img.src = this.rootElem.src;
        img.onload = () => {
            this.insertBody(img);
        };
    }
    createPopup() {
        const popup = createElement("div", "popup");
        const body = createElement("div", "popup__body");

        popup.append(body);
        this.insertPopup(popup);

        popup.addEventListener("click", this.onPopupClick);

        this.popup = { popup, body };
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
    }
    onPopupClick(event) {
        const isException = event.target.closest(".popup__body") && event.target !== this.popup.body;
        if (isException) return;

        this.removePopup();
    }
    removePopup() {
        this.popup.popup.style.cssText = "background: rgba(0, 0, 0, 0); transition-duration: .5s;";
        this.popup.body.style.cssText = "transform: translate(0, -100%); transition-duration: .5s;";
        setTimeout(() => this.popup.popup.remove(), 500);
    }
}

// инициализация элементов-классов
let inittingSelectors = [
    { selector: "[data-fullsize-image]", classInstance: FullsizeImage },
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