package my.corejava;

/**
 * Created by Ilovezilian on 2016/10/18.
 */
public class Test {
    public static void main(String[] args) {
       short i = 4;
        long j = 5;
        Test instance = new Test();
        System.out.println( instance.add(i, 4));
        System.out.println( instance.add((int)j, 4));

        String s = "true";
        boolean ok = true;
        System.out.println(s.equals(ok));
    }
    int add(int a, int b){
        return a + b;
    }
}
