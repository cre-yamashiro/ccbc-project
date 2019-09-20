const initialState = {
  tTohyoPk: 82,
  tZoyoPk: null,
  title: '札幌の未来について2',
  tohyosha: '苫小牧　太郎2',
  coin: 1002
}

export function coinShokaiReducer(state = initialState, action) {
  if (action.type === 'SETTOHYODATA') {
    return {
      tTohyoPk: action.tTohyoPk,
      tZoyoPk: action.tZoyoPk,
      title: action.title,
      tohyosha: action.tohyosha,
      coin: action.coin
    }
  } else if (action.type === 'SETZOYODATA') {
    console.log('SETZOYODATA')
    return {
      tTohyoPk: action.tTohyoPk,
      tZoyoPk: action.tZoyoPk,
      title: action.title,
      tohyosha: action.tohyosha,
      coin: action.coin
    }
  }
  return state
}
