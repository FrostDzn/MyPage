import { waitAnimationEnd, checkScroll, waitToval } from "./module.js";

const menuBtn = document.getElementsByClassName("btnMenuToolbar");
const ImageContainer = document.getElementById("divFullScreen");
const imgImageDisplay = document.getElementById("imgImageDisplay");
const svgClose = document.getElementById("svgClose");
const btnCert = document.getElementsByClassName("aBtn imgShow");
const h3ImageDisplay = document.getElementById("h3ImageDisplay");
const divClassCategory = [
	...document.getElementsByClassName("divClassCategory"),
];

let scrollAnimate = [];
let nextToShow = "";
let currentDisplayed = "";
let isAnimating = false;
let scrollBtnLeft = {};
let scrollBtnRight = {};

function showImageContainer(event) {
	if (ImageContainer.style.display === "flex") {
		ImageContainer.style.display = "none";
		return;
	}
	let id = event.currentTarget.id;
	switch (id) {
		case "btnCert":
			h3ImageDisplay.textContent = "Mikrotik Certificate";
			imgImageDisplay.src = "assets/MTCNA Cert.png";
			break;
		case "btnCertEng":
			h3ImageDisplay.textContent = "English EF SET CEFR C1 Certificate";
			console.log("btnCertEng");
			imgImageDisplay.src = "assets/EF SET Certificate EN.png";
			break;
		default:
			console.log("btnCertDefault");
			break;
	}
	ImageContainer.style.display = "flex";
}

function initbtnImageShow() {
	for (let i of btnCert) {
		i.addEventListener("click", showImageContainer);
	}
}

async function clicked(val) {
	if (val instanceof Element) {
		for (let i of menuBtn) {
			i.classList.remove("Selected");
		}
		nextToShow = val.textContent.replace(/\s/g, "");
		console.log(
			`Clicked "${nextToShow}" \n scrollAnimate length = ${scrollAnimate.length} \n isAnimating ${isAnimating}`,
		);
		if (isAnimating) {
			val.classList.add("Selected");
			return;
		}

		if (currentDisplayed != "" && !isAnimating) {
			showinfo(currentDisplayed);
		} else if (currentDisplayed === "") {
			showinfo(null);
		}
		val.classList.add("Selected");
	} else {
		nextToShow = val;
		console.log(
			`Clicked "${nextToShow}" \n scrollAnimate length = ${scrollAnimate.length} \n isAnimating ${isAnimating}`,
		);
		if (isAnimating) {
			return;
		}
		if (scrollAnimate.length > 0) {
			await waitToval(() => scrollAnimate.length, 0);
		}

		if (currentDisplayed != "" && !isAnimating) {
			showinfo(currentDisplayed);
		} else if (currentDisplayed === "") {
			showinfo(null);
		}
	}
}

async function scrollBtnFnc(parentElement) {
	let scrollbtn = parentElement.querySelector(".btnCanScrollDown");
	if (!scrollbtn) {
		return;
	}
	if (checkScroll(parentElement)) {
		if (
			scrollbtn.classList.contains("finished") &&
			!(nextToShow === currentDisplayed)
		) {
			scrollbtn.classList.add("classanimate", "Anim-fade-out");
			scrollbtn.classList.remove("finished");
			scrollAnimate.push(
				waitAnimationEnd(scrollbtn).then(() => {
					scrollbtn.classList.remove("classanimate", "Anim-fade-out");
					scrollbtn.style.display = "none";
				}),
			);
			/*await waitAnimationEnd(scrollbtn)
				  scrollbtn.classList.remove("classanimate", "Anim-fade-out") 
				  scrollbtn.style.display = "none"; */
		} else if (!scrollbtn.classList.contains("finished")) {
			scrollbtn.style.display = "block";
			scrollbtn.classList.add("classanimate", "Anim-fade-in");
			scrollAnimate.push(
				waitAnimationEnd(scrollbtn).then(() => {
					scrollbtn.classList.add("finished");
					scrollbtn.classList.remove("classanimate", "Anim-fade-in");
				}),
			);
			/*await waitAnimationEnd(scrollbtn)
				  scrollbtn.classList.add("finished")
				  scrollbtn.classList.remove("classanimate", "Anim-fade-in"); */
		}
	} else if (!checkScroll(parentElement)) {
		if (scrollbtn.classList.contains("finished")) {
			scrollbtn.classList.add("classanimate", "Anim-fade-out");
			scrollbtn.classList.remove("finished");
			scrollAnimate.push(
				waitAnimationEnd(scrollbtn).then(() => {
					scrollbtn.classList.remove("classanimate", "Anim-fade-out");
					scrollbtn.style.display = "none";
				}),
			);
			/*await waitAnimationEnd(scrollbtn)
				  scrollbtn.classList.remove("classanimate", "Anim-fade-out")
				  scrollbtn.style.display = "none"; */
		}
	}
}

