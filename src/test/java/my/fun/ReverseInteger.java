package my.fun;

public class ReverseInteger {
    public static void main(String[] args) {
        System.out.println("321 " + new ReverseInteger().reverse(123));
        System.out.println("-321 " + new ReverseInteger().reverse(-123));
        System.out.println("21 " + new ReverseInteger().reverse(120));
        System.out.println("0 " + new ReverseInteger().reverse(0));


        System.out.println("1534236469 " + new ReverseInteger().reverse(1534236469));
    }

    public int reverse(int x) {
        if (x == 0) {
            return x;
        }
        long ret = 0;
        for (; x != 0; x /= 10) {
            ret = ret * 10 + x % 10;
        }
        if (Math.abs(ret) > Integer.MAX_VALUE) {
            return 0;
        }
        return (int) ret;
    }
}
