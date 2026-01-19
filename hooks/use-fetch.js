// const { useState } = require("react");
// const { set } = require("zod");
// import { toast } from "sonner";

// const useFetch = (cb) => {
//     const [data, setData]=useState(undefined);
//     const [loading, setLoading]=useState(null);
//     const [error, setError]=useState(null);

//     const fn =async ()=>{
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await cb(...arguments);
//             setData(response);
//             setError(null);
//         } catch (err) {
//             setError(err);
//             toast.error(err.message || "Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { data, loading, error, fn ,setData};
//  };

//  export default useFetch;