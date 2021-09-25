const fakeScrollBar = document.querySelector(".fake--scrollbar--bar");
const idOfScroll = document.querySelectorAll(".page--details--item");
// const carouselItems = [...document.querySelectorAll(".carousel-item")];
const arrowBtn = document.querySelector(".arrow");

const ration = 0.6;
let curSlide = 1;

// right navigation
window.addEventListener("scroll", (e) => {
    e.preventDefault();
    const percent = Math.floor(
        (window.scrollY / document.body.clientHeight) * 100
    );
    fakeScrollBar.style.top = `${percent}%`;
});
// left navigation
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
            entry.target.classList.add("faded-in");
            entry.target.classList.remove("faded-out");
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

arrowBtn.addEventListener("click", function(e) {
    if (e.target.classList.contains("toLeftArrow") && curSlide > 1) {
        curSlide -= 1;
    }
    if (e.target.classList.contains("toRightArrow") && curSlide < 5) {
        curSlide += 1;
    }
    //   carouselItems.forEach((el) => {
    //     el.classList.remove("active");
    //   });
    //   carouselItems[curSlide - 1].classList.add("active");
});
$(document).ready(function() {
    $('#fullpage').fullpage({
        //options here
        autoScrolling: true,
        scrollHorizontally: true,
        navigation: true
    });
});