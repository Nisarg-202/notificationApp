import React, {useContext, useEffect, useState} from 'react';
import {Alert, Text, View, StyleSheet, ScrollView} from 'react-native';
import {Button, Input, Card} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import Sound from 'react-native-sound';
import SystemSetting from 'react-native-system-setting';
import {getUniqueId} from 'react-native-device-info';
import AuthContext from '../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../constants';

Sound.setCategory('Playback');

function HomeScreen() {
  const authContext = useContext(AuthContext);
  const [problem, setProblem] = useState('');

  async function onLogout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('isAdmin');
    authContext.changeAuth(false);
  }

  useEffect(function () {
    async function getAndSendToken() {
      const token = await messaging().getToken();
      if ((await AsyncStorage.getItem('isAdmin')) === 'true') {
        await axios.post(`${constants.baseURL}/setToken`, {
          token,
        });
      }
      const authToken = await AsyncStorage.getItem('token');
      await axios.post(
        'https://alerts.ulties.com/api/v1.0/push-tokens',
        {
          token,
          device: getUniqueId(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
    }

    getAndSendToken();
  }, []);

  useEffect(function () {
    const unsubscribe = messaging().onMessage(function (message) {
      SystemSetting.setVolume(1, {type: 'notification'});
      SystemSetting.setVolume(1, {type: 'music'});
      SystemSetting.setVolume(1, {type: 'ring'});
      SystemSetting.setVolume(1, {type: 'system'});
      const whoosh = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, function (
        err,
      ) {
        if (err) {
          console.log('Error', err);
        } else {
          whoosh.play(function (success) {
            console.log('success', success);
          });
        }
      });
      console.log('FCM message', message);
    });
    return unsubscribe;
  }, []);

  useEffect(function () {
    messaging().onTokenRefresh(async function (token) {
      if ((await AsyncStorage.getItem('isAdmin')) === 'true') {
        await axios.post(`${constants.baseURL}/setToken`, {
          token,
        });
      }
      const authToken = await AsyncStorage.getItem('token');
      await axios.post(
        'https://alerts.ulties.com/api/v1.0/push-tokens',
        {
          token,
          device: getUniqueId(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
    });
  }, []);

  async function onSendNotification() {
    console.log('Sent');
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await axios.get('https://alerts.ulties.com/api/v1.0/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axios.post(`${constants.baseURL}/fcm`, {
        problem,
        email: user.data.email,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ScrollView>
      <View style={styles.screen}>
        <Card>
          <Card.Title>
            <Text style={styles.TextStyle}>Send Notification</Text>
          </Card.Title>
          <Card.Divider />
          <View style={{marginVertical: 5}}>
            <Input
              onChangeText={setProblem}
              value={problem}
              placeholder="Enter Problem / Issue"
            />
          </View>
          <Button
            title="Send Notification"
            titleStyle={{color: 'white'}}
            onPress={onSendNotification}
            buttonStyle={{
              backgroundColor: 'blue',
            }}
          />
          <View style={{marginVertical: 20}}>
            <Button
              title="Logout"
              titleStyle={{color: 'white'}}
              onPress={onLogout}
              buttonStyle={{
                backgroundColor: 'red',
              }}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  TextStyle: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
});

export default HomeScreen;
