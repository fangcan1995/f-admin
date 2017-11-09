import {Injectable} from "@angular/core";
import {BaseService,HttpInterceptorService,API,BASE_URL,ResModel} from "../../../theme/services"
import {getStorage} from "../../../theme/libs/utils"
@Injectable()
export class MemberService extends BaseService<ResModel>{
  MembersUrl="http://172.16.7.4:9080/members"; //会员接口
  emergencyContactUrl=`emergencyContact`;//联系人
  VehicleContactUrl=`vehicleInfo`;//车辆
  HouseContactUrl=`houseInfo`;//车辆
  accessToken = getStorage({ key: 'token' }).access_token;

  constructor(
    protected _httpInterceptorService:HttpInterceptorService
  ) {
    super(_httpInterceptorService);
    this.setApi(API['ROLES']);
  }
  // 1 获取数据列表,OK
  getList(pageInfo): Promise<ResModel> {
    const page=`?pageNum=${pageInfo.pageNum}&pageSize=${pageInfo.pageSize}`;
    const sort=`&sortBy=${pageInfo.sort}`;
    const jsonQueryObj = pageInfo.query;
    let query:string="";
    for (var prop in jsonQueryObj) {
      if(jsonQueryObj[prop]){
        query+=`&${prop}=${jsonQueryObj[prop]}`;
      }
    }
    return this._httpInterceptorService.request('GET', `${this.MembersUrl}/${page}${sort}${query}`,{}, true).toPromise();
  }
  // 2 获取一条数据,OK
  getOne(id: string | number): Promise<ResModel> {
    return this._httpInterceptorService.request('GET', `${this.MembersUrl}/${id}`,{}, true).toPromise();
  }
  //3 修改基本信息,OK
  putBasicInfo(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/baseInfo`, params).toPromise();
  }
  //4-1 增加联系人,OK
  postContact(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('POST', `${this.MembersUrl}/${id}/${this.emergencyContactUrl}`, params).toPromise();
  }
  //4-2 修改联系人,OK
  putContact(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/${this.emergencyContactUrl}`, params).toPromise();
  }
  //4-3 删除联系人,OK
  deleteContact(id): Promise<ResModel> {
    return this._httpInterceptorService.request('DELETE', `${this.MembersUrl}/${this.emergencyContactUrl}/${id}`).toPromise();
  }
  //5 修改工作信息，OK
  putWorkInfo(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/workInfo`, params).toPromise();
  }
  //6修改账户信息，因不可修改，暂无
  //7 修改财务状况信息,OK
  putFinancialInfo(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/financialInfo`, params).toPromise();
  }
  //8-1 增加车辆，OK
  postVehicle(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('POST', `${this.MembersUrl}/${id}/${this.VehicleContactUrl}`, params).toPromise();
  }
  //8-2 修改车辆，OK
  putVehicle(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/${this.VehicleContactUrl}`, params).toPromise();
  }
  //8-3 删除车辆,OK
  deleteVehicle(id): Promise<ResModel> {
    return this._httpInterceptorService.request('DELETE', `${this.MembersUrl}/${this.VehicleContactUrl}/${id}`).toPromise();
  }
  //9-1 增加房屋，OK
  postHouse(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('POST', `${this.MembersUrl}/${id}/${this.HouseContactUrl}`, params).toPromise();
  }
  //9-2 修改房屋，OK
  putHouse(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/${this.HouseContactUrl}`, params).toPromise();
  }
  //9-3 删除房屋,OK
  deleteHouse(id): Promise<ResModel> {
    return this._httpInterceptorService.request('DELETE', `${this.MembersUrl}/${this.HouseContactUrl}/${id}`).toPromise();
  }
  //10 修改会员登录密码,OK
  putPasswords(id, params?): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/passwords`, params).toPromise();
  }
  //11 修改会员交易密码,OK,改为身份证后六位
  putTradePasswords(id, params?): Promise<ResModel> {
    return this._httpInterceptorService.request('PUT', `${this.MembersUrl}/${id}/passwords`, params).toPromise();
  }
  // 15 根据会员ID查询贷款信息
  getLoans(id): Promise<ResModel> {
      return new Promise((resolve) => {
        resolve(
          {
            "code": "0",
            "message": "SUCCESS",
            'data':{
              countInfo: {
                "userName": "5",
                "bbb": "1"
              },   //基本信息
              loansRecord: [{
                "id": "BBH20170778961354",
                "status": "待提交",
                "count":"100000.00",
                "qx":"3",
                "yhbx":"1000.00",
                "dhbx":"500.00",
              }],
            }
          }
        )
      })
  }
  //16 根据会员ID查询投资信息
  getInvests(id): Promise<ResModel> {
    return new Promise((resolve) => {
      resolve(
        {
          "code": "0",
          "message": "SUCCESS",
          'data': {
            countInfo: {
              "userName": "5",
              "bbb": "1"
            },   //基本信息
            investsRecord: [{
              "id": "BBH20170778961354",
              "status": "锁定中",
              "count": "36900.00",
              "qx": "12",
              "userName": "1000.00",
              "bbb": "1",
              "ccc": "500.00",
            }],
          }
        })
    })
  }
  //17 根据会员ID查询交易记录
  getTrades(id): Promise<ResModel> {
    return new Promise((resolve) => {
      resolve(
        {
          "code": "0",
          "message": "SUCCESS",
          'data': {
            tradesRecord: [
              {
                "userName": "2017-09-23 11:00:01",
                "bbb": "商户转账",
                "ccc": "103.33",
                "idNumber": "成功",
              },
              {
                "userName": "2017-09-23 11:00:01",
                "bbb": "商户转账",
                "ccc": "103.33",
                "idNumber": "成功",
              },
              {
                "userName": "2017-09-23 11:00:01",
                "bbb": "商户转账",
                "ccc": "103.33",
                "idNumber": "成功",
              },
            ],
          }
        })
    })
  }
  //21 修改一条数据，提供部分字段
  patchOne(id, params): Promise<ResModel> {
    return this._httpInterceptorService.request('PATCH', `${this.MembersUrl}/${id}/status`, params).toPromise();
  }
}
