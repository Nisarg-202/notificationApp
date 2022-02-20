/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Sound from 'react-native-sound';
import SystemSetting from 'react-native-system-setting';
import App from './App';
import {name as appName} from './app.json';

Sound.setCategory('Playback');

messaging().setBackgroundMessageHandler(async function (remoteMessage) {
  SystemSetting.setVolume(1, {type: 'notification'});
  SystemSetting.setVolume(1, {type: 'music'});
  SystemSetting.setVolume(1, {type: 'ring'});
  SystemSetting.setVolume(1, {type: 'system'});
  const whoosh = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, function (err) {
    if (err) {
      console.log('Error', err);
    } else {
      whoosh.play(function (success) {
        console.log('success', success);
      });
    }
  });
  console.log('Working');
  console.log(remoteMessage);
  Alert.alert('FCM TOKEN Message arrived');
});

AppRegistry.registerComponent(appName, () => App);
