import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  AsyncStorage,
  Image,
  Modal
} from 'react-native'
import {
  Button,
  FormLabel,
  FormInput,
  Card,
  CheckBox
} from 'react-native-elements'

const restdomain = require('./common/constans.js').restdomain

export default class LoginGroupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      passwordInput: '',
      bc_account: '',
      image_file_nm: '',
      shimei: '',
      kengen_cd: '',
      msg: '',
      modalVisible: false,
      checked: false
    }
  }

  /** コンポーネントのマウント時処理 */
  async componentWillMount() {
    this.removeLoginInfo()
  }

  getGroupInfo = async () => {
    try {
      return JSON.parse(await AsyncStorage.getItem('groupInfo'))
    } catch (error) {
      return
    }
  }

  removeLoginInfo = async () => {
    try {
      await AsyncStorage.removeItem('loginInfo')
      //await AsyncStorage.removeItem('groupInfo')
    } catch (error) {
      return
    }
  }

  setGroupInfo = async groupInfo => {
    try {
      await AsyncStorage.setItem('groupInfo', groupInfo)
    } catch (error) {
      //alert(error)
      return
    }
  }

  onPressButton = async () => {
    var groupInfo = await this.getGroupInfo()
    if (groupInfo != null && groupInfo['saveFlg']) {
      this.props.navigation.navigate('Login')
    } else {
      this.openModal()
    }
  }

  openModal() {
    this.setState({ modalVisible: true })
  }

  closeModal() {
    this.setState({ id: '' })
    this.setState({ msg: '' })
    this.setState({ checked: false })
    this.setState({ modalVisible: false })
  }

  handleSubmit = () => {
    fetch(restdomain + '/login_group/find', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(function(response) {
        return response.json()
      })
      .then(
        function(json) {
          if (json.status) {
            // 結果が取得できない場合は終了
            if (typeof json.data === 'undefined') {
              return
            }
            var resList = json.data[0]
            let groupInfo = {
              saveFlg: this.state.checked,
              group_id: resList.group_id,
              db_name: resList.db_name,
              bc_addr: resList.bc_addr
            }
            this.setGroupInfo(JSON.stringify(groupInfo))
            this.closeModal()
            this.props.navigation.navigate('Login')
          } else {
            this.setState({
              msg: 'グループIDを確認してください'
            })
            return
          }
        }.bind(this)
      )
      .catch(error => console.error(error))
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./../images/title.jpg')}
          style={styles.backgroud_image}
        >
          <View
            style={{
              height: 30,
              minWidth: 150,
              marginTop: 150,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View>
              <Image
                style={{
                  height: 40,
                  width: 250
                }}
                source={require('./../images/HARVEST.png')}
              />
            </View>
          </View>

          <View
            style={{
              flex: 2,
              flexDirection: 'column'
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              title="Start"
              onPress={this.onPressButton}
              icon={{ name: 'sign-in', type: 'font-awesome' }}
              loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
              titleStyle={{ fontWeight: '700' }}
              buttonStyle={{
                backgroundColor: 'rgba(92, 99,216, 1)',
                width: 300,
                height: 45,
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 5
              }}
              containerStyle={{ marginTop: 20 }}
            />
            <Text style={{ color: '#FFFFFF', textAlign: 'center' }} />
            <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
              Copyright © Creative Consultant Co., Ltd
            </Text>
          </View>

          <Modal
            visible={this.state.modalVisible}
            animationType={'slide'}
            onRequestClose={() => this.closeModal()}
            //transparent={true}
          >
            <View style={styles.modal_style}>
              <View style={{ flex: 1 }} />
              <Card title="グループIDを入力してください" style={{ flex: 1 }}>
                <FormInput
                  onChangeText={text => this.setState({ id: text })}
                  value={this.state.id}
                />
                <CheckBox
                  title="グループIDを保持する"
                  checked={this.state.checked}
                  onPress={() =>
                    this.setState({ checked: !this.state.checked })
                  }
                />

                <Text style={{ color: 'red' }}>{this.state.msg}</Text>
              </Card>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Button
                    buttonStyle={{
                      borderRadius: 5
                    }}
                    onPress={() => this.closeModal()}
                    title="Back"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    buttonStyle={{
                      borderRadius: 5
                    }}
                    onPress={() => this.handleSubmit()}
                    title="Next"
                  />
                </View>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </Modal>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  backgroud_image: {
    width: '100%',
    height: '100%'
  },
  modal_style: {
    flex: 1
  }
})
