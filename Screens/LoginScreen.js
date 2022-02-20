import React, {useContext, useState} from 'react';
import {StyleSheet, View, ScrollView, Alert} from 'react-native';
import {Card, Input, Button} from 'react-native-elements';
import {getUniqueId} from 'react-native-device-info';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../Context/AuthContext';
import constants from '../constants';

function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function onLogin() {
    console.log('email', email, ' password ', password);
    const deviceId = getUniqueId();
    console.log('DeviceId', deviceId);
    const response = await axios.post(
      'https://alerts.ulties.com/api/v1.0/login',
      {
        email,
        password,
        device: deviceId,
      },
    );
    const {token = null} = response.data;
    console.log('Token came is ', token);
    if (token) {
      await AsyncStorage.setItem('token', response.data.token);
      if (email === constants.adminEmail) {
        await AsyncStorage.setItem('isAdmin', 'true');
      } else {
        await AsyncStorage.setItem('isAdmin', 'false');
      }
      authContext.changeAuth(true);
    } else {
      Alert.alert('Authentication Failed!', response.data.message, [
        {text: 'OK', onPress: function () {}},
      ]);
    }
  }
  return (
    <ScrollView>
      <View style={styles.screen}>
        <Card>
          <Card.Title>Login</Card.Title>
          <Card.Divider />
          <Input
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          <Input
            placeholder="Password"
            keyboardType="visible-password"
            onChangeText={setPassword}
            secureTextEntry
            value={password}
          />
          <Button
            title="Login"
            containerStyle={{backgroundColor: 'blue'}}
            titleStyle={{color: 'white'}}
            onPress={onLogin}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default LoginScreen;
