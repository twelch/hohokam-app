import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Dimensions, PanResponder, View } from 'react-native'

export default class GestureView extends Component {
  constructor (props) {
    super(props)

    this.state = { quadrants: this.calculateQuadrants(props.quadrantThreshold) }
  }

  static get propTypes () {
    return {
      children: PropTypes.element.isRequired,
      onSwipeLeft: PropTypes.func,
      onSwipeRight: PropTypes.func,
      onSwipeUp: PropTypes.func,
      onSwipeDown: PropTypes.func,
      onUnhandledSwipe: PropTypes.func,
      swipeThreshold: PropTypes.number,
      quadrantThreshold: PropTypes.number,
      style: PropTypes.any,
      capture: PropTypes.bool
    }
  }

  static get defaultProps () {
    return {
      swipeThreshold: 120,
      quadrantThreshold: 30,
      capture: false,
      edge: true
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.quadrantThreshold !== this.props.quadrantThreshold) {
      this.setState({ quadrants: this.calculateQuadrants(newProps.quadrantThreshold) })
    }
  }

  componentWillMount () {
    const touchThreshold = 20;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: () => this.props.capture,
      onMoveShouldSetPanResponderCapture: () => this.props.capture,
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) =>{
        const {dx, dy} = gestureState;
        return (Math.abs(dx) > touchThreshold) || (Math.abs(dy) > touchThreshold);
      },
      onPanResponderRelease: (...args) => this.handleSwipe(...args)
    })
  }

  /**
   * Calculate all quadrants used as delimiters for detecting the swipe direction
   * @param {Number} [threshold=defaultProps.quadrantTreshholds] A threshold for
   * all quadrants. A swipe ended inside a threshold don't trigger a swipe
   * @return {Object} An object containing all 5 quadrants with a stating angle
   * and an end angle
   */
  calculateQuadrants (threshold) {
    return {
      right: [0 + threshold, 0 - threshold],
      up: [-90 + threshold, -90 - threshold],
      down: [90 + threshold, 90 - threshold],
      topLeft: [-180 + threshold, -180],
      bottomLeft: [180, 180 - threshold]
    }
  }

  /**
   * Checks if an angle is inside a specific quadrant
   * @param {Object} quadrants An object containing all possible quadrants
   * @param {String} direction The swipe direction
   * @param {Number} angle The swipe angle
   * @return {Boolean}
   */
  isInsideQuadrant (quadrants, direction, angle) {
    return angle >= quadrants[direction][1] && angle <= quadrants[direction][0]
  }

  /**
   * Handles a onPanResonderRelease triggering the correct prop
   * @param {Object} pan The object returned from View.onPanResponderRelease
   * @param {Object} gesture The gesture info returned from View.onPanResponderRelease
   */
  handleSwipe (pan, gesture) {
    const angle = Math.atan2(gesture.dy, gesture.dx) * (180 / Math.PI)
    const distance = Math.sqrt(Math.pow(gesture.dx, 2) + Math.pow(gesture.dy, 2))

    if (distance > this.props.swipeThreshold) {
      if (this.props.onSwipeUp && this.isInsideQuadrant(this.state.quadrants, 'up', angle)) {
        this.props.onSwipeUp(distance, angle)
      } else if (this.props.onSwipeDown && this.isInsideQuadrant(this.state.quadrants, 'down', angle)) {
        this.props.onSwipeDown(distance, angle)
      } else if (this.props.onSwipeRightEdge && gesture.x0 < 60 && this.isInsideQuadrant(this.state.quadrants, 'right', angle)) {
        this.props.onSwipeRightEdge(distance, angle)
      } else if (this.props.onSwipeRight && this.isInsideQuadrant(this.state.quadrants, 'right', angle)) {
        this.props.onSwipeRight(distance, angle)
      } else if (this.props.onSwipeLeftEdge && gesture.x0 > Dimensions.get('window').width - 60 && this.isInsideQuadrant(this.state.quadrants, 'topLeft', angle)) {
        this.props.onSwipeLeftEdge(distance, angle)
      } else if (this.props.onSwipeLeft && this.isInsideQuadrant(this.state.quadrants, 'topLeft', angle)) {
          this.props.onSwipeLeft(distance, angle)
      } else if (this.props.onSwipeLeft && this.isInsideQuadrant(this.state.quadrants, 'bottomLeft', angle)) {
          this.props.onSwipeLeft(distance, angle)
      } else if (this.props.onUnhandledSwipe) {
        this.props.onUnhandledSwipe(distance, angle)
      }
    } else if (this.props.onUnhandledSwipe) {
      this.props.onUnhandledSwipe(distance, angle)
    }
  }

  render () {
    return (
      <View {...this._panResponder.panHandlers} style={this.props.style}>
        {this.props.children}
      </View>
    )
  }
}