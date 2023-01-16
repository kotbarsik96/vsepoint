// инициализация элементов-классов
const inittedInputs = [];

function findInittedInput(selector, isAll = false) {
    // isAll == true: вернет array, isAll == false: вернет первый найденный по селектору элемент
    const selectorNodes = Array.from(document.querySelectorAll(selector));
    if (!isAll) {
        const input = inittedInputs.find(arrayHandler);
        return input || null;
    } else {
        const inputs = inittedInputs.filter(arrayHandler);
        return inputs || null;
    }

    function arrayHandler(inpClass) {
        return selectorNodes.includes(inpClass.rootElem);
    }
}

function findInittedInputByFlag(instanceFlag, isAll = false) {
    // isAll == true: вернет array, isAll == false: вернет первый найденный по флагу элемент
    if (isAll) {
        const inputs = inittedInputs.filter(arrayHandler);
        return inputs;
    } else {
        const input = inittedInputs.find(arrayHandler);
        return input;
    }

    function arrayHandler(inpClass) {
        let matches = inpClass.instanceFlag === instanceFlag;
        return matches;
    }
}

function createElement(tagName, className, insertingHTML) {
    let element = document.createElement(tagName);
    if (className) element.className = className;
    if (insertingHTML) element.insertAdjacentHTML("afterbegin", insertingHTML);
    return element;
}
let inittingSelectors = [
    { selector: ".cookie", classInstance: Cookie },
    { selector: ".resume__choose", classInstance: ChooseTabs },
    { selector: ".resume__rubricks", classInstance: Rubricks },
    { selector: "#options", classInstance: Options },
];


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

const inittingInputsBodyObserver = new MutationObserver(() => {
    initInputs();
});
inittingInputsBodyObserver.observe(document.body, { childList: true, subtree: true });
initInputs();