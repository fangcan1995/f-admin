import {Injectable} from "@angular/core";
import {HttpInterceptorService} from "../../../theme/services/http-interceptor.service";
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';

@Injectable()
export class AnnouncementService {

  constructor(private _httpInterceptorService: HttpInterceptorService) {
  }

  mockData = [
    {
      "id": "1",
      "announcementTitle": "XXXXXXX",
      "announcementType": "前端",
      "addDate": "2017-09-04 10:21:12",
      "state": "启用中",
      "someStatus": "2"
    },
    {
      "id": "2",
      "announcementTitle": "XXXXXXX",
      "announcementType": "后端",
      "addDate": "2017-09-04 10:21:12",
      "state": "启用中",
      "someStatus": "2"
    },
    {
      "id": "3",
      "announcementTitle": "XXXXXXX",
      "announcementType": "后端",
      "addDate": "2017-09-04 10:21:12",
      "state": "启用中",
      "someStatus": "2"
    },
    {
      "id": "4",
      "announcementTitle": "XXXXXXX",
      "announcementType": "后端",
      "addDate": "2017-09-04 10:21:12",
      "state": "已禁用",
      "someStatus": "1"
    },
    {
      "id": "5",
      "announcementTitle": "XXXXXXX",
      "announcementType": "前端",
      "addDate": "2017-09-04 10:21:12",
      "state": "已禁用",
      "someStatus": "1"
    },
    {
      "id": "6",
      "announcementTitle": "XXXXXXX",
      "announcementType": "前端",
      "addDate": "2017-09-04 10:21:12",
      "state": "已禁用",
      "someStatus": "1"
    },
    {
      "id": "7",
      "announcementTitle": "XXXXXXX",
      "announcementType": "后端",
      "addDate": "2017-09-04 10:21:12",
      "state": "已禁用",
      "someStatus": "1"
    }
  ];

  // 获取数据列表
  getList(params?): Observable<any> {
    // return this._httpInterceptorService.request('GET', `${baseUrl}/${apis['MEMBERS']}`, params);
    let res = {
      code: 0,
      msg: '',
      data: this.mockData,
      extras: {}
    };
    return Observable.of(res)
  }

  // 删除一条数据
  deleteOne(id): Observable<any> {
    // return this._httpInterceptorService.request('DELETE', `${baseUrl}/${apis['MEMBERS']}/${id}`)
    let data = _.remove(this.mockData, x => x.id === id);
    let res = {
      code: 0,
      msg: '',
      data,
      extras: {}
    };
    return Observable.of(res);
  }

  // 获取一条数据
  getOne(id): Observable<any> {
    // return this._httpInterceptorService.request('GET', `${baseUrl}/${apis['MEMBERS']}/${id}`);
    let data = _.find(this.mockData, x => x.id === id);
    console.log(data);
    let res = {
      code: 0,
      msg: '',
      data,
      extras: {}
    };
    return Observable.of(res);

  }

  // 添加一条数据
  postOne(params): Observable<any> {
    // return this._httpInterceptorService.request('POST', `${baseUrl}/${apis['MEMBERS']}`, params)
    let id = _.reduce(this.mockData, (max, n) => Number(n.id) > max ? Number(n.id) : max, 0) + 1;
    params.id = id;
    this.mockData.push(params);
    let res = {
      code: 0,
      msg: '',
      data: params,
      extras: {}
    };
    return Observable.of(res);
  }

  // 修改一条数据，提供所有字段
  putOne(id, params): Observable<any> {
    // return this._httpInterceptorService.request('PUT', `${baseUrl}/${apis['MEMBERS']}/${id}`, params)
    let index = _.findIndex(this.mockData, t => t.id === id);
    if (index != -1) {
      this.mockData[index] = params;
    }
    let res = {
      code: 0,
      msg: '',
      data: params,
      extras: {}
    };
    return Observable.of(res);
  }
}