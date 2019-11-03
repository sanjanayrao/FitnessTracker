import React from 'react';
import { Text, View, TouchableWithoutFeedback, Dimensions, TextInput, StyleSheet} from 'react-native';
import Button from './Button';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      error: ''
    };
  }

  createAccount(){
    this.props.navigation.navigate('Profile')
  }

  render() {
    if(this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);

      return (
        <View style={{flex: 1,position: 'absolute'}}>
          <TouchableWithoutFeedback onPress={() => this.props.hide()}>
            <View style={{width: screenWidth, height: screenHeight, backgroundColor: 'black', opacity: 0.75}}>
            </View>
          </TouchableWithoutFeedback>
          
          <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height)/2, backgroundColor: 'white', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Sign Up</Text>
            <Button buttonStyle={styles.XButton} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <TextInput style={styles.textInput, {width: (this.props.width/2)}}
               placeholder="Enter a Username"
               onChangeText={(username) => this.setState({username})}
               value={this.state.username}/>
                <TextInput style={styles.textInput, {width: (this.props.width/2)}}
               placeholder="Enter a Password"
               onChangeText={(password) => this.setState({password})}
               value={this.state.password}/>
               <TextInput style={styles.textInput, {width: (this.props.width/2)}}
               placeholder="First Name"
               onChangeText={(firstName) => this.setState({firstName})}
               value={this.state.firstName}/>
               <TextInput style={styles.textInput, {width: (this.props.width/2)}}
               placeholder="Last Name"
               onChangeText={(lastName) => this.setState({lastName})}
               value={this.state.lastName}/>
               <Button style={styles.loginButton} onPress={this.props.switch} text={'Already have an account?'}/>
               <Button style={styles.createAccountButton} onPress={this.createAccount} text={'Create Account'}/>
          </View>
          
        </View>
      )
    }
    return (<View></View>)
  }
}

const errorUser = 'Username already taken!';
const errorMissingField = 'Please fill out the username and password fields.'

const styles = StyleSheet.create({
  textInput:{
    height: 40,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 20, 
    marginTop: 80
  },
  XButton:{
    alignItems: 'center', 
    justifyContent: 'center',
    width: 70,
    height: 70, 
    position: 'absolute', 
    right: 0
  },
  loginButton:{
    position: 'absolute',
    alignContent: 'center'
  },
  creatAccountButton:{

  }
});
export default Signup;
