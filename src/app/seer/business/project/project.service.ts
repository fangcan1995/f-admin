import { Injectable } from '@angular/core';
import {BaseService} from "../../base.service";
import {SERVER} from "../../const";
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ProjectService extends BaseService<any>{

  mockData = [
    { "projectId" : "BBH1234567890223657867", "realName": "张三", "mobilePhone": "13813813138", "projectType": "汇车贷", "loanAmount": "100000.00", "lifeOfLoan": "3个月","fullTime":"2017-08-15 12:12:11","projectStatus":"还款中"},
    { "projectId" : "BBH1234567890223657867", "realName": "李四", "mobilePhone": "13813813138", "projectType": "汇车贷", "loanAmount": "100000.00", "lifeOfLoan": "6个月","fullTime":"2017-08-15 12:12:11","projectStatus":"待提前还款审核"},
    { "projectId" : "BBH1234567890223657867", "realName": "王五", "mobilePhone": "13813813138", "projectType": "汇车贷", "loanAmount": "100000.00", "lifeOfLoan": "12个月","fullTime":"2017-08-15 12:12:11","projectStatus":"已结清"}
  ];

  //意向
  private apiUrl = SERVER + '/projects';

  //会员
  private memberUrl = SERVER + '/members';


  // 意向列表(分页)
  public getIntentionList(params?): any {

    return this.mockData;
  }

  //根据意向ID查询意向信息
  public getIntentionById(projectId): Promise<any> {
    const url = `${this.apiUrl}/${projectId}`;
    return this.getById(url);
  }


  //提交审核
  public submitAudit(params?): Promise<any> {

    return this.create(this.apiUrl, params);
  }



  // 获取一条数据
  getOne(params): Observable<any> {
    // return this._httpInterceptorService.request('GET', `${BASE_URL}/${API['MEMBERS']}/${id}`);
    let data = _.find(this.mockData, x => x.projectId === params);
    console.log(data);
    let res = {
      code: 0,
      msg: '',
      data,
      extras: {}
    }
    return Observable.of(res);
  }



}
