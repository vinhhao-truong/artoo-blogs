import LoadingBar from "react-top-loading-bar";

import { useDispatch, useSelector } from "react-redux";
import { selectFeatures, setLoadingBar } from "../../store/user/features-slice";
import { selectMyProfile } from "../../store/user/myProfile-slice";

const TopLoadingBar = () => {
  const dispatch = useDispatch();
  const myProfile = useSelector(selectMyProfile);
  const features = useSelector(selectFeatures);

  return (
    <LoadingBar
      onLoaderFinished={() => {
        dispatch(setLoadingBar(0));
      }}
      color={myProfile.pickedColor}
      progress={features.loadingBar.progress}
      height={3}
    />
  );
};

export default TopLoadingBar;
