const webGui = {
	empty(container) {
		let child;
		while (child = container.firstChild) {
			child.remove();
		}
	},
	popup(element, refElement = undefined, xe = .5, xr = .5, ye = .5, yr = .5, dim = '55') {
		let background = document.createElement('div')
		Object.assign(background.style, {
			position: 'fixed',
			background: '#000000' + dim,
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
		})

		background.addEventListener('click', function(e) {
			if (!e.composedPath().includes(element)) this.remove();
		});

		Object.assign(element.style, {
			position: 'relative',
			margin: 0,
			visibility: 'hidden',
			'box-shadow': '0 0 10px'
		})

		background.appendChild(element);
		document.body.appendChild(background);

		let dims = (refElement || background).getBoundingClientRect();
		(new MutationObserver(()=> background.remove())).observe(background, {childList: true});
		Object.assign(element.style, {
			left: dims.left + xr * dims.width - xe * element.offsetWidth + 'px',
			top: dims.top + yr * dims.height - ye * element.offsetHeight + 'px',
			visibility: 'visible',
		})
	},
	transWait(elem) {
		return new Promise(resolve => {
			elem.addEventListener('transitionend', function eh() {
				elem.removeEventListener('transitionend', eh);
				resolve();
			});
		})
	},
}

export default webGui;
export {webGui};
