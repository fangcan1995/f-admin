import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import * as _ from 'lodash';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {SeerMessageService} from '../../../../../theme/services/seer-message.service';
import {StaffService} from '../../staff.service';
import {titlesEducation, titlesRelation, titlesExperience} from '../../staff.config';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {BsModalService} from 'ngx-bootstrap/modal';
import {jsonTree} from "../../../../../theme/utils/json-tree";
import {TREE_PERMISSIONS} from "../../../../../theme/modules/seer-tree/constants/permissions";
import {TREE_EVENTS} from "../../../../../theme/modules/seer-tree/constants/events";
import {SeerTree} from "../../../../../theme/modules/seer-tree/seer-tree/seer-tree.component";
import {UPDATE, DELETE, SAVE} from '../../../../common/seer-table/seer-table.actions';

@Component({
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.scss']
})
export class StaffEditComponent implements OnInit {

  private _editType: string = 'add';
  public forbidSaveBtn: boolean = true;
  isDimission = false;
  staffId;

  //组织树
  treeTitle = "组织机构树";
  treePermissions = TREE_PERMISSIONS.NOTIFY | TREE_PERMISSIONS.ADD | TREE_PERMISSIONS.EDIT | TREE_PERMISSIONS.DELETE | TREE_PERMISSIONS.DRAG | TREE_PERMISSIONS.SHOW_FILTER | TREE_PERMISSIONS.SHOW_ADD_ROOT;
  treeNode = [];
  //下面两个为多个checkbox选择插件配置
  dropdownSettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: false,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default',
    selectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: false,
    showUncheckAll: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
  };
  myRepertoryTexts: IMultiSelectTexts = {
    checkAll: '选中所有',
    uncheckAll: '取消所有',
    checked: '个选中',
    checkedPlural: '个选中',
    searchPlaceholder: '搜索...',
    defaultTitle: '选择账号',
  };

  private accountData: IMultiSelectOption[] = [];

  public staff: any = {
    sysEmployer: {}
  };
  educationsData = [];
  relationsData = [];
  experiencesData = [];

  public titlesEducation = titlesEducation;
  public titlesRelation = titlesRelation;
  public titlesExperience = titlesExperience;

  @ViewChild('educationView') educationView;
  @ViewChild('relationView') relationView;
  @ViewChild('experienceView') experienceView;

  collapseCardActions = [SAVE];
  simpleTableActions = [UPDATE, DELETE];

  constructor(private _staffService: StaffService,
              private _messageService: SeerMessageService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _location: Location,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    //this.getOrganizations();//为什么要获取组织结构？
    //this.isDimission=false;
    this._route.url.mergeMap(url => {
      this._editType = url[0].path;
      return this._route.params
    }).subscribe(params => {
      if (this._editType === 'edit') {
        this.staffId = params.id;
        this._staffService.getOne(params.id).then(res => {
          // console.log(res.data.sysEmployer);
          this.staff = res.data || {};

          this.dateFormat();
          this.staffStateChange(this.staff.sysEmployer.empStatus);

          this.educationsData = this.staff.sysEduExperList;
          this.educationsData = _.map(this.educationsData, r => _.set(r, 'actions', [UPDATE, DELETE]));

          this.relationsData = this.staff.sysEmployContactList;
          this.relationsData = _.map(this.relationsData, r => _.set(r, 'actions', [UPDATE, DELETE]));

          this.experiencesData = this.staff.sysWorkExperList;
          this.experiencesData = _.map(this.experiencesData, r => _.set(r, 'actions', [UPDATE, DELETE]));

          this.forbidSaveBtn = false;
        }, errMsg => {
          // 错误处理的正确打开方式
          this._messageService.open({
            icon: 'fa fa-times-circle',
            message: errMsg,
            autoHideDuration: 3000,
          }).onClose().subscribe(() => {
            this._location.back()
          })
        })
      } else if (this._editType === 'add') {
        this.forbidSaveBtn = false;
      }
    })
  }

  handleBackBtnClick() {
    this._location.back()
  }

  /*离职处理,员工状态选中离职后，激活离职时间按钮*/
  staffStateChange(staffStateId: any) {
    if (staffStateId == '2') {
      this.isDimission = true;
    } else {
      this.isDimission = false;
    }
  }

  /* 获取全部组织机构 */
  // getOrganizations() {
  //   // this._staffService.getOrganizations().then((result) => {
  //   //   result.data.map(org => org['children'] = []);
  //   //   let nodes = jsonTree(result.data, {parentId: 'orgParentId', children: 'children'}, [{
  //   //     origin: 'orgName',
  //   //     replace: 'name'
  //   //   }]);
  //   //   this.treeNode = nodes;
  //   // });
  // }

  //职位保存基本信息
  jobInfoNotify() {
    console.log(this.staff.sysEmployer);
    this.timestampFormat();
    this._staffService.putOne(this.staff.sysEmployer.id, this.staff.sysEmployer).then((result) => {
      console.log(this.staff.sysEmployer);
      if (result.code == 0) {
        alert("添加成功");
      } else {
        alert("添加失败");
      }
    });
  }

  //职位个人基本信息
  staffInfoNotify() {
    this.timestampFormat();
    this._staffService.putOne(this.staff.sysEmployer.id, this.staff.sysEmployer).then((result) => {
      console.log(this.staff.sysEmployer);
      if (result.code == 0) {
        alert("添加成功");
      } else {
        alert("添加失败");
      }
    });
  }

  /*Date类型转化为时间戳*/
  timestampFormat() {
    if (this.staff.sysEmployer.entryTime != null && this.staff.sysEmployer.entryTime != "") {
      this.staff.sysEmployer.entryTime = this.staff.sysEmployer.entryTime.getTime();
    }
    if (this.staff.sysEmployer.exitTime != null && this.staff.sysEmployer.exitTime != "") {
      this.staff.sysEmployer.exitTime = this.staff.sysEmployer.exitTime.getTime();
    }
    if (this.staff.sysEmployer.contractStartDate != null && this.staff.sysEmployer.contractStartDate != "") {
      this.staff.sysEmployer.contractStartDate = this.staff.sysEmployer.contractStartDate.getTime();
    }
    if (this.staff.sysEmployer.contractEndDate != null && this.staff.sysEmployer.contractEndDate != "") {
      this.staff.sysEmployer.contractEndDate = this.staff.sysEmployer.contractEndDate.getTime();
    }
    if (this.staff.sysEmployer.empBirth != null && this.staff.sysEmployer.empBirth != "") {
      this.staff.sysEmployer.empBirth = this.staff.sysEmployer.empBirth.getTime();
    }
  }

  /*时间戳转化为Date*/
  dateFormat() {
    if (this.staff.sysEmployer.entryTime != null && this.staff.sysEmployer.entryTime != "") {
      this.staff.sysEmployer.entryTime = new Date(this.staff.sysEmployer.entryTime);
    }
    if (this.staff.sysEmployer.exitTime != null && this.staff.sysEmployer.exitTime != "") {
      this.staff.sysEmployer.exitTime = new Date(this.staff.sysEmployer.exitTime);
    }
    if (this.staff.sysEmployer.contractStartDate != null && this.staff.sysEmployer.contractStartDate != "") {
      this.staff.sysEmployer.contractStartDate = new Date(this.staff.sysEmployer.contractStartDate);
    }
    if (this.staff.sysEmployer.contractEndDate != null && this.staff.sysEmployer.contractEndDate != "") {
      this.staff.sysEmployer.contractEndDate = new Date(this.staff.sysEmployer.contractEndDate);
    }
    if (this.staff.sysEmployer.empBirth != null && this.staff.sysEmployer.empBirth != "") {
      this.staff.sysEmployer.empBirth = new Date(this.staff.sysEmployer.empBirth);
    }
  }

  //教育背景
  educationsNotify($event) {
    let {type, key} = $event;
    let editData = this.educationView.getFormatDataByKey(key).editData;
    switch (type) {
      case 'save':
        if (editData.id) {
          this._staffService.putOneEdu(this.staffId, editData).then((result) => {
            this.educationView.save(key);
          });//修改
        } else {
          this._staffService.postOneEdu(this.staffId, editData).then((result) => {
            this.educationView.save(key);
          });//新增
        }
        alert('保存');
        break;
      case 'delete':
        this._staffService.deleteEdu(this.staffId, editData.id).then((result) => {
          this.educationView.delete(key);
        });
        alert('删除');
        break;
    }
  }

  //关系人
  relationsNotify($event) {
    let {type, key} = $event;
    let editData = this.relationView.getFormatDataByKey(key).editData;
    switch (type) {
      case 'save':
        if (editData.id) {
          this._staffService.putOneRelations(this.staffId, editData).then((result) => {
            this.relationView.save(key);
          });//修改
        } else {
          this._staffService.postOneRelations(this.staffId, editData).then((result) => {
            this.relationView.save(key);
          });//新增
        }
        alert('保存');
        break;
      case 'delete':
        this._staffService.deleteRelations(this.staffId, editData.id).then((result) => {
          this.relationView.delete(key);
        });
        alert('删除');
        break;
    }
  }

  //工作经验
  experiencesNotify($event) {
    let {type, key} = $event;
    let editData = this.experienceView.getFormatDataByKey(key).editData;
    switch (type) {
      case 'save':
        if (editData.id) {
          this._staffService.putOneExperiences(this.staffId, editData).then((result) => {
            this.experienceView.save(key);
          });//修改
        } else {
          this._staffService.postOneExperiences(this.staffId, editData).then((result) => {
            this.experienceView.save(key);
          });//新增
        }
        alert('保存');
        break;
      case 'delete':
        this._staffService.deleteExperiences(this.staffId, editData.id).then((result) => {
          this.experienceView.delete(key);
        });
        alert('删除');
        break;
    }
  }

  /* 模态层 */
  public modalRef: BsModalRef;

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  save(prams) {

  }
}
