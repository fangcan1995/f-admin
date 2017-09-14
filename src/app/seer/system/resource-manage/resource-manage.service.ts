import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
} from "@angular/http";


import { SERVER } from "../../const";
import { ResourceModel } from "./resource-model.class";
import { ReourceBaseService } from "./base.service";
import { Result } from "./result-model.class";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ResourceManageService {

  private resourceManageUrl = SERVER+'/sys/resource';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private baseService:ReourceBaseService<ResourceModel>) {
  }

  private handleError(error: any): Promise<any> {
    console.error('出错啦', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getResources(): Promise<any> {
    return this.baseService.getAll(this.resourceManageUrl);
  }

  postOne(resource: ResourceModel): Promise<any> {
    const url = `${this.resourceManageUrl}/`;
    return this.baseService.create(url,resource);
  }


  getOne(resourceId: string): Promise<any> {
    const url = `${this.resourceManageUrl}/${resourceId}`;
    return this.baseService.getById(url);
  }

  putOne(resource: ResourceModel): Promise<any> {
    const url = `${this.resourceManageUrl}/`;
    return this.baseService.update(url,resource);
  }

  deleteResource(resourceId: string): Promise<any> {
    const url = `${this.resourceManageUrl}/${resourceId}`;
    return this.baseService.delete(url);
  }

  /*searchResources(param:any): Promise<any> {
    const url = `${this.resourceManageUrl}/`;
    return this.baseService.search(url,param);
  }*/

}
