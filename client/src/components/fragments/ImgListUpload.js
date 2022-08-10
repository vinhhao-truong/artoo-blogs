import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setImgPreview } from '../../store/user/features-slice';

const ImgListUpload = ({handleUpload}) => {
  const [imgList, setImgList] = useState([]);

  const dispatch = useDispatch();

  const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    dispatch(setImgPreview({
      isOpen: true,
      title: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      imgUrl: file.url || file.preview
    }))
  };

  const handleChange = ({ fileList: newImgList }) => setImgList(newImgList)

  return (
    <Upload
        customRequest={handleUpload}
        listType="picture-card"
        fileList={imgList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {imgList.length >= 4 ? null : uploadButton}
      </Upload>
  )
}

export default ImgListUpload;