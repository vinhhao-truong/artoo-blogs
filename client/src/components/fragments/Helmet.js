import { Helmet } from "react-helmet";

const MainHelmet = () => {
  return (
    <Helmet>
      {/* <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="../../../public/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="../../../public/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="../../../public/favicon-16x16.png"
      />
      <link rel="manifest" href="../../../public/site.webmanifest" /> */}
      <title>Artoo Blogs</title>
    </Helmet>
  );
};

const ChildHelmet = ({ title, metaTags }) => {
  const ogMeta = metaTags.filter(meta => {
    return meta.property && meta.content;
  })
  const nameMeta = metaTags.filter(meta => {
    return meta.name && meta.content;
  })

  return (
    <Helmet>
      {
        ogMeta.map((meta, idx) => (<meta key={idx + "-og"} property={`og:${meta.property}`} content={meta.content} />))
      }
      {
        nameMeta.map((meta, idx) => (<meta key={idx + "-name"} name={meta.property} content={meta.content} />))
      }
      <link rel="manifest" href="../../../public/site.webmanifest" />
      <title>{title} | Artoo Blogs</title>
    </Helmet>
  );
};

export { ChildHelmet, MainHelmet };
