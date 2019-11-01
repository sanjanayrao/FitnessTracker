import React from 'react';
import { View } from 'react-native';
import Modal from './Modal';
import Button from './Button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Show Modal'} onPress={() => this.showModal()}/>
        <Modal width={300} height={600} show={this.state.showModal} hide={() => this.hideModal()}/>
      </View>
    );
  }

  showModal() {
    this.setState({showModal: true});
  }

  hideModal() {
    this.setState({showModal: false});
  }
}

export default App;
