/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, Image, View, WebView} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialComm from 'react-native-vector-icons/MaterialCommunityIcons';

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
  render() {
    const webViewStyle = Platform.select({
      ios: {marginTop: 20},
      android: {}
    });

    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{uri: 'https://bl.ocks.org/twelch/raw/c86e152ef915d6de9a5c025f22e8717d/'}}
          style={webViewStyle}
        />
      </View>
    );
  }
}

export default createBottomTabNavigator({
  Home: HomeScreen,
  Map: MapScreen
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let icon;
      if (routeName === 'Home') {
        icon = (<MaterialComm name='home-outline' size={25} color={tintColor} />)
      } else if (routeName === 'Map') {
        icon = (<Entypo name='map' size={25} color={tintColor} />)
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