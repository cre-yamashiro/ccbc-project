/**
 * ブロックチェーンAPI
 */
var express = require("express");
var router = express.Router();
var Web3 = require("web3");
var web3 = new Web3();

// 118.27.23.20
const bcUrl = "http://118.27.23.20:8599";
let baseContractAddress = "0x18bed24fb648563d206f855858d864e96a88db54"; // ベース
let contractAddress = "0x18bed24fb648563d206f855858d864e96a88db54"; // 本番
//let baseContractAddress = "0x695fe1f6e59c68468f70b115cfe4694e36d0a838"; // ベース
//let contractAddress = "0x695fe1f6e59c68468f70b115cfe4694e36d0a838"; // 本番
// let contractAddress = "0x85099cb9d604ec5726b85bde11bde32a9ee171d0"; // demo
// let contractAddress = "0xf8be729ec16c4ad729b10202e408263d2b286f07"; // テスト

// 118.27.0.221
// const bcUrl = "http://118.27.0.221:8599";
// let baseContractAddress = "0x64ea718eb4649d3ce2f7705157be446361157c25"; // ベース
// let contractAddress = "0x64ea718eb4649d3ce2f7705157be446361157c25"; // 118.27.0.221:8599 harvest
// let contractAddress = "0x4fabb4f8351e5fee06dd00864a6cd3798274886d"; // 118.27.0.221:8599 test

// 118.27.0.221　→　118.27.23.20
// const bcUrl = "http://118.27.23.20:8599";
// let baseContractAddress = "0x85099cb9d604ec5726b85bde11bde32a9ee171d0"; // ベース
// let contractAddress = "0x64ea718eb4649d3ce2f7705157be446361157c25"; // 本番
// let contractAddress = "0x85099cb9d604ec5726b85bde11bde32a9ee171d0"; // demo

var request = require("superagent");

/**
 * ------------------------------------------------------------
 * ユーザ登録（BCへのアカウント登録）
 * ------------------------------------------------------------
 * Param  : [ password ]   - パスワード
 * Return : [ bc_account ] - アカウント
 *          [ result ]     - 結果(true/false)
 *          [ message ]    - エラーメッセージ(エラー時のみ)
 * ------------------------------------------------------------
 */
router.post("/add_account", function(req, res, err) {
  var methodNm = "## add_account";
  // console.log(methodNm + ":param:" + JSON.stringify(req.body));

  var password = req.body.password;

  try {
    web3.setProvider(new web3.providers.HttpProvider(bcUrl));

    // アカウント作成
    var result = web3.personal.newAccount(password);
    res.json({ bc_account: result, result: true });
    console.log(methodNm + ":success" + result);
  } catch (e) {
    console.log(methodNm + ":err:" + e);
    err = e;
    res.json({ result: false, message: String(e) });
  }
});

/**
 * ------------------------------------------------------------
 * ログイン（BCへの認証）
 * ------------------------------------------------------------
 * Param  : [ account ]  - アカウント
 *          [ password ] - パスワード
 * Return : [ result ]   - 結果(true/false)
 *          [ message ]  - エラーメッセージ(エラー時のみ)
 * ------------------------------------------------------------
 */
router.post("/login", function(req, res, err) {
  var methodNm = "## login";
  // console.log(methodNm + ":param:" + JSON.stringify(req.body));

  var account = req.body.account;
  var password = req.body.password;

  try {
    web3.setProvider(new web3.providers.HttpProvider(bcUrl));

    // 認証
    var result = web3.personal.unlockAccount(account, password);
    res.json({ result: result });
    console.log(methodNm + ":success:");
  } catch (e) {
    console.log(methodNm + ":err:" + e);
    // アカウントなしとパスワード違いのエラーについては、業務エラーとして結果をfalseで返却
    var okEerrors = [
      "Error: invalid address",
      "Error: could not decrypt key with given passphrase"
    ];
    if (okEerrors.indexOf(String(e)) != -1) {
      res.json({ result: false });
    } else {
      err = e;
      res.json({ result: false, message: String(e) });
    }
  }
});

