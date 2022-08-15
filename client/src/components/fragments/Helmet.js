import { Helmet } from "react-helmet";

const MainHelmet = () => {
  return (
    <Helmet>
      <title>Artoo Blogs</title>
    </Helmet>
  )
}

const ChildHelmet = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | Artoo Blogs</title>
    </Helmet>
  );
};

export { ChildHelmet, MainHelmet };
