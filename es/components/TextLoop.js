function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import { TransitionMotion, spring } from "react-motion";
import cxs from "cxs";
import isEqual from "react-fast-compare";
import { requestTimeout, clearRequestTimeout } from "../utils";

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
        opacity: spring(_this.getOpacity(), _this.props.springConfig),
        translate: spring(-height, _this.props.springConfig)
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

            _this.tickLoop = requestTimeout(_this.tick, _this.state.currentInterval);
          }
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "wrapperStyles", cxs(_extends({}, _this.props.mask && {
      overflow: "hidden"
    }, {}, {
      display: "inline-block",
      position: "relative",
      verticalAlign: "top"
    })));

    _defineProperty(_assertThisInitialized(_this), "elementStyles", cxs({
      display: "inline-block",
      left: 0,
      top: 0,
      whiteSpace: _this.props.noWrap ? "nowrap" : "normal"
    }));

    var elements = React.Children.toArray(_props.children);
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
      this.tickDelay = requestTimeout(function () {
        _this2.tickLoop = requestTimeout(_this2.tick, currentInterval);
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

      if (currentInterval > 0 && React.Children.count(children) > 1) {
        this.tickDelay = requestTimeout(function () {
          _this3.tickLoop = requestTimeout(_this3.tick, currentInterval);
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

    if (!isEqual(prevProps.children, children)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        elements: React.Children.toArray(children)
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.isUnMounting = true;
    this.clearTimeouts();
  };

  _proto.clearTimeouts = function clearTimeouts() {
    if (this.tickLoop != null) {
      clearRequestTimeout(this.tickLoop);
    }

    if (this.tickDelay != null) {
      clearRequestTimeout(this.tickDelay);
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
        opacity: spring(1, springConfig),
        translate: spring(0, springConfig)
      }
    }];
  };

  _proto.render = function render() {
    var _this4 = this;

    var _this$props$className = this.props.className,
        className = _this$props$className === void 0 ? "" : _this$props$className;
    var textAlignCenter = this.props.textAlignCenter;
    return React.createElement("div", {
      className: this.wrapperStyles + " " + className
    }, React.createElement(TransitionMotion, {
      willLeave: this.willLeave,
      willEnter: this.willEnter,
      styles: this.getTransitionMotionStyles()
    }, function (interpolatedStyles) {
      var _this4$getDimensions = _this4.getDimensions(),
          height = _this4$getDimensions.height,
          width = _this4$getDimensions.width;

      var parsedWidth = _this4.wordBox == null ? "auto" : width;
      var parsedHeight = _this4.wordBox == null ? "auto" : height;
      return React.createElement("div", {
        style: {
          transition: "width " + _this4.props.adjustingSpeed + "ms linear",
          height: parsedHeight,
          width: parsedWidth
        }
      }, interpolatedStyles.map(function (config) {
        return React.createElement("div", {
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
}(React.PureComponent);

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

export default TextLoop;