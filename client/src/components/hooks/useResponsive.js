import { useMediaQuery } from 'react-responsive';

const useResponsive = (size) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  switch(size) {
    case 'Tablet or Mobile':
      return isTabletOrMobile;
    default:
  }
}

export default useResponsive;