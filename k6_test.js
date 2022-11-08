'use strict;'

import http from 'k6/http';
import { check, fail } from 'k6';
import { sleep } from 'k6';

const URL = 'https://test01.megakiku.net/api/settings/sync';
//const URL = 'https://mc.megakiku.net/api/settings/sync';
const ACCESS_TOKEN = "l989sumy0evz9076d74h5uxn"; // test01
//const ACCESS_TOKEN = "l9peznle000829c772ear2x5"; // test11
//const ACCESS_TOKEN = "l1ohlzt7000103f1c781ut8m"; // mc3


const header = {
  "Content-Type": "application/json",
  "Authorization": ACCESS_TOKEN,
};
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
const params = {
  headers: header
};
const querystring = "?state="+body["state"]+"&type="+body["type"];

export let options = {
/*
  stages: [
    { target: 10, duration: '1s' },
    { target: 20, duration: '1s' },
    { target: 30, duration: '1s' }
  ]
*/
  vus: 10,
//  iterations: 10,
  duration: '10s',
};

export default function () {
  const response = http.get(URL+querystring, params);
  const checkResult = check(response, {
    "response code was 200": (response) => response.status == 200,
  });
  if (!checkResult) {
    fail("status code was not 200");
  }
//  sleep(1);
}
