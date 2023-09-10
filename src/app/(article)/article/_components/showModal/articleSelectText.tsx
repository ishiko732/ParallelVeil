"use client";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useRef } from "react";
import { useShowModalStoreStore } from "@/app/(article)/article/_hooks/useShowModal";
import ShowModal from "@/components/showModal";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

const ArticleSelectText: FC = observer(function () {
  const showModalStore = useShowModalStoreStore();
  const thisRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickOutside = (event: MouseEvent) => {
    if (thisRef.current && !thisRef.current.contains(event.target as Node)) {
      showModalStore.updateSelectOpen(false);
    }
  };

  useEffect(() => {
    if (showModalStore.selectOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, showModalStore.selectOpen]);

  return showModalStore.selectOpen ? (
    <ShowModal
      x={showModalStore.point.x}
      y={showModalStore.point.y}
      style={{
        maxWidth: "500px",
      }}
      ref={thisRef}
      className={"bg-white text-black dark:bg-gray-700 dark:text-white"}
    >
      <pre>
        cu:current:{String(showModalStore.selectOpen)}
        <br />
        current:{showModalStore.currentPhrase}
      </pre>
      <AddToPhotosIcon />
    </ShowModal>
  ) : null;
});

export default ArticleSelectText;
