import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoadingScreen from './Screens/LoadingScreen';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './Context/AuthContext';

const Stack = createStackNavigator();

function App() {
  const [auth, setAuth] = useState(null);

  const changeAuth = useCallback(function (condition) {
    setAuth(condition);
  }, []);

  useEffect(
    function () {
      async function checkAuth() {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(
            'https://alerts.ulties.com/api/v1.0/user',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.data.id) {
            setAuth(true);
          } else {
            setAuth(false);
          }
        } else {
          setAuth(false);
        }
      }

      checkAuth();
    },
    [auth],
  );

  let Screens;

  if (auth == null) {
    Screens = <Stack.Screen name="LoadingScreen" component={LoadingScreen} />;
  } else if (auth == false) {
    Screens = <Stack.Screen name="LoginScreen" component={LoginScreen} />;
  } else if (auth == true) {
    Screens = <Stack.Screen name="HomeScreen" component={HomeScreen} />;
  }

  return (
    <AuthContext.Provider value={{auth, changeAuth}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {Screens}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
