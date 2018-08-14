/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, Text, Image, View, Button, TouchableOpacity, WebView} from 'react-native';
import GestureView from './components/GestureView'
import { createBottomTabNavigator, SafeAreaView } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialComm from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
  overHeader: {
    position: 'absolute',
    marginTop: StatusBar.currentHeight,
    top: 0,
    left: 0,
    width: '100%',
    height: 40,
    backgroundColor: 'transparent',
    zIndex: 9999
  },
  mapButton: {
    backgroundColor: '#EEE',
    color: '#FFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#BBB',
    padding: 5,
    marginTop: 10,
    marginRight: 8,
    height: 40,
    width: 40,
    color: '#FFF',
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapButtonSelected: {
    backgroundColor: '#CCC'
  }
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
  constructor(props) {
    super(props)

    this.state = {
      showTransparency: false,
      showLocation: false
    }
  }


  onEnablePitch() {
    this._webview.injectJavaScript('beforeMap.easeTo({pitch:45});');
  }

  onDisablePitch() {
    this._webview.injectJavaScript('beforeMap.easeTo({pitch:0});');
  }

  onToggleLocation() {
    this._webview.injectJavaScript('beforeGeo._geolocateButton.click(); afterGeo._geolocateButton.click()');
    this.setState({
      showLocation: !this.state.showLocation
    })
  }

  onLowerOpacity() {
    this._webview.injectJavaScript('document.getElementById("after").style.opacity = .75;')
    this.setState({
      showTransparency: true
    })
  }

  onHigherOpacity() {
    this._webview.injectJavaScript('document.getElementById("after").style.opacity = 1;')
    this.setState({
      showTransparency: false
    })
  }

  onToggleOpacity() {
    if (this.state.showTransparency) {
      this.onHigherOpacity();
    } else {
      this.onLowerOpacity();
    }
    this.setState({
      showTransperency: !this.state.showTransparency
    })
  }

  render() {
    const webViewStyle = {
      margin: 0
    };

    return (
      <View style={styles.container} >
        <SafeAreaView style={styles.overHeader}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
            <TouchableOpacity style={{ ...styles.mapButton, ...(this.state.showTransparency ? styles.mapButtonSelected : {}) }} onPress={this.onToggleOpacity.bind(this)}>
              <MaterialComm name='opacity' size={25} />
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.mapButton, ...(this.state.showLocation ? styles.mapButtonSelected : {}) }} onPress={this.onToggleLocation.bind(this)}>
              <FontAwesome name='location-arrow' size={25} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

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
      </View>
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

const BottomNav = createBottomTabNavigator({
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

export default class App extends Component {
  render() {
    return [
      <StatusBar
        translucent
        backgroundColor="rgba(0, 0, 0, 0.24)"
        animated
      />,
      <BottomNav />
    ];
  }
}
