import CollectionsClient from "./CollectionsClient";
import { Suspense } from "react";

const CollectionsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">Loading...</div>
      }
    >
      <CollectionsClient />
    </Suspense>
  );
};

export default CollectionsPage;
