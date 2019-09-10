const style = document.createElement('style');
style.textContent = `for web-gui`;
document.head.appendChild(style);
style.sheet.insertRule(`
	@keyframes wg-loader {
		from {
			opacity: 1;
		} to {
			opacity: 0;
		}
	}
`);

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
		(new MutationObserver(function(){
			this.disconnect();
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
	loader({
		size = `1em`,
		disks = 6,
		spacing = 1 / 3,
		color = `#0005`,
		period = 1,
		} = {}
	) {
		const loaderElem = document.createElement(`div`);
		loaderElem.classList.add(`wg-loader`);
		Object.assign(loaderElem.style, {
			width: size,
			height: size,
		});

		console.log(spacing);
		for (let i = 0; i <= disks - 1; i++) {
			const
				disk = document.createElement(`div`),
				//diskSize = `calc(${Math.PI} * ${size} / ${n})`;
				diskSize = `calc(${1 - spacing} * ${size} / ${1 - spacing + 1 / Math.sin(Math.PI / disks)})`;

			Object.assign(disk.style, {
				width: diskSize,
				height: diskSize,
				borderRadius: `calc(${diskSize} / 2)`,
				background: color,
				position: `absolute`,
				transformOrigin: `center calc(${size} / 2)`,
				transform: `translateX(calc((${size} - ${diskSize}) / 2)) rotate(${i / disks}turn)`,
				animation: `wg-loader ${period}s linear infinite`,
				animationDelay: period * (i - disks) / disks + `s`
			});
			loaderElem.appendChild(disk);
		}

		return loaderElem;
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