/**
 * ------------------------------------------------------------
 * コイン送金
 * ------------------------------------------------------------
 * Param  : [ from_account[] ] - 送金元アカウント(配列)
 *          [ password[] ]     - 送金元パスワード(配列)
 *          [ to_account[] ]   - 送金先アカウント(配列)
 *          [ coin[] ]         - 送金コイン数(配列)
 * Return : [ transaction[] ]  - トランザクションID(配列)
 *          [ result ]         - 結果(true/false)
 *          [ message ]        - エラーメッセージ(エラー時のみ)
 * ------------------------------------------------------------
 */
router.post("/send_coin", function(req, res, err) {
  var methodNm = "## send_coin";
  // console.log(methodNm + ":param:" + JSON.stringify(req.body));

  var fromAccount = req.body.from_account[0];
  var password = req.body.password[0];
  var toAccounts = req.body.to_account;
  var coins = req.body.coin;
  var resTransactions = new Array(toAccounts.length);

  if (req.body.bc_addr != null && req.body.bc_addr != "") {
    contractAddress = req.body.bc_addr;
  } else {
    contractAddress = baseContractAddress;
  }

  try {
    web3.setProvider(new web3.providers.HttpProvider(bcUrl));

    // 認証
    web3.personal.unlockAccount(fromAccount, password);
    console.log(methodNm + ":success:unlockAccount");

    // 送金
    web3.eth.defaultAccount = fromAccount;
    var abi = getAbi();
    var i = 0;
    while (i < toAccounts.length) {
      // 対象者分繰返し
      var resTransId = web3.eth
        .contract(abi)
        .at(contractAddress)
        .transfer.sendTransaction(toAccounts[i], coins[i]);
      ////etherの場合
      //var resTransId = web3.eth.sendTransaction({from: fromAccount, to: toAccounts[i], value: web3.toWei(coins[i], "ether")})
      resTransactions[i] = resTransId;
      i++;
    }
    res.json({ transaction: resTransactions, result: true });
  } catch (e) {
    console.log(methodNm + ":err:" + e);
    err = e;
    res.json({
      transaction: resTransactions,
      result: false,
      message: String(e)
    });
  }
});

/**
 * ------------------------------------------------------------
 * コイン照会（現在のコイン）
 * ------------------------------------------------------------
 * Param  : [ account ] - アカウント
 * Return : [ coin ]    - コイン数
 *          [ result ]  - 結果(true/false)
 *          [ message ] - エラーメッセージ(エラー時のみ)
 * ------------------------------------------------------------
 */
router.post("/get_coin", function(req, res, err) {
  var methodNm = "## get_coin";
  console.log(methodNm + ":param:" + JSON.stringify(req.body));

  var account = req.body.account;

  if (req.body.bc_addr != null && req.body.bc_addr != "") {
    contractAddress = req.body.bc_addr;
  } else {
    contractAddress = baseContractAddress;
  }

  try {
    web3.setProvider(new web3.providers.HttpProvider(bcUrl));

    // 照会
    var abi = getAbi();
    var resCoin = web3.eth
      .contract(abi)
      .at(contractAddress)
      .balanceOf(account);
    res.json({ coin: resCoin, result: true });
  } catch (e) {
    console.log(methodNm + ":err:" + e);
    err = e;
    res.json({ coin: 0, result: false, message: String(e) });
  }
});

/**
 * ------------------------------------------------------------
 * コイン照会（年度単位のコイン）
 * ------------------------------------------------------------
 * Param  : [ account ] - アカウント
 *          [ year ]    - 年度
 * Return : [ coin ]    - コイン数
 *          [ result ]  - 結果(true/false)
 *          [ message ] - エラーメッセージ(エラー時のみ)
 * ------------------------------------------------------------
 */
