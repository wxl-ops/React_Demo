import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Upload, message, Space } from 'antd';
const { Dragger } = Upload;
import {
  LoadingOutlined,
  PlusOutlined,
  DownloadOutlined,
  DeleteOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { Postupload, Postexcelupload } from '@/api/upload-api.js';
import { connect } from 'dva';

import './cupload.less';
import word from '@/assets/image/word.png';
import ppt from '@/assets/image/ppt.png';
import xlsx from '@/assets/image/xlsx.png';
import pdf from '@/assets/image/pdf.png';
import zip from '@/assets/image/zip.png';
function cupload(props, ref) {
  const { dispatch } = props;
  useImperativeHandle(ref, () => ({
    submit: () => {
      let arr = fileList.map((item) => {
        return item.sqlurl;
      });
      let obj = {};
      obj[props.prop] = arr.toString();
      props.submit(obj);
    },
  }));
  const [uploadData, setUploaddata] = useState({
    loading: false,
    imageUrl: '',
  });
  const [fileList, setfileList] = useState([]);
  const handlesetUploaddata = (key, value) => {
    uploadData[key] = value;
    setUploaddata({ ...uploadData });
  };
  const handletypeimg = (data) => {
    let arr = data.name.split('.');
    let type = arr[arr.length - 1];
    if (type == 'doc' || type == 'docx') {
      return word;
      // handlesetUploaddata("imageUrl", word)
    } else if (type == 'ppt' || type == 'pptx') {
      return ppt;
      // handlesetUploaddata("imageUrl", ppt)
    } else if (type == 'xls' || type == 'xlsx') {
      return xlsx;
      // handlesetUploaddata("imageUrl", xlsx)
    } else if (type == 'zip' || type == 'rar') {
      return zip;
      // handlesetUploaddata("imageUrl", zip)
    } else if (type == 'pdf') {
      return pdf;
      // handlesetUploaddata("imageUrl", pdf)
    } else if (type == 'jpg' || type == 'png' || type == 'gif') {
      if (data.res) {
        return data.res.url;
      } else {
        return data.name;
      }
      // handlesetUploaddata("imageUrl", info.file.response.data.url)
    }
  };
  useEffect(async () => {
    if (props.fileList) {
      let arr = [
        {
          uid: props.fileList,
          name: props.fileList,
        },
      ];
      arr.forEach((item) => {
        item.sqlurl = handletypeimg(item);
      });
      setfileList(arr);
    } else {
      setfileList([]);
    }
  }, []);
  //------------------------------------------------------------------------------------
  const beforeUpload = (file) => {
    handlesetUploaddata('loading', true);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    // return isJpgOrPng && isLt2M;
  };
  const handleupload = async (file) => {
    const formData = new FormData();
    formData.append('file', file.file);
    if (props.type == 'excel') {
      let res = await Postexcelupload(formData);
      console.log(res);
      if (res.code == 200) {
        message.success(`上传成功`);
        props.exceluploadsuccess();
      } else {
        message.error(`上传失败，请联系管理员！`);
      }
    } else {
      let res = await Postupload(formData);
      if (res.code == 200) {
        let obj = file.file;
        obj.res = res.data;
        let oldfileList = fileList;
        obj.url = handletypeimg(obj);
        obj.sqlurl = obj.res.url;
        oldfileList.push(obj);
        setfileList(oldfileList);
        message.success(`${obj.name}上传成功`);
        handlesetUploaddata('loading', false);
      }
    }
    return;
  };
  const handledel = (info) => {
    let arr = JSON.parse(JSON.stringify(fileList));
    arr.forEach((item, index) => {
      if (item.uid === info.uid) {
        arr.splice(index, 1);
      }
    });
    if (arr.length) {
      setfileList(arr);
    } else {
      setfileList([]);
    }
  };
  return (
    <div>
      <div>
        {fileList
          ? fileList.map((item, index) => {
              return (
                <div className="imgborder" key={index} className="imgborder">
                  <img
                    src={`${process.env.UMI_ENV}${item.sqlurl}`}
                    alt="avatar"
                    style={{ width: '80px' }}
                  />
                  <div className="imgmodel">
                    <Space className="imgicon">
                      <DownloadOutlined />
                      <DeleteOutlined
                        onClick={() => {
                          handledel(item);
                        }}
                      />
                    </Space>
                  </div>
                </div>
              );
            })
          : null}
        {props.type == 'excel' ? (
          <Dragger
            name="file"
            listType="picture-card"
            showUploadList={false}
            customRequest={handleupload}
            accept={props.accept}
            beforeUpload={beforeUpload}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击上传文件</p>
            <p className="ant-upload-hint">{props.text}</p>
          </Dragger>
        ) : (
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            customRequest={handleupload}
            accept={props.accept}
            beforeUpload={beforeUpload}
            style={{ width: '50px' }}
          >
            <div>
              {uploadData.loading ? <LoadingOutlined /> : <PlusOutlined />}
              {!fileList.length ? (
                <div style={{ marginTop: 8 }}>Upload</div>
              ) : null}
            </div>
          </Upload>
        )}
      </div>
    </div>
  );
}
cupload = forwardRef(cupload);
export default cupload;
