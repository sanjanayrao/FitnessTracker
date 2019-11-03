import { createStackNavigator } from 'react-navigation-stack';
import Home from './Homescreen';
import Profile from './Profile';


const AppNavigator = createStackNavigator({
  Home: { screen: Home },
  Profile: {screen: Profile}
});

export default AppNavigator;