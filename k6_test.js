'use strict;'

import http from 'k6/http';
import exec from 'k6/execution';
import { check, fail } from 'k6';
import { sleep } from 'k6';
import execution from 'k6/execution';

//const ACCESS_TOKEN = "l989sumy0evz9076d74h5uxn"; // test01
//const ACCESS_TOKEN = "l9peznle000829c772ear2x5"; // test11
const ACCESS_TOKEN = "l1ohlzt7000103f1c781ut8m"; // mc3
let header = {
  "Content-Type": "application/json",
  "Authorization": ACCESS_TOKEN,
};

export let options = {
  
  stages: [
    { target: 80, duration: '5s' },
    { target: 100, duration: '60s' },
  ],
  
//  vus: 100,
//  iterations: 10,
//  duration: '30s',
};

export function setup() {
//  return login_ui();
  return newdata_api();
//  return login_api();
//  return sync_api();
}

export default function (data) {
  let c_time = new Date();
  let log_post = {
    method: 'POST',
    URL: 'https://mc.megakiku.net/api/settings/log',
    params: {
      headers: header,
    },
    querystring: null,
    body: JSON.stringify({
      "screen_id": "30", // 30:最新計測値
      "access_type": "0", // 0:画面遷移
      "log": "（※ツールによる記録）",
      "detail": [],
      "record_date": c_time.toJSON()
    })
  }
  
  const response = http.request(data.method, data.URL+data.querystring, data.body, data.params);
  //const response = http.request(log_post.method, log_post.URL, log_post.body, log_post.params);
  const checkResult = check(response, {
    "response code was 200": (response) => response.status == 200,
  });
  if (!checkResult) {
//    fail("status code was not 200. Error code: "+response.error_code);
    exec.test.abort('Abort test. Error code: '+response.error_code);    
  }

  http.request(log_post.method, log_post.URL, log_post.body, log_post.params);
  sleep(1);
}

// **************************************************************
// ローカル関数
// **************************************************************

/**
 * ログイン画面へのアクセス
 * @return {object} HTTPリクエストパラメータ
 */
 function login_ui () {
  return {
    method: 'GET',
    URL: 'https://mc.megakiku.net/login',
    params: null,
    querystring: null,
    body: null
  };
}

/**
 * 最新データAPIへのアクセス
 * @return {object} HTTPリクエストパラメータ
 */
 function newdata_api () {
  const body = {
    "spot_id": 41,
    "device_id": null,
    "data_id": null,
    "current_page": null,
    "page_count": null // 1ページあたりデータ数(未設定の場合100)
  };

  return {
    method: 'GET',
    URL: 'https://mc.megakiku.net/api/newdata/tm2',
    params: {
      headers: header
    },
    querystring: "?spot_id="+body["spot_id"],
    body: null
  };
}

/**
 * ログインAPIへのアクセス
 * @return {object} HTTPリクエストパラメータ
 */
 function login_api () {
  header = {
    "Content-Type": "application/json"
  };
  const body = {
    "login_id": "loaduser",
    "password": "loaduser",
  };

  return {
    method: 'POST',
    URL: 'https://mc.megakiku.net/api/login',
    params: {
      headers: header
    },
    querystring: "",
    body: JSON.stringify(body)
  };
}

/**
 * データ同期APIへのアクセス
 * @return {object} HTTPリクエストパラメータ
 */
 function sync_api () {
  const body = {
    "type": "6",  // 取得データのタイプ(2~8)
    "spot_id": null,
    "gateway_id": null,
    "device_id": null,
    "data_id": null,
    "updated_at": null,
    "current_page": null,
    "state": "0,1",
    "page_count": null // 1ページあたりデータ数
  };

  return {
    method: 'GET',
    URL: 'https://mc.megakiku.net/api/settings/sync',
    params: {
      headers: header
    },
    querystring: "?type="+body["type"]+"&state="+body["state"],
    body: null
  };
}
