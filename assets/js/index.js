const fakeScrollBar = document.querySelector(".fake--scrollbar--bar");

const idOfScroll = document.querySelectorAll(".page--details--item");

const ration = 0.6;

const activate = function(elem) {
    const id = elem.getAttribute("id");
    const anchor = document.querySelector(`a[href='#${id}']`);

    if (anchor === null) {
        return null;
    }
    const newId = parseInt(id.slice(1));

    idOfScroll[2].innerHTML = "0" + newId;
    idOfScroll[2].setAttribute("href", `#c${parseInt(newId)}`);

    if (newId > 1) {
        idOfScroll[1].innerHTML = "0" + parseInt(newId - 1);
        idOfScroll[1].setAttribute("href", `#c${parseInt(newId) - 1}`);
    } else {
        idOfScroll[1].innerHTML = "";
    }
    if (newId > 2) {
        idOfScroll[0].innerHTML = "0" + parseInt(newId - 2);
        idOfScroll[0].setAttribute("href", `#c${parseInt(newId) - 2}`);
    } else {
        idOfScroll[0].innerHTML = "";
    }
    if (newId <= 4) {
        idOfScroll[3].innerHTML = "0" + parseInt(newId + 1);
        idOfScroll[3].setAttribute("href", `#c${parseInt(newId + 1)}`);
    } else {
        idOfScroll[3].innerHTML = "";
    }
    if (newId <= 3) {
        idOfScroll[4].innerHTML = "0" + parseInt(newId + 2);
        idOfScroll[4].setAttribute("href", `#c${parseInt(newId + 2)}`);
    } else {
        idOfScroll[4].innerHTML = "";
    }
};

const callback = function(entries, observer) {
    entries.forEach(function(entry) {
        if (entry.intersectionRatio > 0) {
            activate(entry.target);
        }
    });
};

let observer = null;
const spies = document.querySelectorAll("[data-spy]");

const observe = function(elems) {
    if (observer !== null) {
        elems.forEach((elem) => observer.unobserve(elem));
    }
    const y = Math.round(window.innerHeight * ration);
    observer = new IntersectionObserver(callback, {
        rootMargin: `-${window.innerHeight - y - 1}px 0px -${y}px 0px`,
    });

    spies.forEach((elem) => observer.observe(elem));
};

if (spies.length > 0) {
    observe(spies);
    window.addEventListener("resize", function() {
        observe(spies);
    });
}

window.addEventListener("scroll", (e) => {
    e.preventDefault();
    const percent = Math.floor(
        (window.scrollY / document.body.clientHeight) * 100
    );
    fakeScrollBar.style.top = `${percent}%`;
});

// CARROUSEL

class Carousel {
    /**
     *
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} options.slidesToScroll Nombre d'élément à faire défiler
     * @param {Object} options.slidesVisible Nombre d'élément visible dans un slide
     * @param {Boolean} options.loop Doit-on boucler en fin de carousel
     * */

    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({}, {
                slidesToScroll: 1,
                slidesVisible: 1,
                loop: false,
            },
            options
        );
        let children = [].slice.call(element.children);
        this.isMobile = false;
        this.isReveal = false;
        this.currentItem = 0;
        this.moveCallbacks = [];

        // Modifications du DOM
        this.root = this.createDivWithClass("carousel");
        this.root.setAttribute("tabindex", "0");
        this.container = this.createDivWithClass("carousel__container");
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.carouselBar = document.querySelector("#see--more--size");
        this.seeMoreBtn = document.querySelector("#see--more--btn");
        this.items = children.map((child) => {
            let item = this.createDivWithClass("carousel__item");
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });
        this.setStyle();
        this.createNavigation();
        this.moveCallbacks.forEach((cb) => cb(0));
        this.onWindowResize();
        this.moveSlider(0);

