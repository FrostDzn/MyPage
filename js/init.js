import { waitAnimationEnd } from "./module.js";

const divMe = [...document.getElementsByClassName("mainMe")];
const divMeContainer = document.getElementById("divMeContainer");
const divMenuHeader = document.getElementById("divMenuHeader");
const divToolbarBtn = [...document.getElementsByClassName("btnMenuToolbar")];
const divMenuContainer = document.getElementById("divMenuContainer");
const divMeInfo = document.getElementById("divMeInfo");
/* const animateListArray = [ [
		{ opacity: 0, transform: "translateX(-20px)"},
		{ opacity: 1, transform: "translateX(0)"} ],
	[
		{ opacity: 0, transform: "translateY(-20px)"},
		{ opacity: 1, transform: "translateY(0)"} ],
	[
{ opacity: 0, transform: "translateX(20px)"},
		{ opacity: 1, transform: "translateX(0)"} ],
	[
		{ opacity: 0, transform: "translateY(20px)"},
		{ opacity: 1, transform: "translateY(0)"} ],
	[
		{ opacity: 0, transform: "Scale(0)"},
		{ opacity: 1, transform: "Scale(1)"} ]
]

async function initMeAnimate(){
	for (let i of divMe){
		let curanimate = i.animate(randomanim(), 
		{ duration: 900, fill: "forwards"});

		
		try {
			await curanimate.finished;
			curanimate.commitStyles();
			curanimate.cancel
		} catch (error) {
			console.log(`Function InitMeAnimate error : ${error}`)
		}
	}
	let divMenuHeaderAnimate = divMenuHeader.animate(randomanim(), { duration: 900, fill: "forwards"});
	divMenuHeaderAnimate.onfinish = () => { 
		let chooseanim = randomanim()
		for (let i of divToolbarBtn){
			let curentanim = i.animate(chooseanim, { duration: 900, fill: "none"})
			curentanim.onfinish = () => {
				i.style.opacity = 1;
				curentanim.cancel();
			}
		}
		divMenuHeaderAnimate.commitStyles();
		divMenuHeaderAnimate.cancel();
		
	}

}

function randomanim(){
	let randomnumber = Math.floor(Math.random() * animateListArray.length)
	return animateListArray[randomnumber]
	
}

initMeAnimate() */

const animations = [
	"from-left",
	"from-right",
	"from-top",
	"from-bottom",
	"scale-up",
	"fade-in",
];
function randomanim() {
	let randomnumber = Math.floor(Math.random() * animations.length);
	return animations[randomnumber];
}
async function divMeAnimate(ele) {
	let getAnimClassName = `Anim-${randomanim()}`;
	ele.classList.add("classanimate", getAnimClassName);

	try {
		await waitAnimationEnd(ele);
		ele.classList.add("finished");
		ele.classList.remove("classanimate", getAnimClassName);
	} catch (error) {
		console.log(`initMeAnim Error : ${error}`);
	}
}

async function divMenuAnimate() {
	divMenuContainer.classList.add("classanimate", "Anim-scaleY-up");
	await waitAnimationEnd(divMenuContainer);
	divMenuContainer.style.opacity = 1;
	divMenuContainer.classList.remove("classanimate", "Anim-scaleY-up");
	divMenuHeader.classList.add("classanimate", `Anim-${randomanim()}`);
	await waitAnimationEnd(divMenuHeader);
	let divToolbarBtnAnim = `Anim-${randomanim()}`;
	if (window.matchMedia("(min-width: 1100px)").matches){
		for (let [i, x] of divToolbarBtn.entries()) {
			x.classList.add("classanimate", divToolbarBtnAnim);
			x.addEventListener("animationend", () => {
				x.classList.add("finished");
				x.classList.remove("classanimate", divToolbarBtnAnim);
			});
			if (i >= (divToolbarBtn.length - 1)) {
				await waitAnimationEnd(x)
			}
		}
	}
	else if (window.matchMedia("(max-width: 1099px)").matches) {
		let selectMenuToolbar = [...divMenuContainer.getElementsByClassName("selectToolbar")]
		selectMenuToolbar.forEach((i) => {
			i.classList.add("classanimate", divToolbarBtnAnim);
			i.addEventListener("animationend", () => {
				i.classList.add("finished");
				i.classList.remove("classanimate", divToolbarBtnAnim);
			});

		})
	}
}

async function divMeInfoAnimate() {
	divMeInfo.classList.add("AnimdivMeInfo");
	await waitAnimationEnd(divMeInfo);
	divMeInfo.style.maxWidth = "100%";
	divMeInfo.style.marginTop = "3em";
	divMeInfo.style.opacity = 1;
	divMeInfo.classList.remove("AnimdivMeInfo");
}

async function initMeAnim() {
	for (let xa of divMe) {
		await divMeAnimate(xa)
	}
	await divMenuAnimate();
	await divMeInfoAnimate();
}

window.addEventListener("load", () => {
  document.documentElement.classList.remove("firstHide")
})

if (window.matchMedia("(min-width: 1100px)").matches) {
		initMeAnim();
	}
else if(window.matchMedia("(max-width: 1099px)").matches) {
	let obs = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting) {
				switch(true) {
					case entry.target.classList.contains("mainMe"):
						divMeAnimate(entry.target);
						break;
					case entry.target.id === "divMenuContainer":
						divMenuAnimate();
						console.log("2")
						break;
					case entry.target.id === "divMeInfo":
						divMeInfoAnimate();
						break;
				}
				obs.unobserve(entry.target);
			}
		})

	})
	divMe.forEach((elem) => obs.observe(elem));
	obs.observe(divMenuContainer);
	obs.observe(divMeInfo);
	
}
