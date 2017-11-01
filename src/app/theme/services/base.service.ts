import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import * as _ from 'lodash';
import {
  ResModel,
  HttpInterceptorService,
} from './http-interceptor.service';

import { getStorage, setStorage, castDict2Translate } from '../libs';

const BASE_DOMAIN = '172.16.7.4';
const BASE_PORT = 8020;
const BASE_SERVER = `${BASE_DOMAIN}:${BASE_PORT}`;
export const BASE_URL = `http://${BASE_SERVER}`;
export const API = {
  'LOGIN': 'uaa/oauth/token',
  'LOGOUT': 'logout',
  'SIGNUP': 'signup',
  'MEMBERS': 'members',
  'USER': 'permission/users/getByToken',
  'RESOURCES': 'permission/resources',
  'DICTS': 'system/dicts',
  'ROLES': 'system/roles',
}

// 此服务用于继承，请不要注入使用；如果想用更灵活的http服务请使用HttpInterceptorService，最灵活的是angular2自带的Http服务；
@Injectable()
export class BaseService<T> {
  private _api: string;
  constructor(
    protected _httpInterceptorService: HttpInterceptorService,
    ) {}
  // 当子类继承时，请在构造函数里调用一次设置接口名
  public setApi(api: string) {
    this._api = api;
  }
  // 获取列表
  public getList(params?: any): Promise<ResModel> {
    return this._httpInterceptorService.request('GET', `${BASE_URL}/${this._api}`, params).toPromise();
  }
  // 获取一条记录
  public getOne(id: string | number): Promise<ResModel> {
    return this._httpInterceptorService.request('GET', `${BASE_URL}/${this._api}/${id}`).toPromise();
  }
  // 新增一条记录
  public postOne(params: any): Promise<ResModel> {
    return this._httpInterceptorService.request('POST', `${BASE_URL}/${this._api}`, params).toPromise();
  }
  // 修改一条记录，提供全部字段
  public putOne(id: string | number, params: any): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${BASE_URL}/${this._api}/${id}`, params).toPromise();
  }
  // 修改一条记录，提供部分字段
  public patchOne(id: string | number, params: any): Promise<ResModel> {
    return this._httpInterceptorService.request('PATCH', `${BASE_URL}/${this._api}/${id}`, params).toPromise();
  }
  // 删除一条记录
  public deleteOne(id: string | number): Promise<ResModel> {
    return this._httpInterceptorService.request('DELETE', `${BASE_URL}/${this._api}/${id}`).toPromise();
  }
  // 从本地存储里获取用户信息
  public getUserFromLocal(): Promise<ResModel> {
    return new Promise(resolve => {
      resolve({
        code: 0,
        msg: '',
        data: getStorage({ key: 'user' })
      })
    });
  }
  // 从服务器端获取用户信息
  public getUserFromServer(): Promise<ResModel> {
    return this._httpInterceptorService.request('GET', `${BASE_URL}/${API['USER']}`).toPromise();
  }
  // 从本地获取资源（菜单）
  public getResourcesFromLocal(): Promise<ResModel> {
    return new Promise(resolve => {
      resolve({
        code: 0,
        msg: '',
        data: getStorage({ key: 'resources' })
      })
    })
  }
  // 从服务器获取资源（菜单）
  public getResourcesFromServer(params?): Promise<ResModel> {
    return this._httpInterceptorService.request('GET', `${BASE_URL}/${API['RESOURCES']}`, params).toPromise()
  }
  // 从本地获取字典
  public getDictsFromLocal(): Promise<ResModel> {
    return new Promise(resolve => {
      resolve({
        code: 0,
        msg: '',
        data: getStorage({ key: 'dicts' })
      })
    })
  }
  public getDictsFromServer(params?): Promise<ResModel> {
    return this._httpInterceptorService.request('GET', `${BASE_URL}/${API['DICTS']}`, params).toPromise();
  }
  // 拉取字典数据
  public getDicts(forceFromServer?): Promise<ResModel> {
    const dictsCacheTime: string = 'DICTS_CACHE_TIME';
    const isDictsInResponse: string = 'IS_DICTS_IN_RESPONSE';
    const cachedDicts: string = 'dicts';
    const lastDictsCacheTime: number = +getStorage({ key: dictsCacheTime }, false);
    const dicts = getStorage({ key: cachedDicts }, false);
    const now = new Date().getTime();
    if ( getStorage({ key: isDictsInResponse }, false) ) {
      return new Promise((resolve, reject) => {
        let timer = null;
        let interval = 0;
        timer = setInterval(() => {
          interval += 10;
          if ( !getStorage({ key: isDictsInResponse }, false) ) {
            clearInterval(timer);
            timer = null;
            const dicts = getStorage({ key: cachedDicts }, false);

            resolve({
              code: 0,
              msg: 'get dicts from cache success',
              data: dicts,
            })
          } else if ( interval === 3000 ) {
            clearInterval(timer);
            timer = null;
            setStorage({
              key: isDictsInResponse,
              value: false,
            }, false)
            return {
              code: -1,
              msg: '获取字典失败',
            }
          }
        }, 10);
      })
    } else if ( !forceFromServer && dicts && ( now - lastDictsCacheTime ) < 30000 ) {
      return new Promise((resolve, reject) => {
        resolve({
          code: 0,
          msg: 'get dicts from cache success',
          data: dicts,
        });
      });
    } else {
      setStorage({
        key: isDictsInResponse,
        value: true,
      }, false)
      return this.getDictsFromServer({ pageSize: 10000 })
      .then(res => {
        setStorage({
          key: isDictsInResponse,
          value: false,
        }, false)

        let { code, message, data } = res;
        data = data ? data.list || [] : [];

        setStorage({
          key: cachedDicts,
          value: data,
        }, false);
        setStorage({
          key: dictsCacheTime,
          value: new Date().getTime(),
        }, false);

        return {
          code: 0,
          msg: message,
          data,
        }
      })
      .catch(err => {
        setStorage({
          key: isDictsInResponse,
          value: false,
        }, false)
        return {
          code: -1,
          msg: '获取字典失败',
        }
      })
    }
  }
  public getDictsPro(): Promise<ResModel> {
    return this.getDicts()
    .then(res => {
      if ( res.code == 0 ) {
        return res
      } else if ( getStorage({ key: 'dicts' }, false) ) {
        return {
          code: 0,
          msg: 'old dicts',
          data: getStorage({ key: 'dicts' }, false)
        }
      } else {
        return res;
      }
    })
  }
  public getDictTranslate(translateFields: {fieldName: string, category?: string}[]): Promise<ResModel> {
    return this.getDictsPro()
    .then(res => {
      if ( res.code == 0 ) {
        let data = res.data;
        let translate = castDict2Translate(data, translateFields);
        return {
          code: 0,
          msg: 'dict translate success',
          data: translate,
        }
      } else {
        return res;
      }
    })
  }
}