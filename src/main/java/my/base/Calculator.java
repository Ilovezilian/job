package my.base;

/**
 * Created by Ilovezilian on 2017/7/8.
 */
public class Calculator {
    interface IntegerMath{
        int operation(int a, int b);
    }
    public int operationBinary(int a, int b, IntegerMath op){
        return op.operation(a, b);
    }

    public static void main(String[] args) {
        Calculator myApp = new Calculator();
        IntegerMath  addition = (a, b) -> a + b;
        IntegerMath subtraction = (a, b) -> a - b;
        System.out.println("2 + 3 = " + myApp.operationBinary(2, 3, addition));
        System.out.println("3 - 2 = " + myApp.operationBinary(3, 2, subtraction));

        System.out.println("2 + 3 = " + addition.operation(2, 3));
        System.out.println("3 - 2 = " + subtraction.operation(3,2));
    }
}
