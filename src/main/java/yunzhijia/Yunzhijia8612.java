package yunzhijia;

import com.alibaba.fastjson.JSONObject;
import com.kingdee.eas.hr.ats.syn.httpclient.UrlUtil;
import kdweibo4j.http.AccessToken;
import kdweibo4j.http.OAuth;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Yunzhijia8612 extends HttpClient {
    private int reconnectCount;

    public static void main(String[] args) {

        String url = "http://kdweibo.com/snsapi/attendance/list.json";
        Map<String, Object> urlParamMap = new HashMap<String, Object>();
        urlParamMap.put("workDateFrom", "2025-03-10 00:00:00");
        urlParamMap.put("workDateTo", "2025-03-16 23:59:59");
        urlParamMap.put("start", 150);
        urlParamMap.put("limit", 1);
        urlParamMap.put("eid", "4444535");
        BizDataOAuthInfoDTO bizDataOAuthInfo = new BizDataOAuthInfoDTO();
        bizDataOAuthInfo.setConsumerkey("4pfBE6TU5AcRyEAu");
        bizDataOAuthInfo.setConsumersecret("9z6HGe3iwnnjKg2DCPXRulrQIzU4Q6bgYHN3oNcmKZ");
        bizDataOAuthInfo.setAccesstoken("335811dcfe89cc2311264f7637233f8");
        bizDataOAuthInfo.setAccesstokensecret("2297c89ad9c5bd71c6849707d27be7a");
        try {
            new Yunzhijia8612().accessWeiboUrlByGet(url, urlParamMap, bizDataOAuthInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String accessWeiboUrlByGet(String url, Map<String, Object> params, BizDataOAuthInfoDTO bizDataOAuthInfo) throws HttpException, IOException, Exception {
        String initUrl = url;
        System.out.println("-----httpclient accessWeiboUrlByGetEnter begin------");
        url = UrlUtil.assembleUrlGet(url, params);
        String consumer_key = bizDataOAuthInfo.getConsumerkey(), consumer_secret = bizDataOAuthInfo.getConsumersecret();
        OAuth myouth = new OAuth(consumer_key, consumer_secret);
        String acess_key = bizDataOAuthInfo.getAccesstoken(), acess_secret = bizDataOAuthInfo.getAccesstokensecret();

        AccessToken accessToken = new AccessToken(acess_key, acess_secret);

        GetMethod getMethod = new GetMethod(url);
        String outhHead = myouth.generateAuthorizationHeader("GET", url, null, accessToken);
        getMethod.setRequestHeader("Authorization", outhHead);
        getHttpConnectionManager().getParams().setConnectionTimeout(15000);
        getMethod.getParams().setSoTimeout(60000);


        int status = -1;
        try {
            String charset = Charset.defaultCharset().toString();
            System.out.println("-----httpclient executeMethod getMethod.getURI().toString()------" + URLDecoder.decode(getMethod.getURI().toString(), charset));
            System.out.println("-----httpclient executeMethod getMethod.getRequestHeaders()------" + URLDecoder.decode(Arrays.toString(getMethod.getRequestHeaders()),charset));
            System.out.println("-----httpclient executeMethod begin------");
            status = executeMethod(getMethod);
            System.out.println("-----httpclient executeMethod end.httpstatus------" + status);
        } catch (IOException e) {
            e.printStackTrace();
            getMethod.releaseConnection();
        }
        String content = "";

        StringBuffer sb = new StringBuffer();
        if (status == 200) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(getMethod.getResponseBodyAsStream()));

            String result = null;
            while ((result = reader.readLine()) != null) {
                sb.append(result);
            }


            getMethod.releaseConnection();

            JSONObject rootJSONObject = JSONObject.parseObject(sb.toString());
            if (!rootJSONObject.containsKey("data")) {
                if (this.reconnectCount < 3) {
                    try {
                        Thread.sleep(1000L);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("linked fail, try again reconnectCount" + this.reconnectCount);
//                    System.out.println("连接失败，请重试reconnectCount" + this.reconnectCount);
                    Yunzhijia8612 myHttpClient = new Yunzhijia8612();

                    myHttpClient.reconnectCount = ++this.reconnectCount;
                    return myHttpClient.accessWeiboUrlByGet(initUrl, params, bizDataOAuthInfo);
                }
//                throw new Exception("请求重试超过三次，请求仍然不成功");
                throw new Exception("try three failed");
            }

        } else if (status == 204) {
            getMethod.releaseConnection();
        } else {

            getMethod.releaseConnection();
            if (this.reconnectCount < 3) {
                try {
                    Thread.sleep(1000L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
//                    System.out.println("连接失败，请重试reconnectCount" + this.reconnectCount);
                System.out.println("linked fail, try again reconnectCount" + this.reconnectCount);
                Yunzhijia8612 myHttpClient = new Yunzhijia8612();

                myHttpClient.reconnectCount = ++this.reconnectCount;
                return myHttpClient.accessWeiboUrlByGet(initUrl, params, bizDataOAuthInfo);
            }
//                throw new Exception("请求重试超过三次，请求仍然不成功");
            throw new Exception("try three failed");
        }


        return sb.toString();
    }
}
