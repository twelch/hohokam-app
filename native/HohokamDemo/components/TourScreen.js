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
  ViroMaterials,
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
        <ViroAmbientLight color={"#999999"} intensity={250} />
        <ViroDirectionalLight
          direction={[-1, -.75, -.15]}
          color="#ffffff"
          castsShadow={true}
          shadowMapSize={2048}
          shadowOpacity={.7} />
        <ViroARPlane minHeight={.5} minWidth={.5} alignment={"Horizontal"}>
          <Viro3DObject source={require('../assets/adobe_4.vrx')}          
            position={[-12,0,-30]}
            scale={[0.012, 0.012, 0.01]}
            arShadowReceiver={true}
            type="VRX"
          />
          <ViroQuad
            position={[-25, .5, -25]}
            rotation={[-90, 0, 0]}
            width={50} height={50}
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

ViroMaterials.createMaterials({
  ground:{
    diffuseColor: "#000000"
  }
})

module.exports = TourScreen;
