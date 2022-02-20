import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
