package my.base;

/**
 * Created by Ilovezilian on 2017/7/5.
 */
public class Shadow {
    public int x = 0;

    class FirstLevel {
        public int x = 1;

        void methodInFirstLevel(int x) {
            System.out.println("x = " + x);
            System.out.println("this.x = " + this.x);
            System.out.println("base.Shadow.this.x = " + Shadow.this.x);
        }
    }

    public static void main(String[] args) {
        Shadow sd = new Shadow();
        FirstLevel fl = sd.new FirstLevel();
        fl.methodInFirstLevel(23);

    }
}
