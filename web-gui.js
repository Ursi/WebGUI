export default {
	empty(container) {
		let child;
		while (child = container.firstChild) {
			child.remove();
		}
	},
	popup(element, {
		reference,
		xe = .5,
		xr = .5,
		ye = .5,
		yr = .5,
		dim = 0x55,
		boxShadow = `0 0 10px`,
		zIndex = Number.MAX_SAFE_INTEGER,
	} = {}, callback) {
		const background = document.createElement(`div`);
		reference = reference || background;
		Object.assign(background.style, {
			position: `fixed`,
			background: `#000000` + dim.toString(16),
			left: 0,
			top: 0,
			width: `100%`,
			height: `100%`,
			zIndex: zIndex,
		})

		background.addEventListener(`click`, function(e) {
			if (!e.composedPath().includes(element)) {
				if (callback) callback.call(element, reference, background);
				this.remove();
			};
		});

		Object.assign(element.style, {
			position: `fixed`,
			margin: 0,
			//visibility: `hidden`,
			'box-shadow': boxShadow
		})

		background.appendChild(element);
		document.body.appendChild(background);
		(new MutationObserver(()=> background.remove())).observe(background, {childList: true});
		function position() {
			const dims = reference.getBoundingClientRect();
			Object.assign(element.style, {
				left: dims.left + xr * dims.width - xe * element.offsetWidth + `px`,
				top: dims.top + yr * dims.height - ye * element.offsetHeight + `px`,
			});
		}

		position();
		//element.style.visibility = `visible`;
		window.addEventListener(`resize`, position);
	},
	transWait(elem) {
		return new Promise(resolve => {
			elem.addEventListener(`transitionend`, function eh() {
				elem.removeEventListener(`transitionend`, eh);
				resolve();
			});
		})
	},
}
