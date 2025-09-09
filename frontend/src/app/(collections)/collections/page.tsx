import CollectionsClient from "./CollectionsClient";
import { Suspense } from "react";

const CollectionsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionsClient />
    </Suspense>
  );
};

export default CollectionsPage;
