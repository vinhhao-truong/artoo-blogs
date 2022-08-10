import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectFeatures, setImgPreview } from '../../store/user/features-slice';

const ImgPreviewModal = () => {
  const dispatch = useDispatch();
  const imgPreviewProps = useSelector(selectFeatures).imgPreview;

  const handleCancel = () => {
    dispatch(setImgPreview({
      isOpen: false
    }))
  }

  return (
    <Modal visible={imgPreviewProps.isOpen} title={imgPreviewProps.title} footer={null} onCancel={handleCancel}>
        <img
          alt={imgPreviewProps.title}
          style={{
            width: '100%',
          }}
          src={imgPreviewProps.imgUrl}
        />
      </Modal>
  )
}

export default ImgPreviewModal;