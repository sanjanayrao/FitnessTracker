import React from 'react';
import { Text, View, TouchableWithoutFeedback, TextInput, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  sendRequest(){
    
  }

  render() {
    if(this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);
      return (
        <View style={{position: 'absolute'}}>
          <TouchableWithoutFeedback onPress={() => this.props.hide()}>
            <View style={{width: screenWidth, height: screenHeight, backgroundColor: 'black', opacity: 0.75}}>
            </View>
          </TouchableWithoutFeedback>
          <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height)/2, backgroundColor: 'white', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Log In</Text>
            <Button buttonStyle={styles.XButton} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <TextInput style={styles.textInput, {width: (this.props.width/2)}}
               placeholder="Enter a Username"
               onChangeText={(username) => this.setState({username})}
               value={this.state.username}/>
                <TextInput style={styles.textInput, {width: (this.props.width/2)}}
               placeholder="Enter a Password"
               onChangeText={(password) => this.setState({password})}
               value={this.state.password}/>
               <Button style={styles.signUpButton} onPress={this.props.switch} text={'No account yet? Tap here to create one!'}/>
               <Button style={styles.enterButton} onPress={this.sendRequest} text={'Log In'} />
          </View>
        </View>
      )
    }
    return (<View></View>)
  }
}
const error = 'Username or Password is incorrect!';
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
  signUpButton:{
    position: 'absolute',
    alignContent: 'center'
  },
  enterButton:{

  }
});
export default Login;
