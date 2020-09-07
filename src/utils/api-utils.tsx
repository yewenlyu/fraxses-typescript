import { message } from 'antd';

/**
 * Type Definitions for HTTP request header and response data.
 */
type HeaderType = {
  'X-CSRFToken': string;
  'Content-Type': string;
}

export type SuccessResponseDataType = {
  code: string;
  data: any;
}

export type ErrorResponseDataType = {
  code: string;
  error: string;
}

type ResponseDataType = SuccessResponseDataType | ErrorResponseDataType;
interface ParamsType { [key: string]: string | number };

/**
 * The only hard coded CSRF token, the rest should be extracted from cookies using parseCookies('csrf_token') after logging in
 */
const LOGIN_CSRFToken: string = "ImI0M2ZlZjgxZmRiNTAwZWMxYmE4NDYzYjQzNTM1MDFmZTk5OWRjOGEi.Xyw2Iw.xYuZelp39q-HpjGf_abdtEdT-Ag";

/**
 * Utility function to get specific info from cookies
 * @param key : 'csrf_token' | 'session'
 * @returns : string - section of cookie
 */
const parseCookies = (key: string): string => {
  let match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
  if (match) {
    let result = "";
    try {
      result = decodeURIComponent(match[2]);
    } catch (error) {
      console.warn("Cookie parse error: ", error);
    }
    return result;
  };
  return "";
}

/**
 * Generate query string from parameters object for GET request URL
 * @param params : { [key: string]: string | number } - parameters object
 */
const queryString = (params: ParamsType): string =>
  Object.keys(params).map((key: string): string =>
    encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  ).join('&');

/**
 * POST HTTP Request API
 * @param url : string - rooted at proxy in package.json, start with 
 * @param requestData : string - JSON string, e.g. JSON.stringify(rawData)
 * @returns : Promise<ResponseDataType> - Promise resolves to JSON respond body
 */
export const post = async (url: string, requestData?: string): Promise<ResponseDataType> => {

  let header: HeaderType = {
    'X-CSRFToken': (url === '/api/account/login') ? LOGIN_CSRFToken : parseCookies('csrf_token'),
    'Content-Type': 'application/json'
  }

  return fetch(url, {
    method: 'POST',
    headers: header,
    body: requestData
  })
    .then((response: Response): Promise<any> => response.json())
    .then((responseData: ResponseDataType) => {
      if (responseData.code === 'OK') {
        console.log('SUCCESS!', url, header, requestData, responseData);
      } else {
        console.warn('FAIL!', url, header, requestData, responseData);
      }
      return responseData;
    });
}

/**
 * GET HTTP Request API
 * @param url : string - rooted at proxy in package.json, start with "/"
 * @returns : Promise<ResponseDataType> - Promise resolves to JSON respond body
 */
export const get = async (url: string, params?: ParamsType): Promise<ResponseDataType> => {

  if (params !== undefined) {
    url = url + '?' + queryString(params);
  }

  return fetch(url, {
    method: 'GET'
  })
    .then((response: Response): Promise<any> => response.json())
    .then((responseData: ResponseDataType) => {
      if (responseData.code === 'OK') {
        console.log('SUCCESS!', url, responseData);
      } else {
        console.warn('FAIL!', url, responseData);
      }
      return responseData;
    });
}

/**
 * Utility function to handle different error
 */
export const handleError = (errorCode: string, language: 'en-us' | 'zh-hans') => {

  if (messageLanguageMap.get(errorCode) === undefined) {
    message.error(messageLanguageMap.get("default") + errorCode)
    return;
  }

  if (language === 'en-us') {
    message.warn(messageLanguageMap.get(errorCode)?.["en-us"]);
  }
  else if (language === 'zh-hans') {
    message.warn(messageLanguageMap.get(errorCode)?.["zh-hans"]);
  }
}

/**
 * Product informations defined in API
 */
interface ProductsInfoType {
  [key: string]: {
    productId: number,
    productName: string,
    productDescription: string
  }
}
export const ProductsInfo: ProductsInfoType = {
  "EV Management": {
    productId: 1,
    productName: "ev",
    productDescription: "EV"
  },
  "ESS Management": {
    productId: 2,
    productName: "ess",
    productDescription: "ESS"
  },
  "R&D Management": {
    productId: 3,
    productName: "rd",
    productDescription: "RD"
  }
}

/**
 * Error messages for corresponding error codes in Engish and Chinese
 */
type LanguageMapType = Map<string, { "en-us": string; "zh-hans": string }>;
export const messageLanguageMap: LanguageMapType = new Map([
  ["User Not Exist",
    {
      "en-us": "The credential you provided does not match our record. Please try again. ",
      "zh-hans": "您所提供的登录信息有误，请重试。"
    }
  ],
  [
    "Password Error",
    {
      "en-us": "The credential you provided does not match our record. Please try again. ",
      "zh-hans": "您所提供的登录信息有误，请重试。"
    }
  ],
  [
    "Login Required",
    {
      "en-us": "Login is required for this operation.",
      "zh-hans": "此操作需要登录权限，请登录。"
    }
  ],
  [
    "Product Not Allow",
    {
      "en-us": "Product permission denied. Please contact administrator. ",
      "zh-hans": "您暂时没有使用此服务的权限，请联系管理员。"
    }
  ],
  [
    "Internal Server Error",
    {
      "en-us": "Internal Server Error. Please contact administrator. ",
      "zh-hans": "系统内部错误，请联系管理员。"
    }
  ],
  [
    "External Error",
    {
      "en-us": "External Error. Please contact administrator. ",
      "zh-hans": "系统外部错误，请联系管理员。"
    }
  ],
  [
    "Method Not Allowed",
    {
      "en-us": "HTTP method Error. Please contact administrator. ",
      "zh-hans": "无效的HTTP请求，请联系管理员。"
    }
  ],
  [
    "defualt",
    {
      "en-us": "An unkown error has occured, CODE: ",
      "zh-hans": "未知错误，错误码："
    }
  ]
])
