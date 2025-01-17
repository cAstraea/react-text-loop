"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactMotion = require("react-motion");

var _cxs = _interopRequireDefault(require("cxs"));

var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TextLoop =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(TextLoop, _React$PureComponent);

  function TextLoop(_props) {
    var _this;

    _this = _React$PureComponent.call(this, _props) || this;

    _defineProperty(_assertThisInitialized(_this), "isUnMounting", false);

    _defineProperty(_assertThisInitialized(_this), "tickDelay", 0);

    _defineProperty(_assertThisInitialized(_this), "tickLoop", 0);

    _defineProperty(_assertThisInitialized(_this), "wordBox", null);

    _defineProperty(_assertThisInitialized(_this), "willLeave", function () {
      var _this$getDimensions = _this.getDimensions(),
          height = _this$getDimensions.height;

      return {
        opacity: (0, _reactMotion.spring)(_this.getOpacity(), _this.props.springConfig),
        translate: (0, _reactMotion.spring)(-height, _this.props.springConfig)
      };
    });

    _defineProperty(_assertThisInitialized(_this), "willEnter", function () {
      var _this$getDimensions2 = _this.getDimensions(),
          height = _this$getDimensions2.height;

      return {
        opacity: _this.getOpacity(),
        translate: height
      };
    });

    _defineProperty(_assertThisInitialized(_this), "tick", function () {
      if (!_this.isUnMounting) {
        _this.setState(function (state, props) {
          var currentWordIndex = (state.currentWordIndex + 1) % state.elements.length;
          var currentEl = state.elements[currentWordIndex];
          var updatedState = {
            currentWordIndex: currentWordIndex,
            currentEl: currentEl,
            wordCount: (state.wordCount + 1) % 1000,
            // just a safe value to avoid infinite counts,
            currentInterval: Array.isArray(props.interval) ? props.interval[currentWordIndex % props.interval.length] : props.interval
          };

          if (props.onChange) {
            props.onChange(updatedState);
          }

          return updatedState;
        }, function () {
          if (_this.state.currentInterval > 0) {
            _this.clearTimeouts();

            _this.tickLoop = (0, _utils.requestTimeout)(_this.tick, _this.state.currentInterval);
          }
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "wrapperStyles", (0, _cxs["default"])(_extends({}, _this.props.mask && {
      overflow: "hidden"
    }, {}, {
      display: "inline-block",
      position: "relative",
      verticalAlign: "top"
    })));

    _defineProperty(_assertThisInitialized(_this), "elementStyles", (0, _cxs["default"])({
      display: "inline-block",
      left: 0,
      top: 0,
      whiteSpace: _this.props.noWrap ? "nowrap" : "normal"
    }));

    var elements = _react["default"].Children.toArray(_props.children);

    _this.state = {
      elements: elements,
      currentEl: elements[0],
      currentWordIndex: 0,
      wordCount: 0,
      currentInterval: Array.isArray(_props.interval) ? _props.interval[0] : _props.interval
    };
    return _this;
  }

  var _proto = TextLoop.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    // Starts animation
    var delay = this.props.delay;
    var _this$state = this.state,
        currentInterval = _this$state.currentInterval,
        elements = _this$state.elements;

    if (currentInterval > 0 && elements.length > 1) {
      this.tickDelay = (0, _utils.requestTimeout)(function () {
        _this2.tickLoop = (0, _utils.requestTimeout)(_this2.tick, currentInterval);
      }, delay);
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var _this3 = this;

    var _ref = this.props,
        interval = _ref.interval,
        children = _ref.children,
        delay = _ref.delay;
    var currentWordIndex = this.state.currentWordIndex;
    var currentInterval = Array.isArray(interval) ? interval[currentWordIndex % interval.length] : interval;

    if (prevState.currentInterval !== currentInterval) {
      this.clearTimeouts();

      if (currentInterval > 0 && _react["default"].Children.count(children) > 1) {
        this.tickDelay = (0, _utils.requestTimeout)(function () {
          _this3.tickLoop = (0, _utils.requestTimeout)(_this3.tick, currentInterval);
        }, delay);
      } else {
        this.setState(function (state, props) {
          var _currentWordIndex = state.currentWordIndex;
          return {
            currentInterval: Array.isArray(props.interval) ? props.interval[_currentWordIndex % props.interval.length] : props.interval
          };
        });
      }
    }

    if (!(0, _reactFastCompare["default"])(prevProps.children, children)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        elements: _react["default"].Children.toArray(children)
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.isUnMounting = true;
    this.clearTimeouts();
  };

  _proto.clearTimeouts = function clearTimeouts() {
    if (this.tickLoop != null) {
      (0, _utils.clearRequestTimeout)(this.tickLoop);
    }

    if (this.tickDelay != null) {
      (0, _utils.clearRequestTimeout)(this.tickDelay);
    }
  } // Fade out animation
  ;

  _proto.getOpacity = function getOpacity() {
    return this.props.fade ? 0 : 1;
  };

  _proto.getDimensions = function getDimensions() {
    if (this.wordBox == null) {
      return {
        width: 0,
        height: 0
      };
    }

    return this.wordBox.getBoundingClientRect();
  };

  _proto.getTransitionMotionStyles = function getTransitionMotionStyles() {
    var springConfig = this.props.springConfig;
    var _this$state2 = this.state,
        wordCount = _this$state2.wordCount,
        currentEl = _this$state2.currentEl;
    return [{
      key: "step-" + wordCount,
      data: {
        currentEl: currentEl
      },
      style: {
        opacity: (0, _reactMotion.spring)(1, springConfig),
        translate: (0, _reactMotion.spring)(0, springConfig)
      }
    }];
  };

  _proto.render = function render() {
    var _this4 = this;

    var _this$props$className = this.props.className,
        className = _this$props$className === void 0 ? "" : _this$props$className;
    var textAlignCenter = this.props.textAlignCenter;
    return _react["default"].createElement("div", {
      className: this.wrapperStyles + " " + className
    }, _react["default"].createElement(_reactMotion.TransitionMotion, {
      willLeave: this.willLeave,
      willEnter: this.willEnter,
      styles: this.getTransitionMotionStyles()
    }, function (interpolatedStyles) {
      var _this4$getDimensions = _this4.getDimensions(),
          height = _this4$getDimensions.height,
          width = _this4$getDimensions.width;

      var parsedWidth = _this4.wordBox == null ? "auto" : width;
      var parsedHeight = _this4.wordBox == null ? "auto" : height;
      return _react["default"].createElement("div", {
        style: {
          transition: "width " + _this4.props.adjustingSpeed + "ms linear",
          height: parsedHeight,
          width: parsedWidth
        }
      }, interpolatedStyles.map(function (config) {
        return _react["default"].createElement("div", {
          className: _this4.elementStyles,
          ref: function ref(n) {
            _this4.wordBox = n;
          },
          key: config.key,
          style: {
            opacity: config.style.opacity,
            // transform: `translateY(${config.style.translate}px)`,
            transform: textAlignCenter ? "translate(-50%, " + config.style.translate + "px)" : "translateY(" + config.style.translate + "px)",
            left: textAlignCenter ? "50%" : "0",
            position: _this4.wordBox == null ? "relative" : "absolute"
          }
        }, config.data.currentEl);
      }));
    }));
  };

  return TextLoop;
}(_react["default"].PureComponent);

_defineProperty(TextLoop, "defaultProps", {
  interval: 3000,
  delay: 0,
  adjustingSpeed: 150,
  springConfig: {
    stiffness: 340,
    damping: 30
  },
  fade: true,
  mask: false,
  noWrap: true,
  textAlignCenter: false
});

var _default = TextLoop;
exports["default"] = _default;