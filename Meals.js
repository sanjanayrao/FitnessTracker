import React, {Component} from "react";
import {LayoutAnimation, UIManager, Animated, PanResponder, Dimensions, StyleSheet, AsyncStorage} from 'react-native';
import {Body, Container, View, Text, Card, CardItem} from "native-base";
import Button from './Button';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";


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
          <TouchableOpacity onLongPress={()=>{this.props.edit()}}>
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


export default class Meals extends Component {
  state = {
    closedIndices: [],
    meals: [],
    user: '',
    currentEdit: undefined
  };

  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.shouldRender = this.shouldRender.bind(this);
  }

  async deleteMeal(id){
    let msg = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
      method: 'DELETE',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
      }
      });
        
  }

  async fetchTodayMeals(){
    this.setState({closedIndices: []});
    let msg = await fetch('https://mysqlcs639.cs.wisc.edu/meals', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : this.state.token
      }
      }).catch();
    msg = await msg.json();
    let update = [];
    for (item of msg["meals"]){
      var date = new Date(item["date"]);
        if((this.isToday(date))){


          let foods = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + item["id"] + '/foods/', {
            method: 'GET',
            headers: {
              'Accept' : 'application/json',
              'Content-Type' : 'application/json',
              'x-access-token' : this.state.token
            }
            });
            foods = await foods.json();
            let pro = 0;
            let fat= 0;
            let carb = 0;
            let cal = 0;
            for(food of foods["foods"]){
                pro += food["protein"];
                fat += food["fat"];
                carb +=food["carbohydrates"];
                cal += food["calories"];
                
            }
            item["protein"] = Math.round(pro);
            item["fat"] = Math.round(fat);
            item["carb"] = Math.round(carb);
            item["cal"] = Math.round(cal);
            

            update.push(item);

        }
    }
    this.setState({meals: update});
  
   
  }

  isToday = (someDate) => {
    const today = new Date()
    someDate = new Date(someDate);
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

 
  addMeal(){
    this.props.navigation.navigate('AddMeal', {token: this.state.token});
  }

  editMeal(){
    this.props.navigation.navigate('EditMeal', {token: this.state.token, id: this.state.currentEdit});
  }

  componentDidMount(){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this._getData().then(()=>{this.fetchTodayMeals()});
    });
  }
  
  componentWillUnmount(){
    this.focusListener.remove();
  }
 
  toolTip(){
    if(this.state.meals){
      return <View style={styles.hint}>
      <Text   style={{color: '#9aa195', fontSize: 12}}> Swipe to remove, press and hold to edit </Text>
    </View>;
    }
  }
  shouldRender(index) {
    return this.state.closedIndices.indexOf(index) === -1 && !this.state.showEdit && !this.state.showAdd;
  }

  handleCardPress(id){
    this.setState({currentEdit: id}, ()=>{this.editMeal()});
  }

  showCardView(){
    if(!this.state.showEdit && !this.state.showAdd){

      return <ScrollView>
      {this.state.meals.map((meal, i) => this.shouldRender(i) &&
        <TouchableOpacity key={i} ><View key={i}><SwipeableCard id={meal["id"]} edit={()=>{this.handleCardPress(meal["id"])}}  
        header={meal["name"]} 
        body={meal["cal"] + ' calories, ' + meal["protein"] + 'g protein, ' + meal["fat"] + 'g fat, ' + meal["carb"] + 'g carbs'} 
              onDismiss={() => {

          if ([...new Array(this.state.meals.length)].slice(i + 1, this.state.meals.length).some(this.shouldRender)) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); 
          }

          this.deleteMeal(meal["id"], i);
          
          this.setState({
            closedIndices: [...this.state.closedIndices, i]
          })
        }}
        />
          </View></TouchableOpacity>)}</ScrollView>;
    }
  }
  render() {
    return (
      <Container style={styles.container}>
        <Text style={styles.head}>Today's Meals</Text>
        <Button onPress={()=> this.addMeal()} buttonStyle={styles.add} textStyle={{color: 'white'}} text={'Add'}/>
            {this.showCardView()}      
            {this.toolTip() }
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  head:{
    marginTop: 60,
    fontSize: 40,
    alignSelf: 'center'
  },
  container: {
    height: '100%',
    backgroundColor: '#ecf0f1',
    padding: 8
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
  },
  hint:{
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end'    
  }
});