router.post("/get_coin_year", function(req, res, err) {
  var methodNm = "## get_coin_year";
  console.log(methodNm + ":param:" + JSON.stringify(req.body));

  var account = req.body.account;
  var year = req.body.year;
  var amount = 0;

  // 年度開始(パラメータの年の04/01 00:00:00)
  var stDate = new Date(year, 3, 1, 0, 0, 0);
  var stTimestamp = stDate.getTime() / 1000;
  // 年度終了(パラメータの年+1の03/31 23:59:59)
  var edDate = new Date(year + 1, 2, 31, 23, 59, 59);
  var edTimestamp = edDate.getTime() / 1000;

  if (req.body.bc_addr != null && req.body.bc_addr != "") {
    contractAddress = req.body.bc_addr;
  } else {
    contractAddress = baseContractAddress;
  }

  try {
    web3.setProvider(new web3.providers.HttpProvider(bcUrl));

    //------------------------------------------------------------------
    // テスト処理
    /*
    var options = {
      fromBlock: 0,
      toBlock: "latest",
      address: [contractAddress],
      topics: []
    };
    var filter = web3.eth.filter(options);
    
    filter.watch(function(error, result){
      if (!error) {
        console.log(result)
        return
      } else {
        console.log(error)
        res.json({ coin: 0, result: false, message: String(error) })
        return
      }
    })
    return
    */
    //------------------------------------------------------------------

    // 全ブロックを降順で検索
    var maxNo = web3.eth.blockNumber;
    console.log("# maxNo:" + maxNo);

    for (var i = 0; i < maxNo + 1; i++) {
      var block = web3.eth.getBlock(i);
      console.log(
        "## blockNumber:" + i + " block.timestamp:" + block.timestamp
      );

      // timestampが年度の範囲内であれば
      if (block.timestamp >= stTimestamp && block.timestamp <= edTimestamp) {
        console.log(
          "### block.transactions.length:" + block.transactions.length
        );

        for (var j = 0; j < block.transactions.length; j++) {
          var trans = web3.eth.getTransaction(block.transactions[j]);

          // コントラクトのアドレス（送金処理）であれば
          if (trans.to == contractAddress) {
            var input = trans.input;
            var fromAccount = trans.from;

            // inputの内容より送金先と送金数を取得
            // inputの構成：10byte=MethodID, 64byte=[0]送金先(内最終40byteを切り出す), 64byte=[1]送金数(16進数)
            var toAccount = "0x" + input.substr(10 + 24, 40);
            var coin = parseInt(input.substr(10 + 64, 64), 16);

            // コインの増減を集計
            if (account == fromAccount) {
              amount -= coin;
            } else if (account == toAccount) {
              amount += coin;
            }
            console.log("### frAccount:" + fromAccount);
            console.log("### toAccount:" + toAccount);
            console.log("### coin:" + coin);
          }
        }
      }
      console.log("## amount:" + amount);
      console.log("##");
    }
    res.json({ coin: amount, result: true });
  } catch (e) {
    console.log(methodNm + ":err:" + e);
    err = e;
    res.json({ coin: 0, result: false, message: String(e) });
  }
});

/**
 * ------------------------------------------------------------
 * 取引照会
 * ------------------------------------------------------------
 * Param  : [ transaction ] - トランザクションID
 * Return : [ sender ]      - 送金元アカウント
 *          [ receiver ]    - 送金先アカウント
 *          [ coin ]        - 送金コイン数
 *          [ result ]      - 結果(true/false)
 *          [ message ]     - エラーメッセージ(エラー時のみ)
 * ------------------------------------------------------------
 */
router.post("/get_transaction", function(req, res, err) {
  var methodNm = "## get_transaction";
  console.log(methodNm + ":param:" + JSON.stringify(req.body));

  var transaction = req.body.transaction;

  try {
    web3.setProvider(new web3.providers.HttpProvider(bcUrl));

    // 照会
    var trans = web3.eth.getTransaction(transaction);
    var input = trans.input;
    var fromAccount = trans.from;

    // inputの内容より送金先と送金数を取得
    // inputの構成：10byte=MethodID, 64byte=[0]送金先(内最終40byteを切り出す), 64byte=[1]送金数(16進数)
    var toAccount = "0x" + input.substr(10 + 24, 40);
    var coin = parseInt(input.substr(10 + 64, 64), 16);

    console.log("### input:" + input);
    console.log("### frAccount:" + fromAccount);
    console.log("### toAccount:" + toAccount);
    console.log("### coin:" + coin);

    res.json({
      sender: fromAccount,
      receiver: toAccount,
      coin: coin,
      result: true
    });
  } catch (e) {
    console.log(methodNm + ":err:" + e);
    err = e;
    res.json({
      sender: null,
      receiver: null,
      coin: 0,
      result: false,
      message: String(e)
    });
  }
});

