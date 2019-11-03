import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Login from './Login';
import Signup from './Signup';
import Button from './Button';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showSignup: false
    }
  }

  render() {
    return (
      <View style={styles.initScreen}>
        <Text style={styles.title}>Trackr</Text>
        <View style={styles.buttonGroup}>
          <Button buttonStyle={styles.loginButton} textStyle={{color: 'white'}} text={'Log In'} onPress={() => this.showLogin()}/>
          <Button buttonStyle={styles.signUpButton} textStyle={{color: 'white'}} text={'Sign Up'} onPress={() => this.showSignup()}/>
        </View>
        <Login switch={()=>{this.showSignup()}}width={300} height={600} show={this.state.showLogin} hide={() => this.hideLogin()}/>
        <Signup switch={()=>{this.showLogin()}} width={300} height={600} show={this.state.showSignup} hide={() => this.hideSignup()}/>
      </View>
    );
  }

  showLogin() {
    this.setState({showLogin: true, showSignup: false});
  }
  showSignup() {
    this.setState({showLogin: false, showSignup: true});
  }
  hideLogin() {
    this.setState({showLogin: false, showSignup: false});
  }
  hideSignup() {
    this.setState({showLogin: false, showSignup: false});
  }

}


const styles = StyleSheet.create({
  title: {
    flex: 1,
    fontSize: 78,
    fontWeight:'bold',
    color: '#4B6962',
    alignItems: 'center'
    
  },
  initScreen: {
    backgroundColor:'#F4F7F5', 
    flex:1,
    flexDirection: 'column'
  },
  buttonGroup:{
    flex: 3,
    alignItems: 'center',
    height: 150,
    flexDirection: 'column'
  },
  loginButton: {
    backgroundColor: '#E07B49', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175
  },
  signUpButton: {
    backgroundColor: '#64AC93', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
 
  }
 
});
export default App;
