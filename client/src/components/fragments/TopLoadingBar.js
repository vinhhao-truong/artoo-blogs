import LoadingBar from "react-top-loading-bar";
import LinearProgress from "@mui/material/LinearProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useDispatch, useSelector } from "react-redux";
import { selectFeatures, setLoadingBar } from "../../store/user/features-slice";
import { selectMyProfile } from "../../store/user/myProfile-slice";
import { useEffect } from "react";

const TopLoadingBar = () => {
  const dispatch = useDispatch();
  const myProfile = useSelector(selectMyProfile);
  const features = useSelector(selectFeatures);

  const theme = createTheme({
    palette: {
      pickedColor: {
        main: myProfile.pickedColor ? myProfile.pickedColor : "#3aafa9",
        contrastText: "#fff",
      },
    },
  });

  useEffect(() => {
    if (features.loadingBar.progress === 100) {
      setTimeout(() => {
        dispatch(setLoadingBar(0));
      }, 1000)
    }
    // if(features.loadingBar.progress < 100) {
    //   const diff = Math.random() * 10;
    // dispatch(setLoadingBar(Math.min(features.loadingBar.progress + diff, 100)));
    // return;
    // }
    
  }, [features.loadingBar.progress]);

  return (
    // <LoadingBar
    //   onLoaderFinished={() => {
    //     dispatch(setLoadingBar(0));
    //   }}
    //   color={myProfile.pickedColor}
    //   progress={features.loadingBar.progress}
    //   height={3}
    // />

    <ThemeProvider theme={theme}>
      <LinearProgress className="TopLoadingBar"
        variant="determinate"
        color="pickedColor"
        value={features.loadingBar.progress}
      />
    </ThemeProvider>
  );
};

export default TopLoadingBar;
