/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, Image, View, Button, WebView} from 'react-native';
import GestureView from './components/GestureView'
import { createBottomTabNavigator } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialComm from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroMaterials,
  ViroARPlaneSelector,
  ViroARSceneNavigator,
} from 'react-viro';

var sharedProps = {
  apiKey:"EFC51CC7-633C-428B-AD19-1976045DD005",
}
var InitialARScene = require('./components/TourScreen');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeImage: {
    minWidth: '70%',
    maxWidth: '90%'
  },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.home}>
        <Image
          style={styles.homeImage}
          source={require('./assets/splash.png')}
          resizeMode="contain" />
      </View>
    );
  }
}

class MapScreen extends React.Component {
  onEnablePitch() {
    this._webview.injectJavaScript('beforeMap.easeTo({pitch:45});')
  }

  onDisablePitch() {
    this._webview.injectJavaScript('beforeMap.easeTo({pitch:0});')
  }

  onLowerOpacity() {
    this._webview.injectJavaScript('document.getElementById("after").style.opacity = .75;')
  }

  onHigherOpacity() {
    this._webview.injectJavaScript('document.getElementById("after").style.opacity = 1;')
  }

  render() {
    const webViewStyle = Platform.select({
      ios: {marginTop: 20},
      android: {}
    });

    return (
      <GestureView
        style={{ flex: 1 }}
        onSwipeUp={this.onEnablePitch.bind(this)}
        onSwipeDown={this.onDisablePitch.bind(this)}
        onSwipeLeftEdge={this.onLowerOpacity.bind(this)}
        onSwipeRightEdge={this.onHigherOpacity.bind(this)}
        swipeThreshold={400}
        capture >
        <WebView
          source={{uri: 'https://dotsconnect.us/hohokam-app/swipe.html'}}
          style={webViewStyle}
          javaScriptEnabled={true}
          ref={c => this._webview = c}
          bounces={false}
          scrollEnabled={false}
        />
      </GestureView>
    );
  }
}

class TourScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ViroARSceneNavigator
          apiKey='EFC51CC7-633C-428B-AD19-1976045DD005'
          initialScene={{scene: InitialARScene}} />
      </View>
    );
  }
}

export default createBottomTabNavigator({
  Home: HomeScreen,
  Map: MapScreen,
  Tour: TourScreen
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let icon;
      if (routeName === 'Home') {
        icon = (<MaterialComm name='home-outline' size={25} color={tintColor} />)
      } else if (routeName === 'Map') {
        icon = (<Entypo name='map' size={25} color={tintColor} />)
      }  else if (routeName === 'Tour') {
        icon = (<MaterialComm name='map-marker-outline' size={25} color={tintColor} />)
      }

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return icon;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#333',
    inactiveTintColor: '#AAA',
    showLabel: false,
  },
});