async function hideContent(hideContentName) {
	isAnimating = true;
	if (hideContentName) {
		if (hideContentName._hasELScroll) {
			hideContentName.removeEventListener("scroll", () =>
				checkArrow(hideContentName),
			);
			scrollBtnLeft.removeEventListener('click', () => leftHandler(hideContentName));
			scrollBtnRight.removeEventListener('click', () => rightHandler(hideContentName))
			hideContentName._hasELScroll = false;
		}
		scrollBtnRight.style.display = "none";
		scrollBtnLeft.style.display = "none";
		let mainHContainer = [
			...hideContentName.getElementsByClassName("divMenuDataHeader"),
		].reverse();
		let childHContent = [
			...hideContentName.getElementsByClassName("divClassCategoryContent"),
		].reverse();
		/* for (let [i,eleCatCon] of divClassCategory.entries()) {
				/* let scrollbtn = eleCatCon.querySelector(".btnCanScrollDown.finished");
				if (scrollbtn) {
					scrollbtn.classList.add("classanimate", "Anim-fade-out");
					scrollbtn.classList.remove("finished");
					await waitAnimationEnd(scrollbtn)
					scrollbtn.classList.remove("classanimate", "Anim-fade-out");
					scrollbtn.style.display = "none";
				}
				else {
					continue;
				} 
				scrollBtnFnc(eleCatCon);
				if (i >= divClassCategory.length - 1) {
					if (scrollAnimate.length > 0) {
						await Promise.allSettled(scrollAnimate)
						scrollAnimate.length = 0;
					}
				}
			} */
		for (let [i, childH] of childHContent.entries()) {
			childH.classList.add("classanimate", "Anim-scroll-down-reverse");
			childH.classList.remove("finished-height");
			childH.addEventListener("animationend", function animchildHHandler() {
				childH.classList.remove("classanimate", "Anim-scroll-down-reverse");
				childH.removeEventListener("animationend", animchildHHandler);
			});
			if (i >= childHContent.length - 1) {
				await waitAnimationEnd(childH);
			}
		}
		for (let [i, eachH] of mainHContainer.entries()) {
			eachH.classList.add("classanimate", "Anim-scroll-side-reverse");
			eachH.classList.remove("finished");
			eachH.addEventListener("animationend", function animeachHHandler() {
				eachH.classList.remove("classanimate", "Anim-scroll-side-reverse");
			});
			if (i >= mainHContainer.length - 1) {
				await waitAnimationEnd(eachH);
			}
		}
		hideContentName.style.display = "none";
	}
	isAnimating = false;
}

function checkArrow(elemet) {
	console.log("called");
	let maxWidth = elemet.scrollWidth - elemet.clientWidth - 2;
	if (isAnimating) {
		return
	}
	if (elemet.scrollLeft > 0 && scrollBtnLeft) {
		scrollBtnLeft.style.display = "block";
		console.log("printed1");
	} else if (elemet.scrollLeft <= 0 && scrollBtnLeft) {
		scrollBtnLeft.style.display = "none";
	}
	if (elemet.scrollLeft >= maxWidth && scrollBtnRight) {
		scrollBtnRight.style.display = "none";
	} else if (elemet.scrollLeft < maxWidth && scrollBtnRight) {
		scrollBtnRight.style.display = "block";
		console.log("printed2");
	}
	console.log(
		`Element : ${elemet.classList} \n maxWidth: ${maxWidth} \n ScrollLeft : ${elemet.scrollLeft}`,
	);
}

function leftHandler(el) {
	el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
}
function rightHandler(el) {
	el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
}


