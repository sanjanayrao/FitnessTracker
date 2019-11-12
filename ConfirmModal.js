import React from 'react';
import { Text, View, TouchableWithoutFeedback, TextInput, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';
import base64 from 'base-64';

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      token: ''
    };
  }


 componentDidMount(){

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
          <View style={{position: 'absolute', width: this.props.width, height: this.props.height * 0.55, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height + 100)/2, backgroundColor: 'white', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>{this.props.title}</Text>
            <Button buttonStyle={styles.XButton} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <View>
                <Text style={styles.confirm}>Are you sure you want to {this.props.msg}?</Text>
                <Button text={'Confirm'} onPress={()=>{this.props.trig()}} textStyle={{color: 'white'}} buttonStyle={styles.yes}/>
                <Button text={'Cancel'} onPress={()=>{this.props.hide()}} textStyle={{color:'white'}} buttonStyle={styles.no}/>
            </View>
          
          </View>
           
               
          </View>
      )
    }
    return (<View></View>)
  }
}

const styles = StyleSheet.create({
  XButton:{
    alignItems: 'center', 
    justifyContent: 'center',
    width: 70,
    height: 70, 
    position: 'absolute', 
    right: 0
  },
  yes:{
    backgroundColor: '#b33434', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
    marginTop: 20

  },
  no:{
    backgroundColor: '#7f807e', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10

  },
  confirm: {
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 15,
    fontSize: 19
  }
});
export default ConfirmModal;
