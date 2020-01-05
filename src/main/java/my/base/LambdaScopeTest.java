package my.base;

import java.util.function.Consumer;

/**
 * Created by Ilovezilian on 2017/7/8.
 */
public class LambdaScopeTest {
    public int x = 0;

    class FirstLevel {
        public int x = 1;

        void methodInFirstLevel(int x) {
            Consumer<Integer> myConsumer = (y) ->
            {
                System.out.println("x = " + x);
                System.out.println("this.x = " + this.x);
                System.out.println("base.LambdaScopeTest.this.x = " + LambdaScopeTest.this.x);
            };

            myConsumer.accept(x);
        }

    }

    public static void main(String[] args) {
        LambdaScopeTest st = new LambdaScopeTest();
        FirstLevel fl = st.new FirstLevel();
        fl.methodInFirstLevel(2);
    }
}