/**
 * ------------------------------------------------------------
 * 取引照会（複数）
 * ------------------------------------------------------------
 * Param  : [ transaction[] ] - トランザクションID(配列)
 * Return : [ trans[] ]       - トランザクション(配列)
 *            -> [ sender ]      -> 送金元アカウント
 *            -> [ receiver ]    -> 送金先アカウント
 *            -> [ coin ]        -> 送金コイン数
 *          [ result ]      - 結果(true/false)
 *          [ message ]     - エラーメッセージ(エラー時のみ)
 * ------------------------------------------------------------
 */
router.post("/get_transactions", function(req, res, err) {
  var methodNm = "## get_transactions";
  console.log(methodNm + ":param:" + JSON.stringify(req.body));

  var transaction = req.body.transaction;
  var resTrans = new Array(transaction.length);

  try {
    // [web3.eth.getTransaction]では複数回の通信が必要であるため性能が出ない
    // [JSON RPC API]を利用し、１回の通信でデータを取得する
    var i = 0;
    var param = new Array(transaction.length);
    while (i < transaction.length) {
      param[i] = {
        jsonrpc: "2.0",
        id: i,
        method: "eth_getTransactionByHash",
        params: [transaction[i]]
      };
      i++;
    }

    // 照会
    var bcRes;
    request
      .post(bcUrl)
      .send(param)
      .end(function(bcerr, bcres) {
        if (bcerr) {
          console.log("** err:" + bcerr);
          return;
        }
        i = 0;
        while (i < bcres.body.length) {
          bcRes = bcres.body[i];
          console.log("### id:" + bcRes.id);
          var index = bcRes.id;
          var trans = bcRes.result;
          var input = trans.input;
          var fromAccount = trans.from;

          // inputの内容より送金先と送金数を取得
          // inputの構成：10byte=MethodID, 64byte=[0]送金先(内最終40byteを切り出す), 64byte=[1]送金数(16進数)
          var toAccount = "0x" + input.substr(10 + 24, 40);
          var coin = parseInt(input.substr(10 + 64, 64), 16);

          console.log("### input:" + input);
          console.log("### frAccount:" + fromAccount);
          console.log("### toAccount:" + toAccount);
          console.log("### coin:" + coin);

          resTrans[index] = {
            sender: fromAccount,
            receiver: toAccount,
            coin: coin
          };
          i++;
        }

        res.json({ trans: resTrans, result: true });
      });
  } catch (e) {
    console.log(methodNm + ":err:" + e);
    err = e;
    res.json({ trans: null, result: false, message: String(e) });
  }
});

/**
 * ABI取得（コントラクトにアクセスするために必要な情報）
 */
function getAbi() {
  var abi = JSON.parse(
    '[{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "balanceOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"name": "transfer","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_to","type": "address"},{"name": "_value","type": "uint256"},{"name": "_prm1","type": "uint256"},{"name": "_prm2","type": "uint256"},{"name": "_prm3","type": "uint256"}],"name": "transfer_custom","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"inputs": [{"name": "initialSupply","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"}]'
  );
  return abi;
}

module.exports = router;

/*
var abi = [
  {
  "constant": true,
  "inputs": [{ "name": "", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "name": "", "type": "uint256" }],
  "payable": false,
  "type": "function"
  }, {
  "constant": false,
  "inputs": [{ "name": "_to", "type": "address" },
             { "name": "_value", "type": "uint256" }],
  "name": "transfer",
  "outputs": [],
  "payable": false,
  "type": "function"
  }, {
  "inputs": [],
  "payable": false,
  "type": "constructor"
  }]
*/
