import React from 'react';
import { Text, View, TouchableWithoutFeedback, TextInput, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';
import base64 from 'base-64';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      token: ''
    };
  }

  async sendRequest(){
   let msg = await fetch('https://mysqlcs639.cs.wisc.edu/login', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : 'Basic ' + base64.encode(this.state.username + ':' +  this.state.password)
       }
      });
    
      data = await msg.json();

      //collect error message
      err = Object.values(data);
      err = err[0];
     //console.log(data)
    
    if( msg.ok){
      this.setState({token: data["token"]}, ()=>{this.props.auth(data["token"], this.state.username)});
      this.setState({error: '' });
    }else{
      this.setState({error: err });
    }
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
          <View style={{position: 'absolute', width: this.props.width, height: this.props.height * 0.75, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height + 100)/2, backgroundColor: 'white', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Log In</Text>
            <Button buttonStyle={styles.XButton} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <View style={styles.inputFields}>
              <View style={styles.userField} > 
                <TextInput style={styles.textInput, {width: (this.props.width/2)}}
                  placeholder="Enter a Username"
                  textAlign={'center'}
                  onChangeText={(username) => this.setState({username})}
                  value={this.state.username}/>
              </View>
              <View style={styles.passField}>
                <TextInput secureTextEntry={true} style={styles.textInput, {width: (this.props.width/2)}}
                  placeholder="Enter a Password"
                  textAlign={'center'}
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}/>
              </View>
            </View>
             
               <Text style={styles.error}> {this.state.error}</Text>
               <Button textStyle={{color: 'white'}} buttonStyle={styles.enterButton} onPress={()=>{this.sendRequest()}} text={'Log In'} />
               <Button textStyle={{color: 'white'}} buttonStyle={styles.signUpButton} onPress={this.props.switch} text={'No account? Create one now!'}/>
          </View>
        </View>
      )
    }
    return (<View></View>)
  }
}

const styles = StyleSheet.create({
  textInput:{
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  userField:{
    margin: 10
  },
  passField:{
    margin: 10
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
    backgroundColor: '#553555', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10

  },
  enterButton:{
    backgroundColor: '#9FC9AE', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10

  },
  error: {
    color: 'red',
    alignSelf: 'center'
  },
  inputFields:{
    marginTop: 70,
    alignItems: 'center',
    }
});
export default Login;
