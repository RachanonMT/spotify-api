import axios from "axios";

axios.interceptors.response.use(
     function (response) {
          if (response.data) {
               if (response.status === 200 || response.status === 201 || response.status === 202) {
                    return response;
               }
               return Promise.reject(response);
          }
          return Promise.reject(response);
     },
     function (error) {
          return Promise.reject(error);
     }
);