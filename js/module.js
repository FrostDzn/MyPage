export function waitAnimationEnd(element) {
	return new Promise((resolve) => {
		element.addEventListener("animationend", function handler() {
			element.removeEventListener("animationend", handler);
			resolve();
		});
	});
}

export function checkScroll(ele) {
	if (ele.scrollHeight > ele.clientHeight) {
		console.log(`${ele} is true`);
		return true;
	} else {
		return false;
	}
}

export function waitToval(yourvariable, yourvalue) {
	return new Promise((resolve) => {
		let interval = setInterval(() => {
			console.log(yourvariable)
			if (yourvariable() === yourvalue) {
				clearInterval(interval);
				resolve();
			}
		}, 100);
	});
}
