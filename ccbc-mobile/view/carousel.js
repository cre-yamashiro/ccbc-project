import React, { Component } from 'react'
import ReactNative, {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  AsyncStorage,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Keyboard
} from 'react-native'
import styled from 'styled-components/native' // Version can be specified in package.json
import Carousel, { Pagination } from 'react-native-snap-carousel' // Version can be specified in package.json
import {
  Header,
  Button,
  Icon,
  Avatar,
  FormInput,
  Card,
  Divider
} from 'react-native-elements'
import { Rating, AirbnbRating } from 'react-native-ratings'
import KeyboardAwareScrollView from 'react-native-keyboard-aware-view'
import StarRating from 'react-native-star-rating'
import InputScrollView from 'react-native-input-scroll-view'
import TextInput from './common/TextInput'

const restdomain = require('./common/constans.js').restdomain

export default class ThumbnailCarousel extends Component {
  constructor(props) {
    super()
    this.state = {
      errors: [],
      starCount1: 1,
      starCount2: 1,
      starCount3: 1,
      starCount4: 1,
      starCount5: 1,
      modalVisible: false,
      modalVisible2: false,
      value: '',
      text: '',
      height: 0,
      resultList: [],
      tohyoCoin: 0,
      activeStep1: {},
      activeStep2: {},
      activeStep3: {},
      activeStep4: {},
      activeStep5: {},
      comment: {}
    }
    this.props = props
    this._carousel = {}
  }

  async componentWillMount() {
    var loginInfo = await this.getLoginInfo()

    this.setState({ userid: loginInfo['userid'] })
    this.setState({ password: loginInfo['password'] })
    this.setState({ tShainPk: loginInfo['tShainPk'] })
    this.state.tShainPk = Number(loginInfo['tShainPk'])
    this.setState({ imageFileName: loginInfo['imageFileName'] })
    this.setState({ shimei: loginInfo['shimei'] })
    this.setState({ kengenCd: loginInfo['kengenCd'] })

    this.setState({ starCount1: 1 })
    this.setState({ starCount2: 1 })
    this.setState({ starCount3: 1 })
    this.setState({ starCount4: 1 })
    this.setState({ starCount5: 1 })
    this.setState({ modalVisible: false })
    this.setState({ modalVisible2: false })
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this._handleKeyboardWillShow.bind(this)
    )

