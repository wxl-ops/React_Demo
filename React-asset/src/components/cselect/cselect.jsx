import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Space, DatePicker, Cascader } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import './cselect.less';
function cselect(props) {
  const { RangePicker } = DatePicker;
  let arr = [];
  let selectindex = 0;
  props.tablelist.forEach((item) => {
    if (item.search) {
      if (item.search == 'select' || item.search == 'cascader') {
        item.selectindex = selectindex++;
      }
      arr.push(item);
    }
  });
  const tablelist = arr;
  const [cselectdata, setCselectdata] = useState({
    addbutton: 'inline-block',
    searchbutton: 'inline-block',
    condition: [],
  });
  const handlesetCselectdata = (key, value) => {
    cselectdata[key] = value;
    setCselectdata({ ...cselectdata });
  };
  // ----------------------------------------------------------------------------------------
  const addclick = () => {
    handlesetCselectdata('addbutton', 'none');
    let condition = [...cselectdata.condition];
    condition.push({
      type: '',
      value: '',
      conditionkey: '',
      selectindex: '',
    });
    handlesetCselectdata('condition', condition);
  };
  const myOnchange = (value, index, type) => {
    //value代表了属性名的数组
    //index代表了是第几个
    //type代表了函数是又 属性选择框触发的
    let condition = [...cselectdata.condition];
    if (type) {
      //判断该属性在表格中是否有代替属性
      //如果有则使用temp中的真是字段作为key使用
      if (value[0]) {
        let typeobj;
        if (value[1].temp) {
          typeobj = tablelist.find((item) => item.temp == value[0]);
        } else {
          typeobj = tablelist.find((item) => item.prop == value[0]);
        }
        //找到属性数组对象中中包含选中的属性对象
        if (typeobj) {
          condition[index].conditionkey = value[0];
          //如果找到了就根据search的值分配他需要的输入框
          if (typeobj.search == 'input') {
            condition[index].type = '1';
          } else if (typeobj.search == 'select') {
            condition[index].type = '2';
            condition[index].selectindex = typeobj.selectindex;
          } else if (typeobj.search == 'time') {
            condition[index].type = '3';
          } else if (typeobj.search == 'cascader') {
            condition[index].type = '4';
            condition[index].selectindex = typeobj.selectindex;
          }
        }
      } else {
        //如果没找到 一般代表了他取消了这个属性选择框所以从数组中将他删掉
        condition.splice(index, 1);
        handlesetCselectdata('addbutton', 'inline-block');
      }
    } else {
      //当type为false时 代表了此函数是由 输入框触发的
      // return;
      if (value.target) {
        condition[index].value = value.target.value;
      } else if (value.length) {
        condition[index].value = value[value.length - 1];
      } else {
        condition[index].value = Number(value);
      }
      handlesetCselectdata('addbutton', 'inline-block');
      handlesetCselectdata('searchbutton', 'inline-block');
    }
    handlesetCselectdata('condition', condition);
  };
  const handleSearch = () => {
    let obj = {};
    cselectdata.condition.forEach((item) => {
      if (item.type == 2 || item.type == 4) {
        obj[item.conditionkey] = Number(item.value);
      } else {
        obj[item.conditionkey] = item.value;
      }
    });
    props.search(obj);
  };
  const handleClear = () => {
    handlesetCselectdata('condition', []);
    handlesetCselectdata('addbutton', 'inline-block');
    handleSearch();
  };
  return (
    <div className="selectborder">
      <div>
        {cselectdata.condition.map((item, index) => {
          return (
            <div key={index}>
              <Select
                placeholder="请选择"
                className="basisstyle"
                value={cselectdata.condition[index].conditionkey}
                onChange={(...e) => myOnchange(e, index, true)}
                allowClear
              >
                {tablelist.map((item, index) => {
                  return (
                    <Select.Option
                      value={item.temp ? item.temp : item.prop}
                      temp={item.temp}
                      key={index}
                    >
                      {item.title}
                    </Select.Option>
                  );
                })}
              </Select>
              {cselectdata.condition[index].type == 1 ? (
                <Input
                  placeholder="请输入"
                  value={cselectdata.condition[index].value}
                  className="basisstyle"
                  onChange={(e) => myOnchange(e, index)}
                  allowClear
                />
              ) : null}
              {cselectdata.condition[index].type == 2 ? (
                <Select
                  placeholder="请选择"
                  className="basisstyle"
                  value={cselectdata.condition[index].value}
                  onChange={(e) => myOnchange(e, index)}
                >
                  {props.dictlist[cselectdata.condition[index].selectindex].map(
                    (item, keyindex) => {
                      return (
                        <Select.Option value={item.dictValue} key={keyindex}>
                          {item.name}
                        </Select.Option>
                      );
                    },
                  )}
                </Select>
              ) : null}
              {cselectdata.condition[index].type == 3 ? (
                <Space
                  direction="vertical"
                  size={12}
                  style={{ width: 220 }}
                  className="basisstyle"
                >
                  <RangePicker
                    value={cselectdata.condition[index].value}
                    onChange={(...e) => myOnchange(e, index)}
                    format="YYYY/MM/DD"
                    showTime
                  />
                </Space>
              ) : null}
              {cselectdata.condition[index].type == 4 ? (
                <Cascader
                  className="basisstyle"
                  changeOnSelect
                  expandTrigger="hover"
                  placeholder="请选择"
                  options={
                    props.dictlist[cselectdata.condition[index].selectindex]
                  }
                  onChange={(e) => myOnchange(e, index)}
                  fieldNames={{
                    label: 'name',
                    value: 'id',
                    children: 'childrenList',
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <Button
        type="default"
        shape="round"
        style={{ display: cselectdata.addbutton }}
        icon={<SearchOutlined />}
        onClick={addclick}
        className="mybutton"
      ></Button>
      <Button
        type="primary"
        shape="round"
        style={{ display: cselectdata.searchbutton }}
        onClick={handleSearch}
        className="mybutton"
      >
        搜索
      </Button>
      <Button
        type="ghost"
        shape="round"
        style={{ display: cselectdata.searchbutton }}
        onClick={handleClear}
        className="mybutton"
      >
        重置
      </Button>
    </div>
  );
}
export default cselect;
