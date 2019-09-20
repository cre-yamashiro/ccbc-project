import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage,
  Text,
  ScrollView
} from 'react-native'
import {
  Header,
  Button,
  Icon,
  Avatar,
  Card,
  ListItem,
  FormInput,
  Divider
} from 'react-native-elements'
import { Table } from 'react-native-table-component'

export default class ChatCoinForm extends Component {
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
    configCoin: 0,
    text: ''
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
  onPressHomeButton = () => {
    this.props.navigation.navigate('Home')
  }
  render() {
    const { name, email } = this.state
    const footerStyle = {
      ...StyleSheet.flatten(styles.footerOverlay),
      width: this.state.footerWidth
    }
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name={'chevron-left'}
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
                <Text
                  style={{
                    fontSize: 24,
                    color: '#FFFFFF',
                    textAlign: 'center'
                  }}
                >
                  佐藤　結菜
                </Text>
              </View>
            </View>
          }
          rightComponent={
            <Image
              source={require('./../images/coin_icon.png')}
              style={styles.menu_icon}
            />
          }
          backgroundColor="#ff5622"
        />
        <ScrollView>
          <View>
            <Text
              style={{
                fontSize: 20,
                color: 'gray',
                textAlign: 'center',
                marginTop: 20
              }}
            >
              2019/1/20
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap'
            }}
          >
            <Avatar
              size="small"
              rounded
              source={require('./../images/woman3.jpg')}
              //activeOpacity={0.7}
              containerStyle={{ marginLeft: 10, marginRight: 10 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'left'
              }}
            >
              佐藤　結菜
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'right',
                marginRight: 10
              }}
            >
              13:05
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              color: 'gray',
              textAlign: 'left',
              marginLeft: 54,
              marginTop: -5
            }}
          >
            今日はありがとうございました。
          </Text>

          <View>
            <Text
              style={{
                fontSize: 20,
                color: 'gray',
                textAlign: 'center',
                marginTop: 20
              }}
            >
              2019/1/22
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap'
            }}
          >
            <Avatar
              size="small"
              rounded
              source={require('./../images/woman3.jpg')}
              //activeOpacity={0.7}
              containerStyle={{ marginLeft: 10, marginRight: 10 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'left'
              }}
            >
              佐藤　結菜
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'right',
                marginRight: 10
              }}
            >
              19:55
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              color: 'blue',
              textAlign: 'left',
              marginLeft: 54,
              marginTop: -5
            }}
          >
            【300コインを送付しました】
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'blue',
              textAlign: 'left',
              marginLeft: 54,
              marginTop: 0
            }}
          >
            議事録を作成いただきありがとうございました。
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'blue',
              textAlign: 'left',
              marginLeft: 54,
              marginTop: 0
            }}
          >
            とても見やすく分かりやすかったです。
          </Text>

          <Text
            style={{
              fontSize: 20,
              color: 'blue',
              textAlign: 'left',
              marginLeft: 54
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap'
            }}
          >
            <Avatar
              size="small"
              rounded
              source={require('./../images/man1.jpg')}
              //activeOpacity={0.7}
              containerStyle={{ marginLeft: 10, marginRight: 10 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'left'
              }}
            >
              安倍　大翔
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'right',
                marginRight: 10
              }}
            >
              20:05
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              color: 'gray',
              textAlign: 'left',
              marginLeft: 54,
              marginTop: -5
            }}
          >
            ありがとう～。
          </Text>

          <Text
            style={{
              fontSize: 20,
              color: 'blue',
              textAlign: 'left',
              marginLeft: 54
            }}
          />
          <Divider style={{ backgroundColor: 'red' }} />
          <Text
            style={{
              fontSize: 20,
              color: 'gray',
              textAlign: 'center'
            }}
          >
            以下未読
          </Text>

          <View>
            <Text
              style={{
                fontSize: 20,
                color: 'gray',
                textAlign: 'center',
                marginTop: 20
              }}
            >
              2019/2/1
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap'
            }}
          >
            <Avatar
              size="small"
              rounded
              source={require('./../images/woman3.jpg')}
              //activeOpacity={0.7}
              containerStyle={{ marginLeft: 10, marginRight: 10 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'left'
              }}
            >
              佐藤　結菜
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: 'gray',
                textAlign: 'right',
                marginRight: 10
              }}
            >
              23:05
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              color: 'gray',
              textAlign: 'left',
              marginLeft: 54,
              marginTop: -5
            }}
          >
            お疲れ様です。
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'gray',
              textAlign: 'left',
              marginLeft: 54,
              marginTop: 0
            }}
          >
            明日の会議は何時からでしょうか？
          </Text>
        </ScrollView>
        <Divider style={{ backgroundColor: 'lightgray' }} />
        <View style={footerStyle}>
          <FormInput
            onChangeText={name => this.setState({ name })}
            value={name}
            placeholder="メッセージを入力"
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 25,
    height: 25
  },
  menu_button: {},
  menu_icon_view: {},
  menu_button_view: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10
  }
})
