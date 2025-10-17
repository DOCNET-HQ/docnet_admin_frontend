// export function Loader() {
//     return (
//         <div className="flex items-center justify-center min-h-screen">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
//         </div>
//     );
// }

import React from "react";
import { LoaderOne } from "@/components/ui/loader";

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoaderOne />
    </div>
  );
}
