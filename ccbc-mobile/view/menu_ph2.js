import React, { Component } from 'react'
import { StyleSheet, View, Image, AsyncStorage, Text } from 'react-native'
import { Header, Button, Icon, Avatar } from 'react-native-elements'

export default class MenuPh2 extends Component {
  state = {
    open: false,
    open2: false,
    anchor: 'left',
    activeStep1: {},
    activeStep2: {},
    activeStep3: {},
    activeStep4: {},
    activeStep5: {},
    completed: {},
    comment: {},
    coin: 0,
    tohyoCoin: 0,
    headList: [],
    resultList: [],
    userid: null,
    password: null,
    tShainPk: 0,
    imageFileName: null,
    shimei: null,
    kengenCd: null,
    configCoin: 0
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  /** コンポーネントのマウント時処理 */
  async componentWillMount() {}

  onPressLogoutButton = () => {
    this.props.navigation.navigate('Login')
  }
  onPressMenuButton = () => {
    this.props.navigation.navigate('Menu')
  }
  onPressLoginGroupButton = () => {
    this.props.navigation.navigate('LoginGroup')
  }
  onPressChatButton = () => {
    this.props.navigation.navigate('Chat')
  }
  onPressChatSelectButton = () => {
    this.props.navigation.navigate('ChatSelect')
  }
  onPressChatMsgButton = () => {
    this.props.navigation.navigate('ChatMsg')
  }
  onPressChatCoinButton = () => {
    this.props.navigation.navigate('ChatCoin')
  }
  onPressHomeButton = () => {
    this.props.navigation.navigate('Home')
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name={'home'}
              type={'font-awesome'}
              color="#fff"
              onPress={this.onPressMenuButton}
            />
          }
          centerComponent={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View>
                <Image source={require('./../images/HARVEST3.png')} />
              </View>
              {/* <View>
                <Image
                  source={require('./../images/cvircy.png')}
                  style={{
                    width: 25,
                    height: 25
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 10
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: '#fff',
                    fontWeight: 'bold',
                    minWidth: 100
                  }}
                >
                  Harvest
                </Text>
              </View> */}
            </View>
          }
          rightComponent={
            <Icon
              name={'sign-out'}
              type={'font-awesome'}
              color="#fff"
              onPress={this.onPressLogoutButton}
            />
          }
          style={styles.header}
        />
        <View style={styles.menu_item}>
          <View style={styles.menu_icon_view}>
            <Image
              source={require('./../images/zoyo.png')}
              style={styles.menu_icon}
            />
          </View>
          <View style={styles.menu_button_view}>
            <Button
              title="グループ認証"
              style={styles.menu_button}
              onPress={this.onPressLoginGroupButton}
            />
          </View>
        </View>
        <View style={styles.menu_item}>
          <View style={styles.menu_icon_view}>
            <Image
              source={require('./../images/zoyo.png')}
              style={styles.menu_icon}
            />
          </View>
          <View style={styles.menu_button_view}>
            <Button
              title="チャット機能"
              style={styles.menu_button}
              onPress={this.onPressChatButton}
            />
          </View>
        </View>
        <View style={styles.menu_item}>
          <View style={styles.menu_icon_view}>
            <Image
              source={require('./../images/zoyo.png')}
              style={styles.menu_icon}
            />
          </View>
          <View style={styles.menu_button_view}>
            <Button
              title="チャット選択"
              style={styles.menu_button}
              onPress={this.onPressChatSelectButton}
            />
          </View>
        </View>
        <View style={styles.menu_item}>
          <View style={styles.menu_icon_view}>
            <Image
              source={require('./../images/zoyo.png')}
              style={styles.menu_icon}
            />
          </View>
          <View style={styles.menu_button_view}>
            <Button
              title="チャットメッセージ"
              style={styles.menu_button}
              onPress={this.onPressChatMsgButton}
            />
          </View>
        </View>
        <View style={styles.menu_item}>
          <View style={styles.menu_icon_view}>
            <Image
              source={require('./../images/zoyo.png')}
              style={styles.menu_icon}
            />
          </View>
          <View style={styles.menu_button_view}>
            <Button
              title="チャットコイン"
              style={styles.menu_button}
              onPress={this.onPressChatCoinButton}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF'
  },
  header: {},
  menu_item: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30
  },
  menu_icon: {
    width: 50,
    height: 50
  },
  menu_button: {},
  menu_icon_view: {},
  menu_button_view: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10
  }
})
