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

import Mapbox from '@mapbox/react-native-mapbox-gl'

Mapbox.setAccessToken('pk.eyJ1IjoidHdlbGNoIiwiYSI6ImNqYzVxYTJ6NTF2NWUyeHBmNjcwdWwxY28ifQ.ug4rD1lc-yvGduyTkO18UA');

var sharedProps = {
  apiKey:"EFC51CC7-633C-428B-AD19-1976045DD005",
}
var InitialARScene = require('./components/TourScreen');

var NAV_SELECT = "NAV_SELECT";
var NAV_TOUR = "NAV_TOUR";

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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginTop: 12,
    marginRight: 14,
    marginLeft: 14,
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
  },
  arBackButton: {
    backgroundColor: 'rgba(122,122,122,0.3)',
    color: '#FFF',
    borderRadius: 30,
    padding: 5,
    marginTop: 10,
    marginLeft: 8,
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
  arBackButtonSelected: {
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
          <TouchableOpacity style={{ ...styles.mapButton, ...(this.state.showTransparency ? styles.mapButtonSelected : {}) }} onPress={this.onToggleOpacity.bind(this)}>
            <MaterialComm name='opacity' size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.mapButton, ...(this.state.showLocation ? styles.mapButtonSelected : {}) }} onPress={this.onToggleLocation.bind(this)}>
            <FontAwesome name='location-arrow' size={25} />
          </TouchableOpacity>
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
            geolocationEnabled={true}
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

class TourNavigatorScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nav: NAV_SELECT,
      showLocation: false
    }
  }

  onEnablePitch() {
    this._webview.injectJavaScript('toggleAfterTransparency();');
  }

  onDisablePitch() {
    this._webview.injectJavaScript('toggleAfterTransparency();');
  }

  onToggleLocation() {
    this._webview.injectJavaScript('beforeGeo._geolocateButton.click(); afterGeo._geolocateButton.click()');
    this.setState({
      showLocation: !this.state.showLocation
    })
  }

  onMessage(event) {
    if (event && event.nativeEvent.data === 'startTour') {
      this._startTour()
    }
  }
  
  _getTourSelect() {
    return (
      <View style={styles.container} >
        <SafeAreaView style={styles.overHeader}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 8 }} >
            <TouchableOpacity style={{ ...styles.mapButton, ...(this.state.showLocation ? styles.mapButtonSelected : {}) }} onPress={this.onToggleLocation.bind(this)}>
              <FontAwesome name='location-arrow' size={25} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <GestureView
          style={{ flex: 1 }}
          onSwipeUp={this.onEnablePitch.bind(this)}
          onSwipeDown={this.onDisablePitch.bind(this)}
          swipeThreshold={400}
          capture >
          <WebView
            source={{uri: 'https://dotsconnect.us/hohokam-app/tour-select.html'}}
            javaScriptEnabled={true}
            geolocationEnabled={true}
            onMessage={this.onMessage.bind(this)}
            ref={c => this._webview = c}
            bounces={false}
            scrollEnabled={false} />
        </GestureView>
      </View>
    );
  }

  _getTour() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.overHeader}>
          <View style={{ flex: 1, flexDirection: 'row' }} >
            <TouchableOpacity style={{ ...styles.arBackButton, ...(this.state.showTransparency ? styles.arBackButtonSelected : {}) }} onPress={this._exitTour.bind(this)}>
              <Entypo name='chevron-thin-left' size={25} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <ViroARSceneNavigator
          apiKey='EFC51CC7-633C-428B-AD19-1976045DD005'
          initialScene={{scene: InitialARScene}}
          onExitViro={this._exitTour} />
      </View>
    )
  }

  _startTour() {
    this.setState({
      nav: NAV_TOUR
    })
  }

  _exitTour() {
    this.setState({
      nav: NAV_SELECT
    })
  }

  render() {
    if (this.state.nav == NAV_SELECT) {
      return this._getTourSelect();
    } else if (this.state.nav == NAV_TOUR) {
      return this._getTour();
    }
  }
}

class ARSelectScreenNative extends React.Component {
  render() {
    return (
      <Mapbox.MapView
        styleURL={'mapbox://styles/twelch/cjkybga2v4w2r2rkh8ynqbqzy'}
        zoomLevel={14}
        maxZoom={15}
        centerCoordinate={[-111.841582, 33.434923]}
        style={styles.container}>
          {/* <Mapbox.VectorSource
            id='hohokom-label-points'
            url='twelch.cjk8u01yw01szm0nz6esbrkph-8cm82' >
            <Mapbox.SymbolLayer
              id='hohokom-labels'
              sourceID='hohokom-label-points'
              sourceLayerID = 'hohokom-label-points'
              style={{
                textField: '{name}',
                textSize: 16
              }}
            />
          </Mapbox.VectorSource> */}
          {/* <Mapbox.RasterSource
            id='base-source'
            url='https://api.mapbox.com/v4/twelch.hohokam_base/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidHdlbGNoIiwiYSI6ImNqYzVxYTJ6NTF2NWUyeHBmNjcwdWwxY28ifQ.ug4rD1lc-yvGduyTkO18UA' 
            tileSize={256} >
            <Mapbox.RasterLayer
              id="base"
              sourceID="base-source"
              before
            />
          </Mapbox.RasterSource>
          <Mapbox.RasterSource
            id='structure-source'
            url='https://api.mapbox.com/v4/twelch.hohokam_structure/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidHdlbGNoIiwiYSI6ImNqYzVxYTJ6NTF2NWUyeHBmNjcwdWwxY28ifQ.ug4rD1lc-yvGduyTkO18UA' 
            tileSize={256} >
            <Mapbox.RasterLayer
              id="structure"
              sourceID="structure-source"
            />
          </Mapbox.RasterSource> */}
      </Mapbox.MapView>
    );
  }
}

const BottomNav = createBottomTabNavigator({
  Home: HomeScreen,
  Map: MapScreen,
  Tour: TourNavigatorScreen,
  Share: HomeScreen,
  Search: HomeScreen,
}, {
  initialRouteName: 'Map',
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let icon;
      if (routeName === 'Home') {
        icon = (<MaterialComm name='menu' size={28} color={tintColor} />)
      } else if (routeName === 'Map') {
        icon = (<Entypo name='map' size={25} color={tintColor} />)
      } else if (routeName === 'Tour') {
        icon = (<MaterialComm name='map-marker-outline' size={28} color={tintColor} />)
      }  else if (routeName === 'Share') {
        icon = (<Entypo name='share-alternative' size={24} color={tintColor} />)
      } else if (routeName === 'Search') {
        icon = (<Entypo name='magnifying-glass' size={26} color={tintColor} />)
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
