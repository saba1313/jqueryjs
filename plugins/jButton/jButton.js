/**
 * Creates a button from an image tag!
 *
 * This function attempts to mimic the functionality of the "button" found in
 * modern day GUIs. There are two different buttons you can create using this
 * plugin; Normal buttons, and Toggle buttons.
 *
 * @name iButton
 * @type jQuery
 * @param hOptions   hash with options, described below.
 *                   sPath      Full path to the images, either relative or
 *                              with full URL
 *                   sExt       Extension of the used images (jpg|gif|png)
 *                   sName      Name of the button, if not specified, try to
 *                              fetch from id
 *                   iWidth     Width of the button, if not specified, try to
 *                              fetch from element.width
 *                   iHeight    Height of the button, if not specified, try to
 *                              fetch from element.height
 *                   onAction   Function to call when clicked / toggled. In
 *                              case of a string, the element is wrapped inside
 *                              an href tag.
 *                   bToggle    Do we need to create a togglebutton? (boolean)
 *                   bState     Initial state of the button? (boolean)
 *                   sType      Type of hover to create (img|css)
 * @return jQuery
 */
$.fn.iButton = function(hOptions) {
	// In case of an invalid binding
	if (!this[0]) {
		return;
	}

	// Initialize option hash
	if (!hOptions) {
		hOptions = {};
	}

	// Gather configuration
	this.cfgButton = {
		sPath: hOptions.sPath ? hOptions.sPath : '',
		sExt: hOptions.sExt ? hOptions.sExt : 'gif',
		sName: hOptions.sName ? hOptions.sName : (this[0].id ? this[0].id : ''),
		iWidth: hOptions.iWidth ? parseInt(hOptions.iWidth) || 0 : (this[0].width ? parseInt(this[0].width) || 0 : false),
		iHeight: hOptions.iHeight ? parseInt(hOptions.iHeight) || 0 : (this[0].height ? parseInt(this[0].height) || 0 : false),
		onAction: hOptions.onAction && (hOptions.onAction.constructor == Function || hOptions.onAction.constructor == String) ? hOptions.onAction : false,
		bToggle: hOptions.bToggle ? hOptions.bToggle : false,
		bState: hOptions.bState ? hOptions.bState : false,
		sType: hOptions.sType ? hOptions.sType : 'img'
	};

	// Check type (CSS style or old-school IMG style
	if ((this.cfgButton.sType != 'css') && (this.cfgButton.sType != 'img')) {
		this.cfgButton.sType = 'img';
	}

	// Check path
	if ((this.cfgButton.sPath != '') && (this.cfgButton.sPath.charAt(this.cfgButton.sPath.length) != '/')) {
		this.cfgButton.sPath+= '/';
	}

	// Check action
	if (this.cfgButton.onAction.constructor == String) {
		this.css( { border: 'none' } ).wrap('<a href="' + this.cfgButton.onAction + '" title="' + (this[0].title || '') + '"></a>');
	}

	// Set cursor
	this.css( { cursor: 'pointer' } );

	// Create images
	this.imgOff = new Image;
	this.imgOver = new Image;
	this.imgDown = new Image;

	// Assign images
	if (this.cfgButton.sType == 'img') {
		this.imgOff.src = this.cfgButton.sPath + '/' + this.cfgButton.sName + '_off.' + this.cfgButton.sExt;
		this.imgOver.src = this.cfgButton.sPath + '/' + this.cfgButton.sName + '_over.' + this.cfgButton.sExt;
		this.imgDown.src = this.cfgButton.sPath + '/' + this.cfgButton.sName + '_down.' + this.cfgButton.sExt;

		// Set correct image
		this[0].src = this.imgOff.src;

		// Actions
		var _this = this;
		this.mouseout(function() {
			this.src = (_this.cfgButton.bToggle && _this.cfgButton.bState) ? _this.imgDown.src : _this.imgOff.src;
		}).mouseover(function() {
			//this.src = (_this.cfgButton.bToggle && _this.cfgButton.bState) ? _this.imgDown.src : _this.imgOver.src;
			this.src = _this.imgOver.src;
		}).mousedown(function() {
			_this.cfgButton.bState = (!_this.cfgButton.bState);
			this.src = _this.imgDown.src;
		}).mouseup(function() {
			this.src = (_this.cfgButton.bToggle && _this.cfgButton.bState) ? _this.imgDown.src : _this.imgOver.src;
		}).click(function() {
			if (_this && _this.cfgButton && _this.cfgButton.onAction)
    		_this.cfgButton.onAction(_this.cfgButton.bState);
		});
	} else if (this.cfgButton.sType == 'css') {
		// In this case we need iWidth and iHeight filled
		if (!this.cfgButton.iWidth || !this.cfgButton.iHeight) {
			alert('the CSS button type requires iWidth and iHeight filled, either \nin the passed parameters, or as property of the image.');
			return this;
		}

		// Calculate positions
		this.sCssOff = '0px 0px';
		this.sCssOver = '0px -' + this.cfgButton.iHeight + 'px';
		this.sCssDown = '0px -' + (this.cfgButton.iHeight * 2) + 'px';

		// Set correct image
		this[0].src = this.cfgButton.sPath + '/blank.gif';
		this[0].style.backgroundImage = 'url("' + this.cfgButton.sPath + '/' + this.cfgButton.sName + '.' + this.cfgButton.sExt + '")';
		this[0].style.backgroundPosition = (this.cfgButton.bToggle && this.cfgButton.bState) ? this.sCssDown : this.sCssOff;

		// Actions
		var _this = this;
		this.mouseout(function() {
			this.style.backgroundPosition = (_this.cfgButton.bToggle && _this.cfgButton.bState) ? _this.sCssDown : _this.sCssOff;
		}).mouseover(function() {
			//this.style.backgroundPosition = (_this.cfgButton.bToggle && _this.cfgButton.bState) ? _this.sCssDown : _this.sCssOver;
			this.style.backgroundPosition = _this.sCssOver;
		}).mousedown(function() {
			_this.cfgButton.bState = (!_this.cfgButton.bState);
			this.style.backgroundPosition = _this.sCssDown;
		}).mouseup(function() {
			this.style.backgroundPosition = (_this.cfgButton.bToggle && _this.cfgButton.bState) ? _this.sCssDown : _this.sCssOver;
		}).click(function() {
			if (_this && _this.cfgButton && _this.cfgButton.onAction)
    		_this.cfgButton.onAction(_this.cfgButton.bState);
		});
	}

	// Done
	return this;
};