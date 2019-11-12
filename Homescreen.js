import React from 'react';
import { View, Text, StyleSheet, AsyncStorage } from 'react-native';
import Login from './Login';
import Signup from './Signup';
import Button from './Button';

class Homescreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showSignup: false,
    }
  }
  async _storeData(token, user){
    try{
     var sentToken = await AsyncStorage.setItem('token', JSON.stringify(token));
     var sentUser = await AsyncStorage.setItem('user', JSON.stringify(user));
    }catch(e){}
  }

   login = (token, user) => {
     this._storeData(token, user);
     this.props.navigation.navigate('Profile', {'token': token, 'user': user});
    
  }
   createUser = (token, user) => {
       this._storeData(token, user);
       this.props.navigation.navigate('Profile', {'token': token, 'user': user});

   }
   

  render() {
    return (
      <View style={styles.initScreen}>
        <Text style={styles.title}>Trackr</Text>
        <View style={styles.buttonGroup}>
          <Button buttonStyle={styles.loginButton} textStyle={{color: 'white'}} text={'Log In'} onPress={() => this.showLogin()}/>
          <Button buttonStyle={styles.signUpButton} textStyle={{color: 'white'}} text={'Sign Up'} onPress={() => this.showSignup()}/>
        </View>
        <Login auth={this.login} switch={()=>{this.showSignup()}} width={300} height={600} show={this.state.showLogin} hide={() => this.hideLogin()}/>
        <Signup auth={this.createUser} switch={()=>{this.showLogin()}} width={300} height={600} show={this.state.showSignup} hide={() => this.hideSignup()}/>
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
    flex: 3,
    fontSize: 85,
    fontWeight:'bold',
    color: '#070707',
    alignSelf: 'center',
    marginTop: 150   
  },
  initScreen: {
    backgroundColor:'#F1F2EE', 
    flex:1,
    flexDirection: 'column'
  },
  buttonGroup:{
    flex: 5,
    alignItems: 'center',
    height: 150,
    flexDirection: 'column',
  },
  loginButton: {
    backgroundColor: '#9FC9AE', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signUpButton: {
    backgroundColor: '#553555', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
 
});
export default Homescreen;