        // Evenements
        window.addEventListener("resize", this.onWindowResize.bind(this));
        this.root.addEventListener("keyup", (e) => {
            if (e.key === "ArrowRight" || e.key === "Right") {
                this.next();
            } else if (e.key === "ArrowLeft" || e.key === "Left") {
                this.prev();
            }
        });
        this.seeMoreBtn.addEventListener("click", this.reveal.bind(this));
    }

    /**
     * Applique les bonnes dimensions aux éléments du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible;
        this.container.style.width = ratio * 100 + "%";
        this.items.forEach(
            (item) => (item.style.width = 100 / this.slidesVisible / ratio + "%")
        );
    }

    createNavigation() {
        let nextButton = document.querySelector(".toRightArrow");
        let prevButton = document.querySelector(".toLeftArrow");
        let nextButton2 = document.querySelector(".toRightArrow2");
        let prevButton2 = document.querySelector(".toLeftArrow2");
        nextButton.addEventListener("click", this.next.bind(this));
        prevButton.addEventListener("click", this.prev.bind(this));
        nextButton2.addEventListener("click", this.next.bind(this));
        prevButton2.addEventListener("click", this.prev.bind(this));

        if (this.options.loop === true) {
            return;
        }

        this.onMove((index) => {
            // if (index === 0) {
            //     prevButton.style = 'transform: rotate(0deg)'
            //     prevButton2.style = 'transform: rotate(0deg)'
            // } else {
            //     prevButton.style = 'transform: rotate(180deg)'
            //     prevButton2.style = 'transform: rotate(180deg)'
            // }
            // if(this.items[this.currentItem + this.slidesVisible] === undefined) {
            //     nextButton.style = 'transform: rotate(180deg)'
            //     nextButton2.style = 'transform: rotate(180deg)'
            // } else {
            //     nextButton.style = 'transform: rotate(0deg)'
            //     nextButton2.style = 'transform: rotate(0deg)'
            // }
        });
    }

    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll);
    }

    prev() {
        this.gotoItem(this.currentItem - this.slidesToScroll);
    }

    /**
     * Déplace le carousel vers l'élément ciblé
     * @param {number} index
     */
    gotoItem(index) {
        if (index < 0) {
            if (this.items.loop) {
                index = this.items.length - this.options.slidesVisible;
            } else {
                return;
            }
        } else if (
            index >= this.items.length ||
            (this.items[this.currentItem + this.slidesVisible] === undefined &&
                index > this.currentItem)
        ) {
            if (this.options.loop) {
                index = 0;
            } else {
                return;
            }
        }
        let translateX = (-100 * index) / this.items.length;
        this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)";
        this.currentItem = index;
        this.moveCallbacks.forEach((cb) => cb(index));
        this.moveSlider(index);
    }
    moveSlider(index) {
            const percent =
                (index / Math.round(this.items.length / this.slidesVisible)) * 100;
            this.carouselBar.style.width = percent + "%";
        }
        /**
         *
         * @param {moveCallback~Carousel} cb
         */
    onMove(cb) {
        this.moveCallbacks.push(cb);
    }

    reveal() {
        const avis = document.querySelector(".avis");
        const seemorebar = document.querySelector(".see--more--bar");
        const c4 = document.querySelector("#c4");
        const arrow = document.querySelector(".arrow");
        if (!this.isReveal) {
            avis.style.display = "flex";
            avis.style.width = "100%";
            console.log(this.container);

            this.container.style.display = "flex";
            this.container.style.width = "100%";
            this.container.style.flexDirection = "column";
            this.container.style.transform = "translate3d(0px, 0px, 0px)";
            this.container.style.marginBottom = "50px";

            seemorebar.style.display = "none";
            c4.style.paddingTop = "50px";
            c4.style.paddingBottom = "50px";
            arrow.style.display = "none";
            this.isReveal = true;
            this.seeMoreBtn.innerHTML = "AFFICHER MOINS";
        } else {
            avis.style.display = "block";

            this.container.style.display = "block";
            this.container.style.marginBottom = "0px";

            seemorebar.style.display = "block";
            c4.style.paddingTop = "0px";
            c4.style.paddingBottom = "0px";
            arrow.style.display = "block";
            this.seeMoreBtn.innerHTML = "AFFICHER PLUS";

            this.setStyle();

            this.isReveal = false;
        }
    }

    onWindowResize() {
        let mobile = window.innerWidth < 1400;
        if (mobile !== this.isMobile) {
            this.isMobile = mobile;
            this.setStyle();
            this.moveCallbacks.forEach((cb) => cb(this.currentItem));
        }
    }

    /**
     *
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement("div");
        div.setAttribute("class", className);
        return div;
    }

    /**
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll;
    }

    /**
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Carousel(document.querySelector(".avis"), {
        slidesToScroll: 1,
        slidesVisible: 2,
        loop: false,
    });
});

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // If the element is visible
        if (entry.isIntersecting) {
            document.querySelector(".last30").classList.add("last30Anim");
            document.querySelector(".monthbefore").classList.add("monthbeforeAnim");
            document.querySelector(".recuperer").classList.add("recupererAnim");
        }
    });
});

observer2.observe(document.querySelector(".result"));