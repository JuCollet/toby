import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";

import styles from "./styles.module.scss";

export const Confidentiality = () => {
  const [content, setContent] = useState<string>();
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    (async function () {
      const content = await fetch(
        `/assets/confidentiality/${language ?? "en"}.md`,
      );
      const text = await content.text();
      setContent(text);
    })();
  }, [language]);

  return (
    <div className={styles.container}>
      <Markdown>{content}</Markdown>
    </div>
  );
};
