'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroQuad,
  ViroText,
  ViroConstants,
  ViroARPlane,
  ViroNode,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight,
} from 'react-viro';

export default class TourScreen extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text : "Welcome to AR..."
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
  }

  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized} >
        <ViroAmbientLight color={"#999999"} />
        <ViroDirectionalLight
          direction={[-1,-.5,.5]}
          color="#ffffff"
          castsShadow={true}
          shadowMapSize={2048}
          shadowOpacity={.7} />
        <ViroARPlane minHeight={.5} minWidth={.5} alignment={"Horizontal"}>
          <Viro3DObject source={require('../assets/adobe_maya.vrx')}
            position={[-12, 0, -18]}
            scale={[0.05, 0.05, 0.05]}
            type="VRX"
          />
          <ViroQuad
            position={[-5, 0, -5]}
            rotation={[-90, 0, 0]}
            width={20} height={20}
            arShadowReceiver={true} />
        </ViroARPlane>
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Tracking!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = TourScreen;