async function showContent(showContentName) {
	isAnimating = true;
	currentDisplayed = nextToShow;
	if (showContentName) {
		if (!showContentName._hasELScroll) {
			showContentName.addEventListener("scroll", () =>
				checkArrow(showContentName),
			);

			scrollBtnLeft.addEventListener('click', () => leftHandler(showContentName));

			scrollBtnRight.addEventListener('click', () => rightHandler(showContentName))
			showContentName._hasELScroll = true;
		}
		let mainSContainer = [
			...showContentName.getElementsByClassName("divMenuDataHeader"),
		];
		showContentName.style.display = "grid";
		for (let [i, each] of mainSContainer.entries()) {
			each.classList.add("classanimate", "Anim-scroll-side");
			each.addEventListener("animationend", function animhandler() {
				each.classList.add("finished");
				each.classList.remove("classanimate", "Anim-scroll-side");
				each.removeEventListener("animationend", animhandler);
			});
			if (i >= mainSContainer.length - 1) await waitAnimationEnd(each);
		}
		let childSContent = [
			...showContentName.getElementsByClassName("divClassCategoryContent"),
		];
		for (let [i, child] of childSContent.entries()) {
			child.classList.add("classanimate", "Anim-scroll-down");
			child.addEventListener("animationend", function animhandlerchild() {
				child.classList.remove("classanimate", "Anim-scroll-down");
				child.classList.add("finished-height");
				child.removeEventListener("animationend", animhandlerchild);
			});
			if (i >= childSContent.length - 1) {
				await waitAnimationEnd(child);
			}
		}
		/*for (let [i,eleCatCon] of divClassCategory.entries()) {
				/*let scrollbtn = eleCatCon.querySelector(".btnCanScrollDown");
				if (!checkScroll(eleCatCon)) {
					continue;
				}
				scrollbtn.style.display = "block";
				scrollbtn.classList.add("classanimate", "Anim-fade-in");
				await waitAnimationEnd(scrollbtn)
				scrollbtn.classList.add("finished");
				scrollbtn.classList.remove("classanimate", "Anim-fade-in");
				
				scrollBtnFnc(eleCatCon);
				if (i >= divClassCategory.length - 1 ) {
					if (scrollAnimate.length > 0) {
						await Promise.allSettled(scrollAnimate)
						scrollAnimate.length = 0;
					}
				} 
			} */
	}
	isAnimating = false;
	checkArrow(showContentName);
}

async function showinfo(hideInfo) {
	if (isAnimating) {
		return;
	}
	let hideContentName = document.querySelector(`.div${hideInfo}`);
	if (hideContentName) {
		await hideContent(hideContentName);
	}

	let showContentName = document.querySelector(`.div${nextToShow}`);
	if (showContentName) {
		await showContent(showContentName);
		if (currentDisplayed !== nextToShow) showinfo(currentDisplayed);
	}
}

for (let i of menuBtn) {
	i.addEventListener("click", () => clicked(i));
}

let selectToolbar = document.getElementById("selectToolbar");
selectToolbar.addEventListener("change", () => {
	clicked(selectToolbar.value);
});

if (window.matchMedia("(max-width=1099px)")) {
	[...document.getElementsByClassName("scrollArrow")].forEach((btnx) => {
		if (btnx.classList.contains("scrollRight")) {
			scrollBtnRight = btnx;
		} else if (btnx.classList.contains("scrollLeft")) {
			scrollBtnLeft = btnx;
		}
	});
}

svgClose.addEventListener("click", () => {
	ImageContainer.style.display = "none";
});
initbtnImageShow();

let lastState = window.innerWidth > 1099 ? "large" : "small";

window.addEventListener("resize", () => {
	let width = window.innerWidth;
	let newState = width > 1099 ? "large" : "small";

	if (newState !== lastState) {
		window.location.reload();
	}

	lastState = newState;
});
/* window.addEventListener("resize", async () => {
	if (isAnimating) {
		if (scrollAnimate.length > 0) {
			console.log(scrollAnimate)
		}
		return
	}
	else {
		for (let [i,eleCatCon] of divClassCategory.entries()) {
			scrollBtnFnc(eleCatCon)
			if (i >= divClassCategory.length - 1 ) {
				if (scrollAnimate.length > 0) {
					isAnimating = true
					await Promise.allSettled(scrollAnimate);
					scrollAnimate.length = 0;
					console.log(`Resize ${scrollAnimate.length}`)
					isAnimating = false
				}
			}
		}
	}
}) */
