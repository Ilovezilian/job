package my.primary;
public class NewSwap {

    private void swap(Integer a, Integer b) {
        int temp = a;
        a = b;
        b = temp;
    }

    public void intSwap() {
        int a = 1, b = 2;
        (new NewSwap()).swap(a, b);
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        Integer aa = 1, bb = 2;
        swap(aa, bb);
        System.out.println("aa = " + aa);
        System.out.println("bb = " + bb);
    }
}
