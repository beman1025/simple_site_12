(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const style = "";
const loader = document.querySelector(".js-loader");
if (loader !== null) {
  const loaderBtn = loader.querySelector(".loader__btn");
  const isAnimated = "is-animated";
  const audioPlayer = document.querySelector(".js-audio-player");
  document.querySelector("body").classList.add("is-loading");
  setTimeout(function () {
    loader.classList.add(isAnimated);
  }, 1e3);
  loaderBtn.addEventListener("click", (event) => {
    event.preventDefault();
    audioPlayer.querySelector(".player__controls").click();
    document.querySelector("body").classList.remove("is-loading");
    loader.classList.add("is-closed");
  });
}
const audioPlayers = document.querySelectorAll(".js-audio-player");
audioPlayers.forEach((audioPlayer) => {
  const audio = audioPlayer.querySelector(".player__audio");
  const playerControls = audioPlayer.querySelector(".player__controls");
  playerControls.addEventListener("click", (event) => {
    event.preventDefault();
    if (!audioPlayer.classList.contains("is-playing")) {
      audioPlayer.classList.add("is-playing");
      audio.play();
    } else {
      audioPlayer.classList.remove("is-playing");
      audio.pause();
    }
  });
});
function handleCounter(element) {
  let start = 0;
  let end = parseInt(element.textContent.replace(/,/g, ""), 10);
  let duration = 4e3;
  let startTime = null;
  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;
    let progress = currentTime - startTime;
    let percent = Math.min(progress / duration, 1);
    let currentNumber = Math.ceil(start + percent * (end - start));
    element.textContent = currentNumber
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (percent < 1) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}
function observer(elements) {
  const handleObserver = (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.add("has-animation");
      const isVisible = entry.isIntersecting;
      if (isVisible) {
        entry.target.classList.add("in-view");
        entry.target.querySelectorAll(".js-counter").forEach((counter) => {
          if (!counter.classList.contains("has-counted")) {
            handleCounter(counter);
            counter.classList.add("has-counted");
          }
        });
      }
    });
  };
  const observerOptions = {
    rootMargin: "-20% 0% -20% 0%",
    threshold: 0,
  };
  const observer2 = new IntersectionObserver(handleObserver, observerOptions);
  elements.forEach((element) => {
    observer2.observe(element, observerOptions);
  });
}
const observerTargets = document.querySelectorAll(".js-observer-target");
observer(observerTargets);
document
  .querySelector(".js-nav-trigger")
  .addEventListener("click", function (event) {
    event.preventDefault();
    this.classList.toggle("is-active");
    document.querySelector("body").classList.toggle("menu-opened");
    document.querySelector(".header").classList.toggle("menu-opened");
  });
const navLinks = document.querySelectorAll(".header .nav a");
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    document.querySelector(".js-nav-trigger").classList.remove("is-active");
    document.querySelector("body").classList.remove("menu-opened");
    document.querySelector(".header").classList.remove("menu-opened");
  });
});