    // 初期表示情報取得
    var resList = this.findTohyoToroku()
  }

  getLoginInfo = async () => {
    try {
      return JSON.parse(await AsyncStorage.getItem('loginInfo'))
    } catch (error) {
      return
    }
  }

  findTohyoToroku = async () => {
    await fetch(restdomain + '/tohyo_toroku/find', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(function(response) {
        return response.json()
      })
      .then(
        function(json) {
          // 結果が取得できない場合は終了
          if (typeof json.data === 'undefined') {
            return
          }
          var dataList = json.data
          for (var i in dataList) {
            var data = dataList[i]
            data.starCount1 = 5
            data.starCount2 = 5
            data.starCount3 = 5
            data.starCount4 = 1
            data.starCount5 = 1
            data.comment = ''
          }
          this.setState({ resultList: dataList })
          this.calculateCoin()
        }.bind(this)
      )
      .catch(error => console.error(error))
  }

  handleSubmit = async () => {
    for (var i in this.state.resultList) {
      var res = this.state.resultList[i]
      this.state.activeStep1[i] = res.starCount1
      this.state.activeStep2[i] = res.starCount2
      this.state.activeStep3[i] = res.starCount3
      this.state.activeStep4[i] = res.starCount4
      this.state.activeStep5[i] = res.starCount5
      this.state.comment[i] = res.comment
    }
    await fetch(restdomain + '/tohyo_toroku/create', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(
        function(response) {
          this.closeModal()
          this.props.navigation.navigate('Menu')
        }.bind(this)
      )
      .catch(error => console.error(error))
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove()
  }

  onStarRatingPress1(rating, index) {
    const starCount1_copy = this.state.resultList.slice()
    starCount1_copy[index].starCount1 = rating
    this.setState({ resultList: starCount1_copy })
    this.calculateCoin()
  }
  onStarRatingPress2(rating, index) {
    const starCount2_copy = this.state.resultList.slice()
    starCount2_copy[index].starCount2 = rating
    this.setState({ resultList: starCount2_copy })
    this.calculateCoin()
  }
  onStarRatingPress3(rating, index) {
    const starCount3_copy = this.state.resultList.slice()
    starCount3_copy[index].starCount3 = rating
    this.setState({ resultList: starCount3_copy })
    this.calculateCoin()
  }
  onStarRatingPress4(rating, index) {
    const starCount4_copy = this.state.resultList.slice()
    starCount4_copy[index].starCount4 = rating
    this.setState({ resultList: starCount4_copy })
    this.calculateCoin()
  }
  onStarRatingPress5(rating, index) {
    const starCount5_copy = this.state.resultList.slice()
    starCount5_copy[index].starCount5 = rating
    this.setState({ resultList: starCount5_copy })
    this.calculateCoin()
  }

  calculatePointLine = index => {
    var sum = 0
    sum += this.state.resultList[index].starCount1
    sum += this.state.resultList[index].starCount2
    sum += this.state.resultList[index].starCount3
    sum += this.state.resultList[index].starCount4
    sum += this.state.resultList[index].starCount5
    return sum
  }

  calculateCoinLine = index => {
    var sum = 0
    sum += this.state.resultList[index].starCount1
    sum += this.state.resultList[index].starCount2
    sum += this.state.resultList[index].starCount3
    sum += this.state.resultList[index].starCount4
    sum += this.state.resultList[index].starCount5
    return sum * this.state.resultList[index].config_coin
  }

  calculateCoin = () => {
    var sum = 0
    for (var i in this.state.resultList) {
      sum += this.state.resultList[i].starCount1
      sum += this.state.resultList[i].starCount2
      sum += this.state.resultList[i].starCount3
      sum += this.state.resultList[i].starCount4
      sum += this.state.resultList[i].starCount5
    }
    this.setState({ tohyoCoin: sum })
    this.state.tohyoCoin = sum
  }

  getCalculateCoin = () => {
    var sum = 0
    for (var i in this.state.resultList) {
      sum += this.state.resultList[i].starCount1
      sum += this.state.resultList[i].starCount2
      sum += this.state.resultList[i].starCount3
      sum += this.state.resultList[i].starCount4
      sum += this.state.resultList[i].starCount5
    }
    return sum * this.state.resultList[0].config_coin
  }

  _renderItem = ({ index }) => {
    return (
      <Card style={{ flex: 1, height: 400 + Math.max(35, this.state.height) }}>
        <View style={styles.targe_item}>
          <View style={styles.target_avatar_view}>
            <Avatar
              large
              rounded
              source={{
                uri:
                  restdomain +
                  `/uploads/${this.state.resultList[index].image_file_nm}`
              }}
              //source={require('./../images/person11.png')}
              activeOpacity={0.7}
            />
          </View>
          <View style={styles.target_name_view}>
            <Text style={{ fontSize: 20 }}>
              {this.state.resultList[index].shimei}
            </Text>
          </View>
        </View>
        <View style={styles.target_title_view}>
          <Text style={{ fontSize: 18 }}>
            {this.state.resultList[index].title}
          </Text>
        </View>
        <View style={styles.target_coin_view}>
          <Text style={{ fontSize: 14 }}>
            {this.calculatePointLine(index)}
            点、
            {this.calculateCoinLine(index)}
            coin
          </Text>
        </View>
        <View style={styles.target_coin_view}>
          <Icon name="live-help" onPress={() => this.openModal2()} />
          <Modal
            visible={this.state.modalVisible2}
            animationType={'slide'}
            onRequestClose={() => this.closeModal2()}
            //transparent={true}
          >
            <View style={styles.modal_style}>
              <ScrollView>
                <Card title="評価ヘルプ" style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18 }}>資料作成</Text>
                  <Text style={{ fontSize: 12 }}>
                    　①資料全体を通して統一感があった。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　②「見やすい」「分かりやすい」「理解しやすい」資料になっていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　③話の流れを表現した構成で資料が作られていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>　④量・質が適当だった。</Text>
                  <Text style={{ fontSize: 12 }}>
                    　⑤定量的・定性的な観点を意識した資料になっていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>　等</Text>
                  <Text style={{ fontSize: 18 }} />
                  <Text style={{ fontSize: 18 }}>発表力</Text>
                  <Text style={{ fontSize: 12 }}>
                    　①人前に立っても、臆せずに、落ち着いて発表していた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　②質問などの突発事態が発生しても、臨機応変な対応が行えていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　③理解しやすい、聞きやすい内容だった（メリハリがあって、間の取り方が適切。発表の構成（導入・本論・終幕　等）が分かりやすい等）。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　④適切な時間で効率よく言いたい事が伝わるわかりやすい説明ができていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>　等</Text>
                  <Text style={{ fontSize: 18 }} />
                  <Text style={{ fontSize: 18 }}>表現力</Text>
                  <Text style={{ fontSize: 12 }}>
                    　①専門用語を使いすぎず、わかりやすい表現をしていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　②表情に配慮していた。（ノンバーバルスキル）
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　③声の大きさ、質、イントネーションに配慮していた。（ノンバーバルスキル）
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　④ジェスチャー等を交えた動作による状況説明を配慮していた。（ノンバーバルスキル）
                  </Text>
                  <Text style={{ fontSize: 12 }}>　等</Text>
                  <Text style={{ fontSize: 18 }} />
                  <Text style={{ fontSize: 18 }}>影響力</Text>
                  <Text style={{ fontSize: 12 }}>
                    　①発表を聞いた後、行動したいと感じた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　②発表を聞いた後、インスピレーションを得た。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　③資料の構成、表現を手本にしたい、真似したいと感じた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>　等</Text>
                  <Text style={{ fontSize: 18 }} />
                  <Text style={{ fontSize: 18 }}>限界突破</Text>
                  <Text style={{ fontSize: 12 }}>
                    　①過去の自分自身を一歩でも半歩でも超えていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　②前例のないことにチャレンジしていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    　③苦手を克服する、得意なことを更に伸ばす取り組みをしていた。
                  </Text>
                  <Text style={{ fontSize: 12 }}>　等</Text>
                </Card>
                <View style={{ flex: 1 }}>
                  <Button onPress={() => this.closeModal2()} title="CLOSE" />
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
        <View style={styles.rating_item}>
          <View style={styles.rating_title_view}>
            <Text style={{ fontSize: 12 }}>資料作成：</Text>
          </View>
          <View style={styles.rating_point_view}>
            <Text style={{ fontSize: 14 }}>
              {this.state.resultList[index].starCount1}点
            </Text>
          </View>
          <View style={styles.airbngrating_value_view}>
            <StarRating
              disabled={false}
              maxStars={10}
              rating={this.state.resultList[index].starCount1}
              selectedStar={rating => this.onStarRatingPress1(rating, index)}
              starSize={25}
              emptyStarColor={'orange'}
              fullStarColor={'orange'}
            />
          </View>
        </View>
        <View style={styles.rating_item}>
          <View style={styles.rating_title_view}>
            <Text style={{ fontSize: 12 }}>発表力　：</Text>
          </View>
          <View style={styles.rating_point_view}>
            <Text style={{ fontSize: 14 }}>
              {this.state.resultList[index].starCount2}点
            </Text>
          </View>
          <View style={styles.airbngrating_value_view}>
            <StarRating
              disabled={false}
              maxStars={10}
              rating={this.state.resultList[index].starCount2}
              selectedStar={rating => this.onStarRatingPress2(rating, index)}
              starSize={25}
              emptyStarColor={'orange'}
              fullStarColor={'orange'}
            />
          </View>
        </View>
        <View style={styles.rating_item}>
          <View style={styles.rating_title_view}>
            <Text style={{ fontSize: 12 }}>表現力　：</Text>
          </View>
          <View style={styles.rating_point_view}>
            <Text style={{ fontSize: 14 }}>
              {this.state.resultList[index].starCount3}点
            </Text>
          </View>
          <View style={styles.airbngrating_value_view}>
            <StarRating
              disabled={false}
              maxStars={10}
              rating={this.state.resultList[index].starCount3}
              selectedStar={rating => this.onStarRatingPress3(rating, index)}
              starSize={25}
              emptyStarColor={'orange'}
              fullStarColor={'orange'}
            />
          </View>
        </View>
        <View style={styles.rating_item}>
          <View style={styles.rating_title_view}>
            <Text style={{ fontSize: 12 }}>影響力　：</Text>
          </View>
          <View style={styles.rating_point_view}>
            <Text style={{ fontSize: 14 }}>
              {this.state.resultList[index].starCount4}点
            </Text>
          </View>
          <View style={styles.airbngrating_value_view}>
            <StarRating
              disabled={false}
              maxStars={10}
              rating={this.state.resultList[index].starCount4}
              selectedStar={rating => this.onStarRatingPress4(rating, index)}
              starSize={25}
              emptyStarColor={'orange'}
              fullStarColor={'orange'}
            />
          </View>
        </View>
        <View style={styles.rating_item}>
          <View style={styles.rating_title_view}>
            <Text style={{ fontSize: 12 }}>限界突破：</Text>
          </View>
          <View style={styles.rating_point_view}>
            <Text style={{ fontSize: 14 }}>
              {this.state.resultList[index].starCount5}点
            </Text>
          </View>
          <View style={styles.airbngrating_value_view}>
            <StarRating
              disabled={false}
              maxStars={10}
              rating={this.state.resultList[index].starCount5}
              selectedStar={rating => this.onStarRatingPress5(rating, index)}
              starSize={25}
              emptyStarColor={'orange'}
              fullStarColor={'orange'}
            />
          </View>
        </View>
        <Text style={{ fontSize: 12 }}>【コメント】</Text>
        <TextInput
          {...this.props}
          multiline={true}
          onChangeText={text => {
            this.state.resultList[index].comment = text
          }}
          onContentSizeChange={event => {
            this.setState({ height: event.nativeEvent.contentSize.height })
          }}
          style={[styles.default, { height: Math.max(35, this.state.height) }]}
          value={this.state.resultList[index].comment}
          ref={component => (this._textinput = component)}
        />
      </Card>
    )
  }

  handleChange = (name, cnt) => event => {
    this.state.resultList[cnt].comment = event.target.value
  }

  onPressLogoutButton = () => {
    this.props.navigation.navigate('Login')
  }
  onPressMenuButton = () => {
    this.props.navigation.navigate('Menu')
  }

  get pagination() {
    const { entries, activeSlide } = this.state
    return (
      <Pagination
        dotsLength={this.state.resultList.length}
        activeDotIndex={activeSlide}
        //containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  openModal() {
    this.setState({ modalVisible: true })
  }

  closeModal() {
    this.setState({ modalVisible: false })
  }

  openModal2() {
    this.setState({ modalVisible2: true })
  }

  closeModal2() {
    this.setState({ modalVisible2: false })
  }

  render = () => {
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={
            <Icon
              name={'home'}
              type={'font-awesome'}
              color="#fff"
              onPress={this.onPressMenuButton}
            />
          }
          centerComponent={{
            text: 'MVP Vote System',
            style: { color: '#fff' }
          }}
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

        <KeyboardAvoidingView behavior="padding">
          <ScrollView ref={component => (this._scrollview = component)}>
            {(() => {
              if (
                this.state.resultList != null &&
                this.state.resultList.length != 0
              ) {
                return (
                  <View>
                    <Card style={{ flex: 1 }}>
                      <View style={styles.target_total_coin_view}>
                        <Text style={{ fontSize: 18 }}>
                          {this.state.resultList[0].senkyo_nm}
                        </Text>
                        <Text style={{ fontSize: 12 }}>
                          発表者に対して評価とコメントをつけて下さい。
                          {'\n'}
                          （配布しきれなかったコインは自動で回収されます）
                        </Text>
                        <Text style={{ fontSize: 13 }}>
                          配布コイン数:
                          {this.state.resultList[0].config_coin *
                            50 *
                            this.state.resultList.length}
                        </Text>
                        <Text style={{ fontSize: 13 }}>
                          1点辺りのコイン数:
                          {this.state.resultList[0].config_coin}
                        </Text>
                        <Text style={{ fontSize: 13 }}>
                          投票コイン数:
                          {this.getCalculateCoin()}
                        </Text>
                      </View>
                    </Card>
                    <Text />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                      }}
                    >
                      <Divider style={{ flex: 1, backgroundColor: 'white' }} />
                      <Text
                        style={{ flex: 1, fontSize: 13, textAlign: 'center' }}
                      >
                        Presenter
                      </Text>
                      <Divider style={{ flex: 1, backgroundColor: 'white' }} />
                    </View>
                    <CarouselBackgroundView
                      style={{ height: 400 + Math.max(35, this.state.height) }}
                    >
                      <Carousel
                        ref={c => {
                          this._carousel = c
                        }}
                        data={this.state.resultList}
                        renderItem={index => this._renderItem(index)}
                        // onSnapToItem={this.handleSnapToItem.bind(this)}
                        onSnapToItem={index =>
                          this.setState({ activeSlide: index })
                        }
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={Dimensions.get('window').width}
                        layout={'default'}
                        containerCustomStyle={{ flex: 1 }}
                        slideStyle={{ flex: 1 }}
                        firstItem={0}
                      />
                      <View>{this.pagination}</View>
                    </CarouselBackgroundView>
                    <Button
                      title="save"
                      icon={{ name: 'sign-in', type: 'font-awesome' }}
                      onPress={() => this.openModal()}
                    />
                    <Modal
                      visible={this.state.modalVisible}
                      animationType={'slide'}
                      onRequestClose={() => this.closeModal()}
                      //transparent={true}
                    >
                      <View style={styles.modal_style}>
                        <View style={{ flex: 1 }} />
                        <Card title="確認ダイアログ" style={{ flex: 1 }}>
                          <Text style={{ fontSize: 18 }}>
                            入力情報を登録しますか？
                          </Text>
                        </Card>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <View style={{ flex: 1 }}>
                            <Button
                              onPress={() => this.handleSubmit()}
                              title="YES"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Button
                              onPress={() => this.closeModal()}
                              title="NO"
                            />
                          </View>
                        </View>
                        <View style={{ flex: 1 }} />
                      </View>
                    </Modal>
                    <View style={{ height: 80 }} />
                  </View>
                )
              } else {
                return (
                  <Card style={{ flex: 1 }}>
                    <View style={styles.target_total_coin_view}>
                      <Text style={{ fontSize: 18 }}>
                        有効な選挙がありません。
                      </Text>
                    </View>
                  </Card>
                )
              }
            })()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }

  _handleKeyboardWillShow() {
    const responder = this._scrollview.getScrollResponder()
    responder.scrollResponderScrollNativeHandleToKeyboard(
      ReactNative.findNodeHandle(this._textinput),
      100,
      true
    )
  }
}

const CarouselBackgroundView = styled.View`
  height: 200;
  width: 100%;
`
// const CarouselBackgroundView = styled.View`
//   background-color: black;
//   height: 200;
//   width: 100%;
// `

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF'
  },
  header: {},
  targe_item: {
    flexDirection: 'row',
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30
  },
  target_avatar_view: {},
  target_name_view: {
    flexDirection: 'column',
    marginLeft: 30,
    justifyContent: 'center'
  },
  target_title_view: {
    marginTop: 10,
    marginLeft: 0,
    marginBottom: 20
  },
  target_coin_view: {
    marginLeft: 0
  },
  target_total_coin_view: {
    marginLeft: 10
  },
  rating_item: {
    flexDirection: 'row'
  },
  rating_title_view: {
    justifyContent: 'center',
    marginLeft: 0
  },
  rating_point_view: {
    justifyContent: 'center',
    minWidth: 30
  },
  rating_value_view: {
    flexDirection: 'column',
    marginLeft: 10
  },
  airbngrating_value_view: {
    flexDirection: 'column',
    marginLeft: 10
  },
  modal_style: {
    flex: 1
  }
})
