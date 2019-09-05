export default {
	empty(container) {
		let child;
		while (child = container.firstChild) {
			child.remove();
		}
	},
	popup(elem, {
		reference,
		xe = .5,
		xr = .5,
		ye = .5,
		yr = .5,
		dim = 0x55,
		boxShadow = `0 0 10px`,
		zIndex = Number.MAX_SAFE_INTEGER,
	} = {}, callback = background => background.remove()) {
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

		background.addEventListener(`mousedown`, function(e) {
			if (!e.composedPath().includes(elem)) {
				callback.call(elem, background, reference);
				window.removeEventListener(`resize`, position);
			};
		});

		Object.assign(elem.style, {
			position: `fixed`,
			//visibility: `hidden`,
			'box-shadow': boxShadow
		})

		background.appendChild(elem);
		document.body.appendChild(background);
		(new MutationObserver(()=> {
			background.remove();
			window.removeEventListener(`resize`, position);
		})).observe(background, {childList: true});

		function position() {
			const dims = reference.getBoundingClientRect();
			Object.assign(elem.style, {
				left: dims.left + xr * dims.width - xe * elem.offsetWidth + `px`,
				top: dims.top + yr * dims.height - ye * elem.offsetHeight + `px`,
			});
		}

		position();
		//elem.style.visibility = `visible`;
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
