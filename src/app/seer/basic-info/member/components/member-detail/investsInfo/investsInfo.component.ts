import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,} from '@angular/router';
import { Location } from '@angular/common';
import { MemberService } from '../../../member.service';
import { SeerMessageService } from '../../../../../../theme/services/seer-message.service';

@Component({
  selector: 'investsInfo',
  templateUrl: './investsInfo.component.html',

})
export class InvestsInfoComponent implements OnInit {
  public member: any = {};
  private _editType: string = 'add';
  public forbidSaveBtn: boolean = true;
  investsRecord: any = [];  //借款记录
  titlesInvestsRecord=[
    {
      key:'id',
      label:'项目编号',
    },
    {
      key:'status',
      label:'投资状态',
    },
    {
      key:'count',
      label:'投资金额',
    },
    {
      key:'qx',
      label:'投资期限(月)',
    },
    {
      key:'aaa',
      label:'已收本金',
    },
    {
      key:'bbb',
      label:'已收利息笔数',
    },
    {
      key:'ccc',
      label:'已收利息',
    }
  ];
  memberId:any='';
  constructor(
    private _memberService: MemberService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _messageService: SeerMessageService,
  ) {}
  ngOnInit() {
    this._route.url.mergeMap(url => {
      this._editType = url[0].path
      return this._route.params
    })
      .subscribe(params => {
        if ( this._editType === 'invests' ) {
          this.memberId=params.id;
          this._memberService.getInvests(params.id)
          .then(res => {
              this.member = res.data || {};
              this.investsRecord=res.data.investsRecord;
              this.forbidSaveBtn = false;
            }).catch(err=>{
            this.showError(err.msg || '连接失败');
          });
        }
      })
  }
  handleBackBtnClick() {
    this._router.navigate([`../../`], {relativeTo: this._route});
  }
  memberInfoClick(){
    this._router.navigate([`../../detail/${this.memberId}`], {relativeTo: this._route});
  }
  investInfoClick(){
    this._router.navigate([`../../invests/${this.memberId}`], {relativeTo: this._route});
  }
  loanInfoClick(){
    this._router.navigate([`../../loans/${this.memberId}`], {relativeTo: this._route});
  }
  tradeInfoClick(){
    this._router.navigate([`../../trades/${this.memberId}`], {relativeTo: this._route});
  }
  showSuccess(message: string) {
    return this._messageService.open({
      message,
      icon: 'fa fa-check',
      autoHideDuration: 3000,
    })
  }
  showError(message: string) {
    return this._messageService.open({
      message,
      icon: 'fa fa-times-circle',
      autoHideDuration: 3000,
    })
  }
}
