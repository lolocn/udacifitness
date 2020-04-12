import React, { Component } from 'react'
import { View, Platform, Text, StatusBar } from 'react-native'
import AddEntry from './components/AddEntry'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import History from './components/History'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { purple, white } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack'
import EntryDetail from './components/EntryDetail'
import Live from './components/Live'
import { setLocalNotification } from './utils/helpers'

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}
const Stack = createStackNavigator()
const Tab = Platform.OS === 'ios' 
  ? createBottomTabNavigator()
  : createMaterialTopTabNavigator()

function Tabs () {
  return (
    <Tab.Navigator tabBarOptions={{
      activeTintColor: Platform.OS === 'ios' ? purple : white,
      inactiveTintColor: white,
      style: {
        height: 56,
        backgroundColor: Platform.OS === 'ios' ? white : purple,
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 6,
        shadowOpacity: 1
      }
    }}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        if (route.name === 'History') {
          return <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
        } else if (route.name === 'AddEntry') {
          return <FontAwesome name='plus-square' size={30} color={tintColor} />
        }  else if (route.name === 'Live') {
          return <Ionicons name='ios-speedometer' size={30} color={tintColor}/>
        }
      },
      tabBarLabel: () => {
        if (route.name === 'History') {
          return <Text>History</Text>
        } else if (route.name === 'AddEntry') {
          return <Text>Add Entry</Text>
        } else if (route.name === 'Live') {
          return <Text>Live</Text>
        }
      }
    })}
    >
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="AddEntry" component={AddEntry} />
      <Tab.Screen name="Live" component={Live} />
    </Tab.Navigator>
  )
}

export default class App extends Component() {
  componentDidMount() {
    setLocalNotification()
  }
  render() {
    return (
      <Provider store={createStore(reducer)}>
          <View style={{flex: 1}}>
            <StatusBar backgroundColor={purple} barStyle="light-content"/>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{
                  headerStyle: {
                    backgroundColor: white
                  }
                }}>
                <Stack.Screen name="Home">
                  {Tabs}
                </Stack.Screen>
                <Stack.Screen name='EntryDetail' component={EntryDetail} 
                options={({ route }) => {
                  return {
                    title: route.params.entryId
                  }
                }}></Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </Provider>
    )
  }
}

export default App