package my.helloworld;


/**
 * Created by Ilovezilian on 2016/7/8.
 */
public class HelloWorld {

    String test1 = "tello";

    {
        test1 = "hello";
        test1 = "hello";
        test1 = "hello";
        test1 = "hello";
        test1 = "hello";
    }

    public static void main(String[] args) {

        /**
         System.out.println("Hello World!");
         String s =  System.getProperty("user.dir");
         System.out.println("s="+s);
         String s = "";
         try {
         FileInputStream fin = new FileInputStream("E:\\work\\catch1.txt");
         InputStreamReader in = new InputStreamReader(fin, "utf-8");
         s = s + in.read();
         System.out.println("s:   "+s);
         fin.close();
         }catch(Exception e){
         e.printStackTrace();
         }
         */
        String s = "hello";
        System.out.print("my.helloworld!");

        String s1 = "he" + new String("llo");
        String s4 = "hello";
        s4 = "hello";
        s4 = "hello";
        s4 = "hello";
        s4 = "hello";
        s4 = "hello";
        s4 = "hello";
        String s5 = "hello";
        System.out.println(s == s1);
        System.out.println(s == s4);
    }

    public static void abc(int a) {
        System.out.println("ldjfls");
    }

}
