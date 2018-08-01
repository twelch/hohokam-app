/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, WebView} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    const webViewStyle = Platform.select({
      ios: {marginTop: 20},
      android: {}
    });
    return (
      <View style={styles.container}>
          <WebView
            source={{uri: 'https://bl.ocks.org/twelch/raw/c86e152ef915d6de9a5c025f22e8717d/'}}
            style={webViewStyle}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
