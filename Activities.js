import React, {Component} from "react";
import {LayoutAnimation, UIManager, Animated, PanResponder, Dimensions, StyleSheet, AsyncStorage} from 'react-native';
import {Body, Container, Header, Title, View, Text, Card, CardItem} from "native-base";
import Button from './Button';
import AddMeal from './AddActivity';
import EditMeal from './EditActivity';
import { TouchableOpacity } from "react-native-gesture-handler";
import AddActivity from "./AddActivity";
import EditActivity from "./EditActivity";

export class SwipeableCard extends Component {
  translateX = new Animated.Value(0);
  _panResponder = PanResponder.create({
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: Animated.event([null, {dx: this.translateX}]),
    onPanResponderRelease: (e, {vx, dx}) => {
      const screenWidth = Dimensions.get("window").width;
      if (Math.abs(vx) >= 0.5 || Math.abs(dx) >= 0.5 * screenWidth) {
        Animated.timing(this.translateX, {
          toValue: dx > 0 ? screenWidth : -screenWidth,
          duration: 200
        }).start(this.props.onDismiss);
      } else {
        Animated.spring(this.translateX, {
          toValue: 0,
          bounciness: 10
        }).start();
      }
    }
  });


  render() {
    return (
      <View>
        <Animated.View
          style={{transform: [{translateX: this.translateX}]}} {...this._panResponder.panHandlers}>
          <TouchableOpacity onLongPress={()=>{this.props.edit(this.props.id)}}>
          <Card style={styles.card}>
            <CardItem>
              <Body>
              <Text style={styles.heading}>
                {this.props.header}
              </Text>
              <Text style={styles.paragraph}>
                {this.props.body}
              </Text>
              </Body>
            </CardItem>
          </Card>
          </TouchableOpacity>
        </Animated.View>
      </View>

    );
  }
}


export default class Activities extends Component {
  titles = new Array(5).fill(null).map((_, i) => `Card #${i}`);
  state = {
    closedIndices: [],
    activities: [],
    showEdit: false,
    showAdd: false,
    user: ''
  };

  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.shouldRender = this.shouldRender.bind(this);
  }

  async deleteAct(id){
    let msg = await fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
      method: 'DELETE',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
      }
      });
      msg = await msg.json();
  }

  async fetchTodayActivities(){
    let msg = await fetch('https://mysqlcs639.cs.wisc.edu/activities', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
      }
      }).catch();
    msg = await msg.json();
    let update = [];
    for (item of msg["activities"]){
      var date = new Date(item["date"]);
        if((this.isToday(date))){
          update.push(item);
        }
    }
    this.setState({activities: update});

  }

  isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  async _getData(){
    var token = await AsyncStorage.getItem('token');
    // remove preceeding and trailing backslash
    token = token.substr(1).slice(0, -1);
    this.setState({token});
  }

  hideAdd(){
    this.setState({showEdit: false, showAdd: false});
  }
  showAdd(){
    this.setState({showEdit: false, showAdd: true});
  }
  hideEdit(){
    this.setState({showEdit: false, showAdd: false, currentId: undefined});
  }
  showEdit(){
    this.setState({showEdit: true, showAdd: false});
  }

  componentDidMount(){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this._getData().then(()=>{this.fetchTodayActivities()});
    });
  }
  componentWillUnmount(){
    this.focusListener.remove();
  }
 

  shouldRender(index) {
    return this.state.closedIndices.indexOf(index) === -1 && !this.state.showEdit && !this.state.showAdd;
  }

  handleCardPress(id){
    this.setState({currentEdit: id}, ()=>{this.showEdit()});
  }
  render() {
    return (
      <Container style={styles.container}>
        <Text style={styles.head}>Today's Activities</Text>
        <Button onPress={()=> this.showAdd()} buttonStyle={styles.add} textStyle={{color: 'white'}} text={'Add'}/>
        <AddActivity update={()=>{this.fetchTodayActivities()}} width={300} height={600} show={this.state.showAdd} hide={()=>{this.hideAdd()}} token={this.state.token}/>
        <EditActivity update={()=>{this.fetchTodayActivities()}} width={300} height={600} show={this.state.showEdit} hide={()=>{this.hideEdit()}} token={this.state.token} id={this.state.currentEdit}/>
        {this.state.activities.map((act, i) => this.shouldRender(i) &&
          <TouchableOpacity key={i} ><View key={i}><SwipeableCard id={act["id"]} edit={(id)=>{this.handleCardPress(id)}}  
          header={act["name"]} 
          body={act["duration"] + ' minutes, ' + act["calories"] + ' calories'} 
                onDismiss={() => {

            if ([...new Array(this.state.activities.length)].slice(i + 1, this.state.activities.length).some(this.shouldRender)) {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); 
            }

            this.deleteAct(act["id"]);
            
            this.setState({
              closedIndices: [...this.state.closedIndices, i]
            })
          }}
          />
            </View></TouchableOpacity>)}
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  head:{
    marginTop: 50,
    fontSize: 40,
    alignSelf: 'center'
  },
  container: {
    height: '100%',
    backgroundColor: '#ecf0f1',
    padding: 8,
    marginTop: 10
  },
  paragraph: {
    fontSize: 12,
    paddingBottom: 5,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    padding: 0,
  },
  add:{
    backgroundColor: '#9FC9AE', 
    padding: 10, 
    borderRadius: 10,
    height: 60,
    width: 175,
    alignSelf: 'center',
    alignItems: 'center',
    margin:10,
    justifyContent: 'center',
    alignContent: 'center'
  }
});
