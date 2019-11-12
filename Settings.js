// settins screen with one clickable 'card' setting for account deletion, on click pops up a small modal with two options to proceed or
// cancel. delete request occurs on confirmation
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  AsyncStorage
} from 'react-native';
import ConfirmModal from './ConfirmModal';
import Button from './Button';


export default class Activities extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user: '',
            token: '',
            showDel: false,
            showSignOut: false
        }
    }
    async sendReq(){
        let res = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.user, {
            method: 'DELETE',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'x-access-token' : this.state.token
            }
      }).then(()=>{this.signOut()});
      await AsyncStorage.multiRemove(['user', 'token']);
      
    }
    async signOut(){
       await AsyncStorage.multiRemove(['user', 'token']);
        this.props.navigation.navigate('Home');
    }

    async _getData(){
        var user = await AsyncStorage.getItem('user');
        var token = await AsyncStorage.getItem('token');
        // remove preceeding and trailing backslash
        user = user.substr(1).slice(0, -1);
        token = token.substr(1).slice(0, -1);
        this.setState({user, token});
        
    }
    componentDidMount(){
        this._getData();
    }

    showConfirmDelete(){
        this.setState({showDel: true});
    }

    showConfirmSignout(){
        this.setState({showSignOut: true});
    }

    hideConfirm(){
        this.setState({showDel: false, showSignOut: false});
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.settings}>
                    <Button buttonStyle={styles.option} textStyle={{fontSize: 18}} text={'Delete my account'} onPress={()=>{this.showConfirmDelete()}}/>
                    <Button buttonStyle={styles.option} textStyle={{fontSize: 18}} text={'Sign out'} onPress={()=>{this.showConfirmSignout()}}/>
                </View>
                <ConfirmModal width={300} height={600} msg={'delete your account'} title={'Confirm Deletion'}  trig={()=>{this.sendReq()}} hide={()=>{this.hideConfirm()}} show={this.state.showDel}/>
                <ConfirmModal width={300} height={600} msg={'sign out of your account'} title={'Confirm Logout'}  trig={()=>{this.signOut()}} hide={()=>{this.hideConfirm()}} show={this.state.showSignOut}/>
            </View>
        );
    }

    
}
const screenWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#F1F2EE'
    },
    option:{
        backgroundColor: '#FFFFFF', 
        borderColor: '#000000',
        padding: 10, 
        borderRadius: 10,
        height: 60,
        width: screenWidth,
        borderWidth: 1,
        borderColor: '#070707',
        justifyContent: 'center',
        marginTop: -1
    },
    settings:{
        marginTop: 70,
        flex: 3
    }
})