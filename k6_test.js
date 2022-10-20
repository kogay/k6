import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
      { target: 10, duration: '1s' },
      { target: 20, duration: '1s' },
      { target: 30, duration: '1s' }
    ]
};

export default function () {
    http.get('http://153.120.177.81/iot/login');
//    sleep(1);
}
